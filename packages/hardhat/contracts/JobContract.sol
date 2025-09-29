// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FreelancerRegistry.sol";
import "./EmployerRegistry.sol";

/// @title JobContract - Coordinates job lifecycle, applications, and reputation for Meritbase
contract JobContract is Ownable {
    enum JobStatus {
        Draft,
        Open,
        InReview,
        Completed,
        Cancelled
    }

    enum ApplicationStatus {
        None,
        Pending,
        Shortlisted,
        Approved,
        Rejected,
        Withdrawn
    }

    struct Job {
        uint256 id;
        address employer;
        string title;
        string descriptionCid; // IPFS CID with full job description JSON
        string requirementsCid; // IPFS CID with structured requirements used for AI matching
        uint16 openings;
        uint256 createdAt;
        JobStatus status;
    }

    struct Application {
        address freelancer;
        string proposalCid; // IPFS CID for proposal/cover letter data
        ApplicationStatus status;
        uint96 matchScore; // Stored as basis points (0-10000)
        uint256 updatedAt;
    }

    struct Reputation {
        uint64 cumulativeRating; // sum of ratings
        uint32 ratingCount;
        uint32 gigsCompleted;
        string[] badgeCids; // IPFS metadata for earned badges
    }

    FreelancerRegistry public immutable freelancerRegistry;
    EmployerRegistry public immutable employerRegistry;

    uint256 public jobCount;

    mapping(uint256 => Job) private jobs;
    mapping(uint256 => address[]) private jobApplicants;
    mapping(uint256 => mapping(address => Application)) private jobApplications;
    mapping(address => Reputation) private freelancerReputation;

    event JobCreated(uint256 indexed jobId, address indexed employer, string title, uint16 openings);
    event JobStatusChanged(uint256 indexed jobId, JobStatus status);
    event ApplicationSubmitted(uint256 indexed jobId, address indexed freelancer, string proposalCid);
    event ApplicationStatusUpdated(
        uint256 indexed jobId,
        address indexed freelancer,
        ApplicationStatus status,
        uint96 matchScore
    );
    event GigReviewRecorded(
        uint256 indexed jobId,
        address indexed freelancer,
        uint8 rating,
        string reviewCid,
        string badgeCid
    );

    error EmployerNotVerified();
    error FreelancerNotVerified();
    error InvalidJob();
    error InvalidApplication();
    error NotJobOwner();
    error JobNotOpen();
    error InvalidStatusTransition();
    error InvalidScore();

    constructor(
        address initialOwner,
        FreelancerRegistry _freelancerRegistry,
        EmployerRegistry _employerRegistry
    ) Ownable(initialOwner) {
        freelancerRegistry = _freelancerRegistry;
        employerRegistry = _employerRegistry;
    }

    modifier onlyJobEmployer(uint256 jobId) {
        if (jobs[jobId].employer != msg.sender && owner() != msg.sender) {
            revert NotJobOwner();
        }
        _;
    }

    function createJob(
        string calldata title,
        string calldata descriptionCid,
        string calldata requirementsCid,
        uint16 openings
    ) external returns (uint256 jobId) {
        if (!employerRegistry.isApproved(msg.sender)) {
            revert EmployerNotVerified();
        }
        if (bytes(title).length == 0 || bytes(descriptionCid).length == 0 || bytes(requirementsCid).length == 0) {
            revert InvalidJob();
        }
        if (openings == 0) {
            revert InvalidJob();
        }

        jobId = ++jobCount;
        jobs[jobId] = Job({
            id: jobId,
            employer: msg.sender,
            title: title,
            descriptionCid: descriptionCid,
            requirementsCid: requirementsCid,
            openings: openings,
            createdAt: block.timestamp,
            status: JobStatus.Open
        });

        emit JobCreated(jobId, msg.sender, title, openings);
        emit JobStatusChanged(jobId, JobStatus.Open);
    }

    function updateJobStatus(uint256 jobId, JobStatus status) external onlyJobEmployer(jobId) {
        Job storage job = jobs[jobId];
        if (job.id == 0) {
            revert InvalidJob();
        }

        if (job.status == JobStatus.Cancelled || job.status == JobStatus.Completed) {
            revert InvalidStatusTransition();
        }

        job.status = status;
        emit JobStatusChanged(jobId, status);
    }

    function applyToJob(uint256 jobId, string calldata proposalCid) external {
        Job storage job = jobs[jobId];
        if (job.id == 0) {
            revert InvalidJob();
        }
        if (job.status != JobStatus.Open) {
            revert JobNotOpen();
        }
        if (!freelancerRegistry.isApproved(msg.sender)) {
            revert FreelancerNotVerified();
        }
        if (bytes(proposalCid).length == 0) {
            revert InvalidApplication();
        }

        Application storage application = jobApplications[jobId][msg.sender];
        if (application.status == ApplicationStatus.None) {
            jobApplicants[jobId].push(msg.sender);
        }

        application.freelancer = msg.sender;
        application.proposalCid = proposalCid;
        application.status = ApplicationStatus.Pending;
        application.matchScore = 0;
        application.updatedAt = block.timestamp;

        emit ApplicationSubmitted(jobId, msg.sender, proposalCid);
        emit ApplicationStatusUpdated(jobId, msg.sender, ApplicationStatus.Pending, 0);
    }

    function withdrawApplication(uint256 jobId) external {
        Application storage application = jobApplications[jobId][msg.sender];
        if (application.status == ApplicationStatus.None) {
            revert InvalidApplication();
        }
        application.status = ApplicationStatus.Withdrawn;
        application.updatedAt = block.timestamp;
        emit ApplicationStatusUpdated(jobId, msg.sender, ApplicationStatus.Withdrawn, application.matchScore);
    }

    function recordShortlist(
        uint256 jobId,
        address[] calldata shortlisted,
        uint96[] calldata scores
    ) external onlyJobEmployer(jobId) {
        if (shortlisted.length != scores.length) {
            revert InvalidApplication();
        }
        Job storage job = jobs[jobId];
        if (job.id == 0) {
            revert InvalidJob();
        }
        if (job.status == JobStatus.Cancelled || job.status == JobStatus.Completed) {
            revert InvalidStatusTransition();
        }

        for (uint256 i = 0; i < shortlisted.length; i++) {
            address freelancer = shortlisted[i];
            Application storage application = jobApplications[jobId][freelancer];
            if (application.status == ApplicationStatus.None) {
                revert InvalidApplication();
            }
            if (scores[i] > 10000) {
                revert InvalidScore();
            }
            application.status = ApplicationStatus.Shortlisted;
            application.matchScore = scores[i];
            application.updatedAt = block.timestamp;
            emit ApplicationStatusUpdated(jobId, freelancer, ApplicationStatus.Shortlisted, scores[i]);
        }

        job.status = JobStatus.InReview;
        emit JobStatusChanged(jobId, JobStatus.InReview);
    }

    function recordFinalSelection(uint256 jobId, address[] calldata accepted) external onlyJobEmployer(jobId) {
        Job storage job = jobs[jobId];
        if (job.id == 0) {
            revert InvalidJob();
        }
        if (job.status != JobStatus.InReview && job.status != JobStatus.Open) {
            revert InvalidStatusTransition();
        }

        for (uint256 i = 0; i < accepted.length; i++) {
            address freelancer = accepted[i];
            Application storage application = jobApplications[jobId][freelancer];
            if (application.status == ApplicationStatus.None) {
                revert InvalidApplication();
            }
            application.status = ApplicationStatus.Approved;
            application.updatedAt = block.timestamp;
            emit ApplicationStatusUpdated(jobId, freelancer, ApplicationStatus.Approved, application.matchScore);
        }

        job.status = JobStatus.Completed;
        emit JobStatusChanged(jobId, JobStatus.Completed);
    }

    function recordRejection(uint256 jobId, address[] calldata rejected) external onlyJobEmployer(jobId) {
        Job storage job = jobs[jobId];
        if (job.id == 0) {
            revert InvalidJob();
        }

        for (uint256 i = 0; i < rejected.length; i++) {
            address freelancer = rejected[i];
            Application storage application = jobApplications[jobId][freelancer];
            if (application.status == ApplicationStatus.None) {
                revert InvalidApplication();
            }
            application.status = ApplicationStatus.Rejected;
            application.updatedAt = block.timestamp;
            emit ApplicationStatusUpdated(jobId, freelancer, ApplicationStatus.Rejected, application.matchScore);
        }
    }

    function recordGigReview(
        uint256 jobId,
        address freelancer,
        uint8 rating,
        string calldata reviewCid,
        string calldata badgeCid
    ) external onlyJobEmployer(jobId) {
        if (rating < 1 || rating > 5) {
            revert InvalidScore();
        }
        if (bytes(reviewCid).length == 0) {
            revert InvalidApplication();
        }

        Application storage application = jobApplications[jobId][freelancer];
        if (application.status != ApplicationStatus.Approved) {
            revert InvalidApplication();
        }

        Reputation storage reputation = freelancerReputation[freelancer];
        reputation.cumulativeRating += rating;
        reputation.ratingCount += 1;
        reputation.gigsCompleted += 1;
        if (bytes(badgeCid).length > 0) {
            reputation.badgeCids.push(badgeCid);
        }

        emit GigReviewRecorded(jobId, freelancer, rating, reviewCid, badgeCid);
    }

    function cancelJob(uint256 jobId) external onlyJobEmployer(jobId) {
        Job storage job = jobs[jobId];
        if (job.id == 0) {
            revert InvalidJob();
        }
        job.status = JobStatus.Cancelled;
        emit JobStatusChanged(jobId, JobStatus.Cancelled);
    }

    // View helpers
    function getJob(uint256 jobId) external view returns (Job memory) {
        return jobs[jobId];
    }

    function getJobApplicants(uint256 jobId) external view returns (address[] memory) {
        return jobApplicants[jobId];
    }

    function getApplication(uint256 jobId, address freelancer) external view returns (Application memory) {
        return jobApplications[jobId][freelancer];
    }

    function getFreelancerReputation(address freelancer) external view returns (Reputation memory) {
        return freelancerReputation[freelancer];
    }
}