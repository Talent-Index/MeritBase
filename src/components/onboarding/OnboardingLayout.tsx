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
  children: ReactNode;
}

export default function OnboardingLayout({
  currentStep,
  totalSteps,
  children,
}: OnboardingLayoutProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Card className="w-full max-w-2xl bg-background/60 backdrop-blur-sm border-white/10 shadow-2xl shadow-purple-500/10">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
            </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
