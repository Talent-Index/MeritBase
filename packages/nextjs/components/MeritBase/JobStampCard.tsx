"use client";

import { Address } from "~~/components/scaffold-eth";

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

interface JobStampCardProps {
  stamp: JobStamp;
  isMobile?: boolean;
}

export default function JobStampCard({ stamp, isMobile = false }: JobStampCardProps) {
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base text-gray-900 flex-1 pr-2">
            {stamp.jobTitle}
          </h3>
          <div className="flex items-center">
            {renderStars(stamp.rating)}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {stamp.summary}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="truncate flex-1 mr-2">
            Client: <Address address={stamp.client} />
          </span>
          <span className="whitespace-nowrap">
            {formatDate(stamp.completedDate)}
          </span>
        </div>
        
        {stamp.isVerified && (
          <div className="mt-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              ✓ Verified
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-xl text-gray-900">
          {stamp.jobTitle}
        </h3>
        <div className="flex items-center">
          {renderStars(stamp.rating)}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">
        {stamp.summary}
      </p>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span>
          Client: <Address address={stamp.client} />
        </span>
        <span>
          Completed: {formatDate(stamp.completedDate)}
        </span>
      </div>
      
      {stamp.isVerified && (
        <div className="flex items-center">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            ✓ Verified Attestation
          </span>
        </div>
      )}
    </div>
  );
}
