<!--
	/askai/+page.svelte
	AI Chat Page - Main entry point for the AI chatbot
-->

<script lang="ts">
	import { ChatContainer } from '$lib/components/chat';
</script>

<svelte:head>
	<title>Ask AI - DevCommunity</title>
	<meta name="description" content="Chat with Claude AI about coding, debugging, and software development" />
</svelte:head>

<div class="h-[calc(100vh-4rem-36px)]">
	<ChatContainer />
</div>
