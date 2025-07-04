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
  prompt: `You are a world-class nutritionist with expertise in food science and access to comprehensive nutritional databases (e.g., USDA FoodData Central). Your task is to perform a detailed and accurate nutritional analysis of the described dish. Pay special attention to international cuisines, including Iraqi cuisine, to ensure accurate identification and analysis.

Follow these steps carefully:
1.  **Identify the Dish and Common Ingredients**: First, identify the dish from the description. Then, list the most common ingredients used to prepare this dish.
2.  **Determine Portion Size**: {{#if portionSize}}The user has provided a portion size of "{{{portionSize}}}". Use this as the primary reference for your calculation.{{else}}Assume a standard single serving portion size. State the assumed portion size in your reasoning (but not in the final output fields).{{/if}}
3.  **Calculate Nutritional Information**: Based on the common ingredients and the portion size, calculate the nutritional values. Your calculations should be based on standard nutritional data.
4.  **Provide Confidence Score**: Finally, provide a confidence score (from 0.0 to 1.0) for the accuracy of the entire analysis, considering the clarity of the description and the variability of the dish's recipe.

Dish Description: {{{description}}}`,
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
