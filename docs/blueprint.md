# **App Name**: NutriTrack AI

## Core Features:

- AI-Powered Meal Analysis: Utilize image recognition AI tool and language understanding tool to estimate calorie count and macro/micro nutrient values. Tool considers dish name, ingredients (where available) and estimates portion size from visual cues or description. Report presented for confirmation and editing prior to saving.
- Daily Log: Maintain a food diary automatically populated with the data captured from Image Input. Offers an editing interface so that corrections can be made manually by the user
- Nutritional Dashboard: Dashboard to visualize food intake over time: daily view shows immediate summary information of nutrients ingested vs target; weekly view shows rolling average;  for 7 day history, also available to unregistered accounts, pushing upgrade for additional historic trending insights.
- AI-Assisted Diet Planning: AI-driven tool to generate meal suggestions considering both target and historical consumption, with both general meal plan and support of specific regional cuisines, plus recipe content. Arabic-language results available when indicated in the user profile, leveraging a localized-expertise tuned instance of the LLM tool to produce useful insights.
- User accounts: Enable personalized user experience. Login via third party or direct registration. New users begin a 'trial' (see Dashboard); authenticated users can save food, meal suggestions and settings. A login gate controls user functionality until the end of trial or until 'unlock'.
- Clear Horizontal Navigation: Users will need access to configuration details and other pages beyond core UX, thus persistent horizontal Navigation for ease of function calls will enable more dynamic experience within the web application.

## Style Guidelines:

- Primary color: Soft violet (#A2A7FF). This is a calm, intelligent-feeling color appropriate to the AI context of the app, while staying away from tech cliches.
- Background color: Light lavender (#F0F0FF). This color offers a pleasant contrast and consistent branding to the violet primary color, as the hues are visibly similar but differ significantly in brightness and saturation.
- Accent color: Muted raspberry (#D987A6). Positioned approximately 30 degrees 'left' of the primary color in HSL space, its relative darkness and saturation ensure clear visual distinction, contributing to effective contrast within the application.
- Headline font: 'Space Grotesk' (sans-serif) for titles and section headings. With 'PT Sans' not requested for body text, Space Grotesk can cover both effectively, with its techy but very readable style, reducing overall styling for this MVP app.
- Code font: 'Source Code Pro' for displaying code snippets (monospace).
- Use clean, geometric icons from lucide-react to visually represent food types and nutrients. These icons are for general usage and visual branding, not images captured in prompts for image based ingestion.
- Dashboard presents data clearly with distinct zones for current intake, diary, and nutritional focus; utilizes tabs to display data summaries over a sliding timescale from 'daily' to 'monthly'. Menu stays to the side but morphs into horizontal when minimized on small devices.