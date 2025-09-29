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
import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from 'siwe';
import { ConnectButton } from "@/components/ConnectButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function SignupEmployerPage() {
  const [isPending, setIsPending] = useState(false);
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setIsPending(true);
      const res = await fetch('/api/auth/nonce');
      const { nonce } = await res.json();
      
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

      if (!verifyRes.ok) throw new Error('Failed to verify signature.');
      
      const { ok } = await verifyRes.json();
      if(ok) {
        toast({
          title: "Authenticated!",
          description: "You have successfully signed in.",
        });
        router.push('/dashboard-employer');
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
      setIsPending(false);
    }
  };
  
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
              <Input id="company-name" placeholder="DecentraCorp" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="hr@example.com" 
                required 
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
          <Button className="w-full" onClick={handleSignIn} disabled={isPending || !isConnected}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In & Create Company Account
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
