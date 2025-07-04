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
  prompt: `You are a product database expert with access to global barcode information and nutritional databases. Your task is to analyze the provided image to find a product barcode. If a barcode is identified, look up the product associated with that barcode and provide a detailed nutritional analysis based on the product's official nutrition label.

Follow these steps:
1.  **Identify Barcode**: Scan the image to locate a product barcode (UPC, EAN, etc.).
2.  **Look up Product**: Use the barcode to identify the exact product.
3.  **Extract Ingredients List**: Look up the product's ingredients list as it appears on the packaging and populate the \`ingredients\` field in the output. If you cannot find the ingredients list, return an empty array for the \`ingredients\` field.
4.  **Extract Nutritional Information**: Provide the nutritional analysis *exactly as it would appear on the product's nutrition label for the standard serving size listed on the package*. Do not estimate or guess.
5.  **Handle Failures**: If no barcode is visible, if the barcode is unreadable, or if the product cannot be found in the database, you must return an analysis with a confidence score of 0. All other nutritional values should also be 0, and the \`ingredients\` list should be empty.
6.  **Provide Confidence Score**: Always provide a confidence score (from 0.0 to 1.0). A score of 1.0 means you successfully identified the barcode and found the exact product data. A score of 0 means you failed.

Photo: {{media url=photoDataUri}}`,
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
