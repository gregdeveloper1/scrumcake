/**
 * AI Chat API Endpoint
 * Handles streaming chat responses from Anthropic Claude
 */

import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages } from 'ai';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Create Anthropic client with API key from environment
const anthropic = createAnthropic({
	apiKey: env.ANTHROPIC_API_KEY
});

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are Claude, a helpful, harmless, and honest AI assistant made by Anthropic.

You can help with a wide variety of tasks including:
- Answering questions on any topic
- Writing, editing, and creative tasks
- Analysis and research
- Coding and technical help
- Math and reasoning
- General conversation

Guidelines:
- Be helpful, accurate, and thoughtful
- Use markdown formatting when it improves readability
- Be direct and get to the point
- If you're unsure about something, say so

IMPORTANT - Code Formatting:
When writing ANY code (functions, snippets, examples, commands, etc.), you MUST:
1. Always use fenced code blocks with triple backticks
2. Always specify the language identifier for syntax highlighting
3. Use the correct language: javascript, typescript, python, swift, rust, go, java, cpp, c, html, css, bash, sql, json, yaml, etc.

Example format:
\`\`\`javascript
function example() {
  return "hello";
}
\`\`\`

Never write code inline or without the language identifier.`;

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { messages } = await request.json();

		// Convert UI messages to model messages format
		const modelMessages = await convertToModelMessages(messages);

		const result = streamText({
			model: anthropic('claude-sonnet-4-20250514'),
			system: SYSTEM_PROMPT,
			messages: modelMessages,
			maxTokens: 4096
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error('AI Chat Error:', error);

		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : 'An unexpected error occurred'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
