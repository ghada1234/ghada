'use server';
/**
 * @fileOverview An AI flow to analyze a product barcode from an image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { NutritionalInfoSchema, type NutritionalInfo } from '@/ai/schemas';

const AnalyzeBarcodeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product barcode, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeBarcodeImageInput = z.infer<typeof AnalyzeBarcodeImageInputSchema>;

export type { NutritionalInfo };

export async function analyzeBarcode(input: AnalyzeBarcodeImageInput): Promise<NutritionalInfo> {
  return analyzeBarcodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBarcodePrompt',
  input: {schema: AnalyzeBarcodeImageInputSchema},
  output: {schema: NutritionalInfoSchema},
  prompt: `You are a product database expert. Your task is to analyze the provided image to find a product barcode. If a barcode is identified, look up the product associated with that barcode and provide a detailed nutritional analysis for a standard serving size.
  
  Photo: {{media url=photoDataUri}}
  
  If no barcode is visible or identifiable, or if the product cannot be found, you must return an analysis with a confidence score of 0. All other nutritional values can be 0 in this case.
  Always provide a confidence score (from 0.0 to 1.0) for the accuracy of the entire analysis.`,
});

const analyzeBarcodeFlow = ai.defineFlow(
  {
    name: 'analyzeBarcodeFlow',
    inputSchema: AnalyzeBarcodeImageInputSchema,
    outputSchema: NutritionalInfoSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The barcode analysis returned no output.");
    }
    return output;
  }
);
