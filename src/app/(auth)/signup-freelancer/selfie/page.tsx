
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import SelfieStep from "@/components/onboarding/SelfieStep";

export default function SelfiePage() {
  return (
    <OnboardingLayout currentStep={4} totalSteps={4} title="Liveness Check">
       <div className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="p-8 md:p-12 flex flex-col justify-center">
           <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none font-headline mb-6">
            <span className="gradient-text">Liveness Check</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Please take a selfie to confirm you're a real person. This helps us prevent fake accounts and keep the platform secure.
          </p>
          <SelfieStep />
        </div>
        <div className="hidden md:flex flex-col items-center justify-center p-8 md:p-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-l border-white/10">
            <div className="w-64 h-64 rounded-full border-4 border-dashed border-purple-400 flex items-center justify-center">
                 <div className="w-56 h-56 rounded-full border-2 border-dashed border-pink-400 flex items-center justify-center">
                    <p className="text-muted-foreground text-center">Position your face within the frame.</p>
                 </div>
            </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
