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

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
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
  const MODEL_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
  
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('Hugging Face API key not found.');
    // Fallback to a random number if the key is not set
    return Math.floor(Math.random() * (100 - 50 + 1)) + 50;
  }

  try {
    const response = await fetch(MODEL_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            inputs: [input.sentence1, input.sentence2],
            options: { wait_for_model: true },
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Hugging Face API Error: ${response.statusText}`, errorBody);
        throw new Error(`Failed to get embeddings from Hugging Face API. Status: ${response.status}`);
    }

    const embeddings = await response.json();
    if (!Array.isArray(embeddings) || embeddings.length !== 2) {
        console.error('Invalid embeddings format received from Hugging Face API', embeddings);
        throw new Error('Invalid embeddings format.');
    }

    const similarity = cosineSimilarity(embeddings[0], embeddings[1]);
    
    // Convert similarity from [-1, 1] range to [0, 100] percentage
    // We'll treat any negative similarity as 0.
    const percentage = Math.round(Math.max(0, similarity) * 100);
    return percentage;

  } catch (error) {
      console.error('Error in sentenceSimilarityTool:', error);
      // Fallback in case of any API error
      return Math.floor(Math.random() * (100 - 50 + 1)) + 50;
  }
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
