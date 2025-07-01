'use server';
/**
 * @fileOverview An AI flow to analyze a dish name for nutritional content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const AnalyzeDishNameInputSchema = z.object({
  description: z.string().describe('The description of the dish to analyze.'),
  portionSize: z.string().describe('The portion size of the dish.'),
});
export type AnalyzeDishNameInput = z.infer<typeof AnalyzeDishNameInputSchema>;

export const NutritionalInfoSchema = z.object({
  dishName: z.string().describe('The name of the identified dish based on the description.'),
  calories: z.number().describe('Estimated calories.'),
  protein: z.number().describe('Grams of protein.'),
  carbs: z.number().describe('Grams of carbohydrates.'),
  fats: z.number().describe('Grams of fat.'),
  fiber: z.number().describe('Grams of fiber.'),
  sodium: z.number().describe('Milligrams of sodium.'),
  sugar: z.number().describe('Grams of sugar.'),
  potassium: z.number().describe('Milligrams of potassium.'),
  vitaminC: z.number().describe('Milligrams of Vitamin C.'),
  calcium: z.number().describe('Milligrams of calcium.'),
  iron: z.number().describe('Milligrams of iron.'),
});
export type NutritionalInfo = z.infer<typeof NutritionalInfoSchema>;


export async function analyzeDishName(input: AnalyzeDishNameInput): Promise<NutritionalInfo> {
  return analyzeDishNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDishNamePrompt',
  input: {schema: AnalyzeDishNameInputSchema},
  output: {schema: NutritionalInfoSchema},
  prompt: `You are a world-class nutritionist. Identify the dish from the description and analyze the provided portion size to estimate its nutritional content.
  Pay special attention to international cuisines, including Iraqi cuisine, to ensure accurate identification and analysis.

  Dish Description: {{{description}}}
  Portion Size: {{{portionSize}}}

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
