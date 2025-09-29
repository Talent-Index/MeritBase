import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  children: ReactNode;
}

export default function OnboardingLayout({
  currentStep,
  totalSteps,
  title,
  children,
}: OnboardingLayoutProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl font-headline">{title}</CardTitle>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <CardDescription>
          Complete the steps to create your MeritBase CVWallet.
        </CardDescription>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
