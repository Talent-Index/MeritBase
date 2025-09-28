"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { AddressInput } from "~~/components/scaffold-eth";
import ProfileCard from "~~/components/MeritBase/ProfileCard";
import JobStampCard from "~~/components/MeritBase/JobStampCard";
import { PostJobForm } from "~~/components/MeritBase/PostJobForm";
import { MyApplications } from "~~/components/MeritBase/MyApplications";

interface UserProfile {
  name: string;
  pseudonym: string;
  skills: string[];
  workCategories: string[];
  isActive: boolean;
  createdAt: bigint;
  lastUpdated: bigint;
}

interface JobStamp {
  tokenId: bigint;
  client: string;
  jobTitle: string;
  summary: string;
  rating: number;
  completedDate: bigint;
  clientSignature: string;
  isVerified: boolean;
}

export default function MeritBasePage() {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stamps, setStamps] = useState<JobStamp[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGiveStampModalOpen, setIsGiveStampModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    pseudonym: "",
    skills: "",
    workCategories: "",
  });
  const [stampData, setStampData] = useState({
    workerAddress: "",
    jobTitle: "",
    summary: "",
    rating: 5,
    clientSignature: "",
  });

  // Read user profile
  const { data: userProfile, refetch: refetchProfile } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "getUserProfile",
    args: [address] as const,
  });

  // Read user stamp
  const { data: userStamps } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "getUserStamps",
    args: [address] as const,
  });

  // Read user average rating
  const { data: averageRating } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "getUserAverageRating",
    args: [address] as const,
  });


  // Read user stamps
  const { data: stampsCount } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "getUserStampsCount",
    args: [address] as const,
  });

  // Write contract functions
  const { writeContractAsync: writeMeritBaseAsync } = useScaffoldWriteContract({
    contractName: "MeritBase",
  });

  // Check if user is registered
  const { data: isRegistered } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "registeredUsers",
    args: [address] as const,
  });

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile as UserProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userStamps && Array.isArray(userStamps)) {
      // Fetch individual stamp details
      const fetchStamps = async () => {
        const stampPromises = userStamps.map(async (tokenId: bigint) => {
          // This would need to be implemented as a separate hook or API call
          // For now, we'll create a mock structure
          return {
            tokenId,
            client: "0x0000000000000000000000000000000000000000",
            jobTitle: "Sample Job",
            summary: "Sample job summary",
            rating: 5,
            completedDate: BigInt(Date.now() / 1000),
            clientSignature: "Sample signature",
            isVerified: true,
          };
        });
        const stampsData = await Promise.all(stampPromises);
        setStamps(stampsData);
      };
      fetchStamps();
    }
  }, [userStamps]);

  const handleCreateProfile = async () => {
    if (!profileData.name.trim()) return;

    const skillsArray = profileData.skills
      .split(",")
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    const workCategoriesArray = profileData.workCategories
      .split(",")
      .map(category => category.trim())
      .filter(category => category.length > 0);

    try {
      await writeMeritBaseAsync({
        functionName: "createProfile",
        args: [profileData.name, profileData.pseudonym, skillsArray, workCategoriesArray],
      });
      setIsProfileModalOpen(false);
      refetchProfile();
      // also register profile off-chain for matching
      try {
        await fetch('/api/meritbase/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: address ?? '',
            name: profileData.name,
            pseudonym: profileData.pseudonym,
            skills: skillsArray,
            workCategories: workCategoriesArray,
            isActive: true,
          }),
        });
      } catch (e) {
        console.error('Failed to register profile off-chain', e);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const handleGiveStamp = async () => {
    if (!stampData.workerAddress || !stampData.jobTitle.trim()) return;

    try {
      await writeMeritBaseAsync({
        functionName: "giveStamp",
        args: [
          stampData.workerAddress,
          stampData.jobTitle,
          stampData.summary,
          stampData.rating,
          stampData.clientSignature,
        ],
      });
      setIsGiveStampModalOpen(false);
      setStampData({
        workerAddress: "",
        jobTitle: "",
        summary: "",
        rating: 5,
        clientSignature: "",
      });
    } catch (error) {
      console.error("Error giving stamp:", error);
    }
  };


  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">MeritBase</h1>
          <p className="text-xl text-gray-600">Please connect your wallet to access your decentralized CV</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <PostJobForm
            onPosted={async (job: any) => {
              // trigger matching for the job
              try {
                await fetch('/api/meritbase/match', { method: 'POST', body: JSON.stringify({ jobId: job.id }) });
              } catch (e) {
                console.error('Match trigger failed', e);
              }
            }}
          />
        </div>
        <div className="mb-6">
          <MyApplications address={address} />
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">MeritBase</h1>
          <p className="text-xl text-gray-800">Your Decentralized Professional Identity</p>
        </div>

        {/* Profile Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-black">Your Profile</h2>
            {!isRegistered && (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Profile
              </button>
            )}
          </div>

          {isRegistered && profile ? (
            <ProfileCard
              profile={profile}
              address={address!}
              stampsCount={stampsCount}
              averageRating={averageRating}
              showQR={true}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-800 mb-4">You haven&apos;t created a profile yet.</p>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your Profile
              </button>
            </div>
          )}
        </div>


        {/* Job Stamps Section */}
        {isRegistered && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-black">Your Job Stamps</h2>
              <button
                onClick={() => setIsGiveStampModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Give Stamp
              </button>
            </div>

            {stamps.length > 0 ? (
              <div className="space-y-4">
                {stamps.map((stamp, index) => (
                  <JobStampCard key={index} stamp={stamp} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-800">No job stamps yet. Complete work to receive verifiable attestations!</p>
              </div>
            )}
          </div>
        )}

        {/* Create Profile Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-black">Create Your Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Pseudonym</label>
                  <input
                    type="text"
                    value={profileData.pseudonym}
                    onChange={(e) => setProfileData({ ...profileData, pseudonym: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Your professional pseudonym"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Skills</label>
                  <input
                    type="text"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="React, Solidity, Design (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Work Categories</label>
                  <input
                    type="text"
                    value={profileData.workCategories}
                    onChange={(e) => setProfileData({ ...profileData, workCategories: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Web Development, Smart Contracts, UI/UX (comma separated)"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Give Stamp Modal */}
        {isGiveStampModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-black">Give a Job Stamp</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Worker Address *</label>
                  <AddressInput
                    value={stampData.workerAddress}
                    onChange={(value) => setStampData({ ...stampData, workerAddress: value })}
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={stampData.jobTitle}
                    onChange={(e) => setStampData({ ...stampData, jobTitle: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., Smart Contract Development"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Summary *</label>
                  <textarea
                    value={stampData.summary}
                    onChange={(e) => setStampData({ ...stampData, summary: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    rows={3}
                    placeholder="Describe the work completed..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Rating</label>
                  <select
                    aria-label="Rating"
                    value={stampData.rating}
                    onChange={(e) => setStampData({ ...stampData, rating: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Client Signature</label>
                  <input
                    type="text"
                    value={stampData.clientSignature}
                    onChange={(e) => setStampData({ ...stampData, clientSignature: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Your signature for verification"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsGiveStampModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGiveStamp}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Give Stamp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
