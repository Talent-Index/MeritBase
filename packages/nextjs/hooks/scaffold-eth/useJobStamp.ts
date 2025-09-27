import { useScaffoldReadContract } from "./useScaffoldReadContract";

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

export const useJobStamp = (tokenId: bigint | undefined) => {
  const {
    data: jobStamp,
    isLoading,
    error,
  } = useScaffoldReadContract({
    contractName: "MeritBase",
    functionName: "getJobStamp",
    args: [tokenId] as const,
  });

  return {
    jobStamp: jobStamp as JobStamp | undefined,
    isLoading,
    error,
  };
};
