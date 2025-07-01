'use server';
/**
 * @fileOverview An AI flow to analyze a food image for nutritional content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const AnalyzeFoodImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  portionSize: z.string().describe('The portion size of the dish.'),
});
export type AnalyzeFoodImageInput = z.infer<typeof AnalyzeFoodImageInputSchema>;

export const NutritionalInfoSchema = z.object({
  dishName: z.string().describe('The name of the identified dish.'),
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

export async function analyzeFoodImage(input: AnalyzeFoodImageInput): Promise<NutritionalInfo> {
  return analyzeFoodImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFoodImagePrompt',
  input: {schema: AnalyzeFoodImageInputSchema},
  output: {schema: NutritionalInfoSchema},
  prompt: `You are a world-class nutritionist. Identify the food item in the photo and analyze the provided portion size to estimate its nutritional content.
  Pay special attention to international cuisines, including Iraqi cuisine, to ensure accurate identification and analysis.

  Portion Size: {{{portionSize}}}
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
