import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import ProfileStep from "@/components/onboarding/ProfileStep";

export default function SignupFreelancerPage() {
  return (
    <OnboardingLayout currentStep={1} totalSteps={4}>
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none font-headline mb-6 text-center">
        <span className="gradient-text">Create your Profile</span>
      </h1>
      <ProfileStep />
    </OnboardingLayout>
  );
}
