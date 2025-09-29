'use server';
/**
 * @fileOverview A flow to generate a CVWallet from a single prompt describing the freelancer's skills and experience.
 *
 * - generateCvWallet - A function that handles the CVWallet generation process.
 * - GenerateCvWalletInput - The input type for the generateCvWallet function.
 * - GenerateCvWalletOutput - The return type for the generateCvWallet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCvWalletInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt describing the freelancer\'s skills, experience, and desired profile content.'
    ),
});
export type GenerateCvWalletInput = z.infer<typeof GenerateCvWalletInputSchema>;

const GenerateCvWalletOutputSchema = z.object({
  cvWalletContent: z
    .string()
    .describe(
      'The generated content for the CVWallet, including skills, experience, and portfolio information.'
    ),
});
export type GenerateCvWalletOutput = z.infer<typeof GenerateCvWalletOutputSchema>;

export async function generateCvWallet(input: GenerateCvWalletInput): Promise<GenerateCvWalletOutput> {
  return generateCvWalletFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCvWalletPrompt',
  input: {schema: GenerateCvWalletInputSchema},
  output: {schema: GenerateCvWalletOutputSchema},
  prompt: `You are an expert CV writer, skilled at creating professional CVs.

  Based on the following prompt, generate content for a CVWallet, including sections for skills, experience, and portfolio items.  The output should be a single string suitable for direct use in a CVWallet. Be detailed and comprehensive.

Prompt: {{{prompt}}}`,
});

const generateCvWalletFlow = ai.defineFlow(
  {
    name: 'generateCvWalletFlow',
    inputSchema: GenerateCvWalletInputSchema,
    outputSchema: GenerateCvWalletOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
