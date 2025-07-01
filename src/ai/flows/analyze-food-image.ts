'use server';
/**
 * @fileOverview An AI flow to analyze a food image for nutritional content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { NutritionalInfoSchema, type NutritionalInfo } from '@/ai/schemas';

const AnalyzeFoodImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  portionSize: z.string().optional().describe('The portion size of the dish.'),
});
export type AnalyzeFoodImageInput = z.infer<typeof AnalyzeFoodImageInputSchema>;

export type { NutritionalInfo };

export async function analyzeFoodImage(input: AnalyzeFoodImageInput): Promise<NutritionalInfo> {
  return analyzeFoodImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFoodImagePrompt',
  input: {schema: AnalyzeFoodImageInputSchema},
  output: {schema: NutritionalInfoSchema},
  prompt: `You are a world-class nutritionist. Identify the food item in the photo and analyze it to estimate its nutritional content.
  Pay special attention to international cuisines, including Iraqi cuisine, to ensure accurate identification and analysis.

  {{#if portionSize}}
  Portion Size: {{{portionSize}}}
  {{else}}
  Assume a standard single serving portion size.
  {{/if}}
  
  Photo: {{media url=photoDataUri}}

  First, identify the dish. Then provide a nutritional breakdown.`,
});

const analyzeFoodImageFlow = ai.defineFlow(
  {
    name: 'analyzeFoodImageFlow',
    inputSchema: AnalyzeFoodImageInputSchema,
    outputSchema: NutritionalInfoSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The analysis returned no output.");
    }
    return output;
  }
);
