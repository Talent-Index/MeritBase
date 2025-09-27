"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import ProfileCard from "~~/components/MeritBase/ProfileCard";
import JobStampCard from "~~/components/MeritBase/JobStampCard";

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

export default function ProfilePage() {
  const params = useParams();
  const address = params.address as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stamps, setStamps] = useState<JobStamp[]>([]);
  const [loading, setLoading] = useState(true);

  // Read user profile
  const { data: userProfile, isLoading: profileLoading } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "getUserProfile",
    args: address ? [address] : undefined,
  });

  // Read user stamps
  const { data: userStamps, isLoading: stampsLoading } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "getUserStamps",
    args: address ? [address] : undefined,
  });

  // Read user average rating
  const { data: averageRating } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "getUserAverageRating",
    args: address ? [address] : undefined,
  });

  // Read user stamps count
  const { data: stampsCount } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "getUserStampsCount",
    args: address ? [address] : undefined,
  });

  // Check if user is registered
  const { data: isRegistered } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "registeredUsers",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile as UserProfile);
    }
    setLoading(profileLoading || stampsLoading);
  }, [userProfile, profileLoading, stampsLoading]);

  useEffect(() => {
    if (userStamps && Array.isArray(userStamps)) {
      // For now, create mock stamp data
      // In a real implementation, you'd fetch individual stamp details
      const mockStamps: JobStamp[] = userStamps.map((tokenId: bigint, index: number) => ({
        tokenId,
        client: "0x0000000000000000000000000000000000000000",
        jobTitle: `Sample Job ${index + 1}`,
        summary: `This is a sample job summary for stamp ${index + 1}`,
        rating: 5,
        completedDate: BigInt(Date.now() / 1000 - (index * 86400)), // Spread over days
        clientSignature: `Sample signature ${index + 1}`,
        isVerified: true,
      }));
      setStamps(mockStamps);
    }
  }, [userStamps]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-xl text-gray-600">This address has not created a MeritBase profile yet.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-xl text-gray-600">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">MeritBase Profile</h1>
          <p className="text-xl text-gray-800">Decentralized Professional Identity</p>
        </div>

        {/* Profile Card */}
        <ProfileCard
          profile={profile}
          address={address}
          stampsCount={stampsCount}
          averageRating={averageRating}
          showQR={true}
        />

        {/* Job Stamps */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-black">Verified Job Stamps</h2>
          
          {stamps.length > 0 ? (
            <div className="space-y-4">
              {stamps.map((stamp, index) => (
                <JobStampCard key={index} stamp={stamp} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-800">No job stamps available yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Powered by MeritBase - Decentralized Professional Identity</p>
        </div>
      </div>
    </div>
  );
}
