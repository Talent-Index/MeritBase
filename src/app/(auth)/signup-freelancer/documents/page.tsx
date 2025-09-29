
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import DocumentsStep from "@/components/onboarding/DocumentsStep";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DocumentsPage() {
  return (
    <OnboardingLayout currentStep={3} totalSteps={4} title="Verify your identity">
       <div className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="p-8 md:p-12 flex flex-col justify-center">
           <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none font-headline mb-6">
            <span className="gradient-text">Verify your Identity</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Please upload a government-issued ID to verify your identity. Your information is encrypted and stored securely.
          </p>
          <DocumentsStep />
        </div>
        <div className="hidden md:flex flex-col justify-center p-8 md:p-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-l border-white/10">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold font-headline">Why we ask for this</h2>
                <p className="text-muted-foreground">
                   Verifying your identity helps us build a trusted and secure marketplace for both freelancers and employers. It prevents fraud and ensures that everyone on MeritBase is who they say they are.
                </p>
            </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
