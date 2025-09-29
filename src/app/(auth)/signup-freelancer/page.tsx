
'use client';
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import ProfileStep from "@/components/onboarding/ProfileStep";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAccount } from "wagmi";
import { ConnectButton } from "@/components/ConnectButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet } from "lucide-react";
import { generateCvWallet } from "@/ai/flows/generate-cv-wallet-from-prompt";

export default function SignupFreelancerPage() {
  const { isConnected } = useAccount();

  return (
    <OnboardingLayout currentStep={1} totalSteps={4} title="Create your Profile">
      <div className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="p-8 md:p-12 flex flex-col justify-center">
           <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none font-headline mb-6">
            <span className="gradient-text">Create your Profile</span>
          </h1>
          {isConnected ? (
            <ProfileStep />
          ) : (
            <div className="space-y-4">
              <Alert>
                <Wallet className="h-4 w-4" />
                <AlertTitle>Connect your wallet to begin</AlertTitle>
                <AlertDescription>
                  Your wallet is your identity on MeritBase. Please connect your wallet to start creating your CVWallet.
                </AlertDescription>
              </Alert>
              <ConnectButton />
            </div>
          )}
        </div>
        <div className="hidden md:flex flex-col justify-center p-8 md:p-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-l border-white/10">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold font-headline">Join a community of top-tier talents</h2>
                <p className="text-muted-foreground">
                    Create your CVWallet, showcase your skills, and get matched with the best decentralized opportunities. Your reputation is your currency.
                </p>
                <div className="flex items-center -space-x-2">
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/101/100/100" data-ai-hint="professional portrait" />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                     <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/102/100/100" data-ai-hint="person coding" />
                        <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                     <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/103/100/100" data-ai-hint="designer working" />
                        <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                        +10k
                    </div>
                </div>
            </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
