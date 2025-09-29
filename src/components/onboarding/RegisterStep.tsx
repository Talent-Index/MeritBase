
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { contracts } from "@/lib/contracts";
import { keccak256, toHex } from "viem";

interface ProfileData {
    fullName: string;
    displayName: string;
    bio: string;
    skills: string[];
}

interface VerificationData {
    govIdFrontCid: string;
    govIdBackCid: string;
    selfieCid: string;
}

export default function RegisterStep() {
  const [isClient, setIsClient] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [verification, setVerification] = useState<VerificationData | null>(null);
  
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const profileData = localStorage.getItem('freelancerProfile');
    const verificationData = localStorage.getItem('freelancerVerification');
    if (profileData) {
      setProfile(JSON.parse(profileData));
    }
    if (verificationData) {
        setVerification(JSON.parse(verificationData));
    }
  }, []);

  const cvHash = profile ? keccak256(toHex(JSON.stringify(profile))) : '0x';

  const { data, write, isLoading: isContractWriteLoading } = useContractWrite({
    address: contracts.FreelancerRegistry.address,
    abi: contracts.FreelancerRegistry.abi,
    functionName: 'registerFreelancer',
  });

  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
       toast({
          title: "Registration Complete!",
          description: "Your professional identity is now on-chain.",
        });
        localStorage.removeItem('freelancerVerification');
        router.push('/dashboard-freelancer');
    },
    onError(error) {
       toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message,
      });
    }
  });
  
  const handleRegister = () => {
    if (!profile || !verification || !address) {
         toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Could not find profile or verification data. Please start over.",
        });
        return;
    }
    
    // In a real app, we would have CIDs for profile and CV.
    const profileCid = "ipfs://placeholder_profile_cid";
    const govIdCid = verification.govIdFrontCid; // Using one for simplicity

    write({
      args: [address, profile.displayName, profileCid, cvHash, govIdCid],
    });
  }

  const isPending = isContractWriteLoading || isTxLoading;

  if (!isClient || !profile) {
    return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Review Your Information</CardTitle>
                <CardDescription>This is the data that will be anchored to the blockchain.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Display Name:</span>
                    <span className="font-semibold">{profile.displayName}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Skills:</span>
                    <span className="font-semibold text-right">{profile.skills.join(', ')}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Identity Verified:</span>
                    <span className="font-semibold flex items-center gap-2 text-green-500">
                        <CheckCircle className="h-4 w-4" /> Complete
                    </span>
                </div>
                 <div className="flex flex-col space-y-2 pt-2">
                    <span className="text-muted-foreground">CV Hash (Proof):</span>
                    <span className="font-mono text-xs break-all">{cvHash}</span>
                </div>
            </CardContent>
        </Card>

        <Button 
            onClick={handleRegister} 
            disabled={!isConnected || isPending}
            size="lg" 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity"
        >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isContractWriteLoading ? "Waiting for Approval..." : isTxLoading ? "Registering on-chain..." : "Sign & Complete Registration"}
        </Button>
    </div>
  );
}
