'use server';

/**
 * @fileOverview An AI agent that recommends the best towers to use against an incoming enemy wave.
 *
 * - getArsenalSuggestion - A function that suggests the best towers for the current wave.
 * - ArsenalSuggestionInput - The input type for the getArsenalSuggestion function.
 * - ArsenalSuggestionOutput - The return type for the getArsenalSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArsenalSuggestionInputSchema = z.object({
  waveNumber: z.number().describe('The current wave number.'),
  enemyTypes: z.array(z.string()).describe('The types of enemies in the current wave.'),
  availableTowers: z.array(z.string()).describe('The names of the towers currently available to the player.'),
});
export type ArsenalSuggestionInput = z.infer<typeof ArsenalSuggestionInputSchema>;

const ArsenalSuggestionOutputSchema = z.object({
  recommendedTowers: z.array(z.string()).describe('The towers recommended for the current wave and why.'),
});
export type ArsenalSuggestionOutput = z.infer<typeof ArsenalSuggestionOutputSchema>;

export async function getArsenalSuggestion(input: ArsenalSuggestionInput): Promise<ArsenalSuggestionOutput> {
  return arsenalSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'arsenalSuggestionPrompt',
  input: {schema: ArsenalSuggestionInputSchema},
  output: {schema: ArsenalSuggestionOutputSchema},
  prompt: `You are an expert military strategist specializing in tower defense tactics, especially for Winter Warfare.

  Given the current wave number, the types of enemies appearing in the wave, and the towers available to the player,
  recommend the best towers to use and explain why.

  Wave Number: {{{waveNumber}}}
  Enemy Types: {{#each enemyTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Available Towers: {{#each availableTowers}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Consider each tower's strengths and weaknesses against different enemy types when making your recommendations.
  Explain your reasoning for each recommended tower. Make your list concise and easy to follow.
  `,
});

const arsenalSuggestionFlow = ai.defineFlow(
  {
    name: 'arsenalSuggestionFlow',
    inputSchema: ArsenalSuggestionInputSchema,
    outputSchema: ArsenalSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
