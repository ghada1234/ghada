'use server';
/**
 * @fileOverview An AI flow to suggest meals.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { MealSuggestionSchema, type MealSuggestion } from '@/ai/schemas';

export type { MealSuggestion };

const SuggestMealsOutputSchema = z.object({
  breakfast: MealSuggestionSchema.describe('A suggestion for breakfast.'),
  lunch: MealSuggestionSchema.describe('A suggestion for lunch.'),
  dinner: MealSuggestionSchema.describe('A suggestion for dinner.'),
  snack: MealSuggestionSchema.describe('A suggestion for a snack.'),
  dessert: MealSuggestionSchema.describe('A suggestion for a dessert.'),
});
export type SuggestMealsOutput = z.infer<typeof SuggestMealsOutputSchema>;

const SuggestMealsInputSchema = z.object({
    language: z.enum(['en', 'ar']).default('ar').describe('The language for the meal suggestions.'),
    dietaryPreference: z.string().nullable().optional().describe('Optional dietary preference, e.g., vegetarian, low-carb.'),
    allergies: z.string().nullable().optional().describe('A list of allergies to avoid, e.g., Peanuts, Shellfish.'),
    likes: z.string().nullable().optional().describe('A list of preferred foods or flavors.'),
    dislikes: z.string().nullable().optional().describe('A list of foods or flavors to avoid.'),
    targetCalories: z.number().optional().describe('The target calories for the day to aim for with the suggested meals.'),
    targetProtein: z.number().optional().describe('The target protein (in grams) for the day.'),
    targetCarbs: z.number().optional().describe('The target carbohydrates (in grams) for the day.'),
    targetFats: z.number().optional().describe('The target fat (in grams) for the day.'),
    positiveFeedbackOn: z.array(z.string()).optional().describe('A list of dishes the user has previously liked.'),
    negativeFeedbackOn: z.array(z.string()).optional().describe('A list of dishes the user has previously disliked.'),
});
export type SuggestMealsInput = z.infer<typeof SuggestMealsInputSchema>;


export async function suggestMeals(input: SuggestMealsInput): Promise<SuggestMealsOutput> {
  return suggestMealsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMealsPrompt',
  input: { schema: SuggestMealsInputSchema },
  output: { schema: SuggestMealsOutputSchema },
  prompt: `You are an expert nutritionist and chef specializing in healthy and delicious meals, with a deep knowledge of international cuisines, including Middle Eastern and specifically Iraqi cuisine.
Your suggestions should be diverse and can include dishes from various culinary traditions around the world.
Your task is to generate a full day's meal plan (breakfast, lunch, dinner, a snack, and a dessert) for a user.
All output MUST be in the specified language: {{language}}.

Consider the following user constraints:
{{#if dietaryPreference}}
- Dietary Preference: {{{dietaryPreference}}}
{{/if}}
{{#if allergies}}
- Allergies to avoid: {{{allergies}}}
{{/if}}
{{#if likes}}
- User likes: {{{likes}}}
{{/if}}
{{#if dislikes}}
- User dislikes: {{{dislikes}}}
{{/if}}
{{#if targetCalories}}
- The total nutritional values for all suggested meals (breakfast, lunch, dinner, snack, dessert) should collectively be around these targets:
  - Calories: {{{targetCalories}}} kcal
  {{#if targetProtein}}- Protein: {{{targetProtein}}} g{{/if}}
  {{#if targetCarbs}}- Carbs: {{{targetCarbs}}} g{{/if}}
  {{#if targetFats}}- Fats: {{{targetFats}}} g{{/if}}
{{else}}
- Provide a generally healthy and balanced plan.
{{/if}}
{{#if positiveFeedbackOn}}
- The user has previously given positive feedback on these dishes, so you can suggest similar items: {{{positiveFeedbackOn}}}
{{/if}}
{{#if negativeFeedbackOn}}
- The user has previously given negative feedback on these dishes, so you should avoid them or dishes like them: {{{negativeFeedbackOn}}}
{{/if}}

For each meal, provide the following details in {{language}}:
- A creative and appealing dish name.
- A short, mouth-watering description.
- A list of ingredients with their approximate quantities (e.g., 'Chicken breast (150g)', 'Brown rice (1 cup cooked)').
- A detailed nutritional breakdown. You MUST calculate this by summing up the nutritional values of the individual ingredients you listed. Do not estimate the total values directly. The breakdown should include estimated values for: calories, protein, carbs, fats, fiber, sodium, sugar, potassium, vitaminC, calcium, and iron.
- Simple, step-by-step cooking instructions.

Ensure the suggestions are healthy, balanced, and appealing.`,
});

const suggestMealsFlow = ai.defineFlow(
  {
    name: 'suggestMealsFlow',
    inputSchema: SuggestMealsInputSchema,
    outputSchema: SuggestMealsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The meal suggestion returned no output.");
    }
    return output;
  }
);
