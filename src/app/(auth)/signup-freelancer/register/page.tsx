
'use client';

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import RegisterStep from "@/components/onboarding/RegisterStep";

export default function RegisterPage() {
  return (
    <OnboardingLayout currentStep={4} totalSteps={4} title="Register On-Chain">
       <div className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="p-8 md:p-12 flex flex-col justify-center">
           <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none font-headline mb-6">
            <span className="gradient-text">Final Step: Register On-Chain</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            You're all set! Review your information and sign the final transaction to create your permanent, decentralized professional identity on the Polygon network.
          </p>
          <RegisterStep />
        </div>
        <div className="hidden md:flex flex-col items-center justify-center p-8 md:p-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-l border-white/10">
            <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold font-headline">What this means</h2>
                <p className="text-muted-foreground max-w-md">
                   By signing this transaction, you are anchoring a proof of your professional profile to the blockchain. This makes your CVWallet verifiable, portable, and truly yours.
                </p>
            </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
