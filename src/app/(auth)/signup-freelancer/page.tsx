import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import ProfileStep from "@/components/onboarding/ProfileStep";

export default function SignupFreelancerPage() {
  // For now, we render the first step directly.
  // In the future, this will manage the state of all steps.
  return (
    <OnboardingLayout currentStep={1} totalSteps={4} title="Create your Profile">
      <ProfileStep />
    </OnboardingLayout>
  );
}
