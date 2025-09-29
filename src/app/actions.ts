'use server';

import { generateCvWallet } from "@/ai/flows/generate-cv-wallet-from-prompt";
import { z } from "zod";
import fs from 'fs';
import path from 'path';

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


// --- New Server Action to get Contract Info ---

interface ContractInfo {
    address: `0x${string}`;
    abi: any;
}

export async function getContractInfo(contractName: 'FreelancerRegistry' | 'EmployerRegistry'): Promise<ContractInfo> {
  try {
    const contractsDir = path.resolve(process.cwd(), 'contracts', 'deployments', 'localhost');
    const filePath = path.join(contractsDir, `${contractName}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Contract JSON file not found at path: ${filePath}`);
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const contractJson = JSON.parse(fileContent);
    
    if (!contractJson.address || !contractJson.abi) {
        throw new Error(`Invalid contract JSON format for ${contractName}. "address" and "abi" must be defined.`);
    }

    return {
      address: contractJson.address,
      abi: contractJson.abi,
    };
  } catch (error) {
    console.error(`Error loading contract ${contractName}:`, error);
    // In case of an error, return a structure that doesn't break the client,
    // but indicates a problem. The address is intentionally invalid.
    return {
        address: '0x0000000000000000000000000000000000000000',
        abi: [],
    }
  }
}
