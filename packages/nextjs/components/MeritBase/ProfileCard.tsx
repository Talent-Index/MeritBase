"use client";

import { Address } from "~~/components/scaffold-eth";
import { QRCodeSVG } from "qrcode.react";

interface UserProfile {
  name: string;
  pseudonym: string;
  skills: string[];
  workCategories: string[];
  isActive: boolean;
  createdAt: bigint;
  lastUpdated: bigint;
}

interface ProfileCardProps {
  profile: UserProfile;
  address: string;
  stampsCount?: bigint;
  averageRating?: bigint;
  isMobile?: boolean;
  showQR?: boolean;
}

export default function ProfileCard({ 
  profile, 
  address, 
  stampsCount, 
  averageRating, 
  isMobile = false,
  showQR = true 
}: ProfileCardProps) {
  const generateProfileQR = () => {
    return `https://meritbase.app/profile/${address}`;
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-black mb-1">
            {profile.name}
          </h2>
          {profile.pseudonym && (
            <p className="text-gray-800 text-sm mb-2">@{profile.pseudonym}</p>
          )}
            <div className="flex items-center mb-2">
              <Address address={address} />
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              profile.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          {showQR && (
            <div className="ml-4">
              <QRCodeSVG value={generateProfileQR()} size={80} />
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="mb-4">
          <h3 className="font-semibold text-black mb-2 text-sm">Skills</h3>
          <div className="flex flex-wrap gap-1">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Work Categories */}
        <div className="mb-4">
          <h3 className="font-semibold text-black mb-2 text-sm">Work Categories</h3>
          <div className="flex flex-wrap gap-1">
            {profile.workCategories.map((category, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {stampsCount?.toString() || "0"}
            </div>
            <div className="text-xs text-gray-800">Stamps</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {averageRating ? (Number(averageRating) / 10).toFixed(1) : "0.0"}
            </div>
            <div className="text-xs text-gray-800">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {formatDate(profile.createdAt).split(' ')[1]}
            </div>
            <div className="text-xs text-gray-800">Joined</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-black mb-2">
            {profile.name}
          </h2>
          {profile.pseudonym && (
            <p className="text-xl text-gray-800 mb-4">@{profile.pseudonym}</p>
          )}
          <div className="flex items-center mb-4">
            <Address address={address} />
            <span className={`ml-3 px-3 py-1 rounded-full text-sm ${
              profile.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        {showQR && (
          <div className="mt-4 md:mt-0">
            <QRCodeSVG value={generateProfileQR()} size={120} />
          </div>
        )}
      </div>

      {/* Skills and Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-black mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-black mb-3">Work Categories</h3>
          <div className="flex flex-wrap gap-2">
            {profile.workCategories.map((category, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {stampsCount?.toString() || "0"}
          </div>
          <div className="text-sm text-gray-800">Total Stamps</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {averageRating ? (Number(averageRating) / 10).toFixed(1) : "0.0"}
          </div>
          <div className="text-sm text-gray-800">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">
            {formatDate(profile.createdAt)}
          </div>
          <div className="text-sm text-gray-800">Member Since</div>
        </div>
      </div>
    </div>
  );
}
