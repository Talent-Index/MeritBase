'use server';
/**
 * @fileOverview Matches a job description to a freelancer's CVWallet to calculate a fit percentage.
 *
 * - matchJobToCvWallet - A function that takes a job description and a CVWallet and returns a percentage fit.
 * - MatchJobToCvWalletInput - The input type for the matchJobToCvWallet function.
 * - MatchJobToCvWalletOutput - The return type for the matchJobToCvWallet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchJobToCvWalletInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job.'),
  cvWallet: z.string().describe('The content of the freelancer\'s CVWallet.'),
});
export type MatchJobToCvWalletInput = z.infer<typeof MatchJobToCvWalletInputSchema>;

const MatchJobToCvWalletOutputSchema = z.object({
  fitPercentage: z.number().describe('The percentage fit between the job description and the CVWallet.'),
});
export type MatchJobToCvWalletOutput = z.infer<typeof MatchJobToCvWalletOutputSchema>;

export async function matchJobToCvWallet(input: MatchJobToCvWalletInput): Promise<MatchJobToCvWalletOutput> {
  return matchJobToCvWalletFlow(input);
}

const sentenceSimilarityTool = ai.defineTool({
  name: 'calculateSentenceSimilarity',
  description: 'Calculates the semantic similarity between two sentences and returns a percentage between 0 and 100.',
  inputSchema: z.object({
    sentence1: z.string().describe('The first sentence.'),
    sentence2: z.string().describe('The second sentence.'),
  }),
  outputSchema: z.number().describe('The similarity percentage between the two sentences.'),
}, async (input) => {
  // Mock implementation as we're not connecting to a real HuggingFace model here.
  // In a real application, you would call the HuggingFace API.
  // This example just returns a random number between 50 and 100 for demonstration purposes.
  return Math.floor(Math.random() * (100 - 50 + 1)) + 50;
});

const matchJobToCvWalletPrompt = ai.definePrompt({
  name: 'matchJobToCvWalletPrompt',
  tools: [sentenceSimilarityTool],
  input: {schema: MatchJobToCvWalletInputSchema},
  output: {schema: MatchJobToCvWalletOutputSchema},
  prompt: `You are an AI assistant helping to determine the fit between a job description and a freelancer\'s CVWallet.

  Use the calculateSentenceSimilarity tool to calculate the similarity between the job description and the CVWallet content.

  Job Description: {{{jobDescription}}}
  CVWallet Content: {{{cvWallet}}}

  Based on the similarity score provided by the tool, determine the fit percentage.
  Return only the fit percentage as a number between 0 and 100.
`,
});

const matchJobToCvWalletFlow = ai.defineFlow(
  {
    name: 'matchJobToCvWalletFlow',
    inputSchema: MatchJobToCvWalletInputSchema,
    outputSchema: MatchJobToCvWalletOutputSchema,
  },
  async input => {
    const {output} = await matchJobToCvWalletPrompt(input);
    return output!;
  }
);
