import { ReactNode } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  title: string;
}

export default function OnboardingLayout({
  currentStep,
  totalSteps,
  title,
  children,
}: OnboardingLayoutProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
       <div className="mb-8 text-center">
         <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
          </span>
        <Progress value={progress} className="h-2 max-w-md mx-auto mt-2" />
       </div>
        <Card className="bg-background/60 backdrop-blur-sm border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden">
            <CardContent className="p-0">
               {children}
            </CardContent>
        </Card>
    </div>
  );
}
