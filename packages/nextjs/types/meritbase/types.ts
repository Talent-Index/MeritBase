export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type JobStatus = "DRAFT" | "OPEN" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";
export type ApplicationStatus = "PENDING" | "SHORTLISTED" | "APPROVED" | "REJECTED" | "WITHDRAWN";

export interface FreelancerProfile {
  address: string;
  fullName: string;
  email: string;
  phone: string;
  summary?: string;
  skills: string[];
  profileCid: string;
  govIdCid: string;
  cvCid: string;
  cvHash: string;
  status: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  onchain?: unknown;
  reputation?: {
    cumulativeRating: number;
    ratingCount: number;
    gigsCompleted: number;
    badges: string[];
  };
}

export interface EmployerProfile {
  address: string;
  companyName: string;
  contactEmail: string;
  licenseCid: string;
  status: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  onchain?: unknown;
}

export interface MeritbaseJob {
  id: number;
  employerAddress: string;
  title: string;
  descriptionCid: string;
  requirementsCid: string;
  openings: number;
  status: JobStatus;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeritbaseApplication {
  id: number;
  jobId: number;
  freelancerAddress: string;
  proposalCid: string;
  status: ApplicationStatus;
  matchScore: number;
  matchExplanation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeritbaseReview {
  id: number;
  jobId: number;
  employerAddress: string;
  freelancerAddress: string;
  rating: number;
  reviewCid: string;
  badgeCid?: string | null;
  createdAt: string;
}

export interface MatchScore {
  freelancerAddress: string;
  jobId: number;
  score: number;
  explanation: string;
}

export type OnboardingStep = "profile" | "kyc" | "wallet" | "complete";