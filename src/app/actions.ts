'use server';

import { generateCvWallet } from "@/ai/flows/generate-cv-wallet-from-prompt";
import { z } from "zod";

const GenerateCvWalletSchema = z.object({
  prompt: z.string().min(10, { message: "Prompt must be at least 10 characters." }),
});

export type FormState = {
  message: string;
  cvContent?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateCvWalletAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = GenerateCvWalletSchema.safeParse(formData);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message);
    return {
      message: "Invalid form data.",
      issues,
    };
  }

  try {
    const { cvWalletContent } = await generateCvWallet({ prompt: parsed.data.prompt });
    return {
      message: "CV Wallet generated successfully!",
      cvContent: cvWalletContent,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to generate CV. Please try again.",
    };
  }
}
