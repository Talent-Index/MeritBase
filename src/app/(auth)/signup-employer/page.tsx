
'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Loader2, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage, useContractWrite, useWaitForTransaction } from "wagmi";
import { SiweMessage } from 'siwe';
import { ConnectButton } from "@/components/ConnectButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignupEmployerPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [contracts, setContracts] = useState<any>(null);
  
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Dynamically import contracts on the client-side
    import('@/lib/contracts').then(module => {
      setContracts(module.contracts);
    });
  }, []);

  // In a real app, this would come from an IPFS upload.
  const licenseCid = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

  const { data, write, isLoading: isContractWriteLoading, isError, error } = useContractWrite({
    address: contracts?.EmployerRegistry.address,
    abi: contracts?.EmployerRegistry.abi,
    functionName: 'registerEmployer',
    enabled: !!contracts, // Only enable when contracts are loaded
  });

  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
       toast({
          title: "Company Registered!",
          description: "Your company is now registered on-chain.",
        });
        router.push('/dashboard-employer');
    },
    onError(error) {
       toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message,
      });
    }
  });


  const handleSignInAndRegister = async () => {
    if (!companyName || !workEmail) {
      toast({
        variant: "destructive",
        title: "All Fields Required",
        description: "Please enter your company's name and work email.",
      });
      return;
    }

    setIsSigningIn(true);
    try {
      const nonceRes = await fetch('/api/auth/nonce');
      if (!nonceRes.ok) throw new Error('Failed to fetch nonce.');
      const { nonce } = await nonceRes.json();
      
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to MeritBase as an employer.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.message || 'Failed to verify signature.');
      }
      
      const { ok } = await verifyRes.json();
      if(ok) {
        toast({
          title: "Authenticated!",
          description: "Please confirm the transaction to register your company.",
        });
         if (!write) {
            toast({
                variant: "destructive",
                title: "Contracts not loaded",
                description: "The smart contract details could not be loaded. Please refresh and try again.",
            });
            if (isError) console.error("Contract write error:", error);
            return;
        }
        // Now call the smart contract
        write({
          args: [address, companyName, workEmail, licenseCid],
        });
      } else {
         throw new Error('Verification failed on server.');
      }

    } catch (error: any) {
      console.error("Sign-in Error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const isPending = isSigningIn || isContractWriteLoading || isTxLoading;
  
  return (
    <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Join as an Employer</CardTitle>
          <CardDescription>
            Find and hire top decentralized talent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name" 
                placeholder="DecentraCorp" 
                required 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="hr@example.com" 
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="license">Company License</Label>
                <div className="relative">
                    <Input id="license" type="file" className="pl-12" required />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FileUp className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">For verification purposes only. Your data is secure.</p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertTitle>Connect your wallet to begin</AlertTitle>
              <AlertDescription>
                Your wallet will be used to sign in and manage your company's identity on MeritBase.
              </AlertDescription>
            </Alert>
            <ConnectButton />
          </div>
        )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignInAndRegister} disabled={isPending || !isConnected}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSigningIn ? "Signing In..." : isContractWriteLoading ? "Waiting for Approval..." : isTxLoading ? "Registering..." : "Sign In & Register Company"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/dashboard-employer" className="underline hover:text-primary">
                  Login
              </Link>
          </p>
        </CardFooter>
    </Card>
  );
}
