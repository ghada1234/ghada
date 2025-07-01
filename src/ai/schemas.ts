import {z} from 'zod';

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

export const MealSuggestionSchema = z.object({
  dishName: z.string().describe('The name of the suggested dish, in the language specified in the input.'),
  description: z.string().describe('A brief, enticing description of the dish, in the language specified in the input.'),
  ingredients: z.array(z.string()).describe('A list of ingredients for the dish, in the language specified in the input.'),
  nutritionalInfo: NutritionalInfoSchema.omit({ dishName: true }).describe('A detailed nutritional breakdown (calories, protein, etc.) for the dish.'),
  instructions: z.array(z.string()).describe('Step-by-step cooking instructions, in the language specified in the input.'),
});
export type MealSuggestion = z.infer<typeof MealSuggestionSchema>;
