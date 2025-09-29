
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import ConnectionsStep from "@/components/onboarding/ConnectionsStep";

export default function ConnectionsPage() {
  return (
    <OnboardingLayout currentStep={2} totalSteps={4} title="Connect your accounts">
       <div className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="p-8 md:p-12 flex flex-col justify-center">
           <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none font-headline mb-6">
            <span className="gradient-text">Connect your accounts</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Import your reputation by connecting your existing professional profiles. This helps verify your experience and skills.
          </p>
          <ConnectionsStep />
        </div>
        <div className="hidden md:flex flex-col justify-center p-8 md:p-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-l border-white/10">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold font-headline">Build Trust, Instantly</h2>
                <p className="text-muted-foreground">
                   Connecting your established profiles from platforms like LinkedIn, Upwork, or Fiverr adds a strong layer of verification to your CVWallet. It shows employers you have a history of professional work.
                </p>
            </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
