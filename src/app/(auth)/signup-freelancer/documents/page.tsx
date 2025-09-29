import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import DocumentsStep from "@/components/onboarding/DocumentsStep";

export default function DocumentsPage() {
  return (
    <OnboardingLayout currentStep={2} totalSteps={4} title="Upload Documents">
      <DocumentsStep />
    </OnboardingLayout>
  );
}
