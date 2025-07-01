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
  dishName: z.string().describe('The name of the suggested dish, in Arabic.'),
  description: z.string().describe('A brief, enticing description of the dish, in Arabic.'),
  ingredients: z.array(z.string()).describe('A list of ingredients for the dish, in Arabic.'),
  nutritionalInfo: z.string().describe('A summary of the key nutritional information (calories, protein, etc.), in Arabic.'),
  instructions: z.array(z.string()).describe('Step-by-step cooking instructions, in Arabic.'),
});
export type MealSuggestion = z.infer<typeof MealSuggestionSchema>;