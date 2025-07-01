'use server';
/**
 * @fileOverview An AI flow to analyze a dish name for nutritional content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { NutritionalInfoSchema, type NutritionalInfo } from '@/ai/schemas';

const AnalyzeDishNameInputSchema = z.object({
  description: z.string().describe('The description of the dish to analyze.'),
  portionSize: z.string().optional().describe('The portion size of the dish.'),
});
export type AnalyzeDishNameInput = z.infer<typeof AnalyzeDishNameInputSchema>;

export type { NutritionalInfo };


export async function analyzeDishName(input: AnalyzeDishNameInput): Promise<NutritionalInfo> {
  return analyzeDishNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDishNamePrompt',
  input: {schema: AnalyzeDishNameInputSchema},
  output: {schema: NutritionalInfoSchema},
  prompt: `You are a world-class nutritionist. Identify the dish from the description and analyze it to estimate its nutritional content.
  Pay special attention to international cuisines, including Iraqi cuisine, to ensure accurate identification and analysis.

  Dish Description: {{{description}}}
  {{#if portionSize}}
  Portion Size: {{{portionSize}}}
  {{else}}
  Assume a standard single serving portion size.
  {{/if}}

  First, identify the dish name from the description. Then provide a nutritional breakdown.`,
});

const analyzeDishNameFlow = ai.defineFlow(
  {
    name: 'analyzeDishNameFlow',
    inputSchema: AnalyzeDishNameInputSchema,
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
