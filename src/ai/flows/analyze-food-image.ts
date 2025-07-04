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
  prompt: `You are a world-class nutritionist with expertise in food science and access to comprehensive nutritional databases (e.g., USDA FoodData Central). Your task is to perform a detailed and accurate nutritional analysis of the food item in the provided photo.

Follow these steps carefully:
1.  **Identify the Dish and Ingredients**: First, identify the primary dish. Then, list all visible or clearly inferred ingredients. Be as specific as possible (e.g., "chicken breast," "brown rice," "broccoli florets").
2.  **Populate Ingredients List**: You MUST populate the \`ingredients\` field in the output with the list of ingredients you identified in step 1.
3.  **Estimate Portion Size**: Analyze the image to estimate the portion size in grams or a standard unit (e.g., cups, ounces). {{#if portionSize}}The user has provided a portion size of "{{{portionSize}}}". Use this as the primary reference, but you can refine it if the image clearly contradicts it.{{else}}If the user has not provided a portion size, assume a standard single serving and state what that serving size is.{{/if}}
4.  **Calculate Nutritional Information**: Based on the identified ingredients and estimated portion size, calculate the nutritional values. Your calculations should be based on standard nutritional data for the raw or cooked ingredients as appropriate.
5.  **Provide Confidence Score**: Finally, provide a confidence score (from 0.0 to 1.0) for the accuracy of the entire analysis, considering image clarity, ingredient identifiability, and portion size estimation.

Photo: {{media url=photoDataUri}}`,
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
