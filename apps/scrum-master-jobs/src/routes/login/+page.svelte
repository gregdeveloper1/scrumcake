<!--
	Login Page
	==========
	Email/password login with Google OAuth
-->

<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleEmailLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (authError) {
			error = authError.message;
			loading = false;
		} else {
			goto('/');
		}
	}

	async function handleGoogleLogin() {
		loading = true;
		error = '';

		const { error: authError } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});

		if (authError) {
			error = authError.message;
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Log in - Scrum Master Jobs</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md space-y-8">
		<!-- Header -->
		<div class="text-center">
			<h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
			<p class="mt-2 text-muted-foreground">
				Sign in to your account to continue
			</p>
		</div>

		<!-- Google OAuth -->
		<Button
			variant="outline"
			class="w-full h-11 gap-3"
			onclick={handleGoogleLogin}
			disabled={loading}
		>
			<svg class="h-5 w-5" viewBox="0 0 24 24">
				<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
				<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
				<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
				<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
			</svg>
			Continue with Google
		</Button>

		<!-- Divider -->
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-border"></div>
			</div>
			<div class="relative flex justify-center text-sm">
				<span class="bg-background px-4 text-muted-foreground">Or continue with email</span>
			</div>
		</div>

		<!-- Email Form -->
		<form onsubmit={handleEmailLogin} class="space-y-4">
			{#if error}
				<div class="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
					{error}
				</div>
			{/if}

			<div class="space-y-2">
				<label for="email" class="text-sm font-medium">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class={cn(
						"flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm",
						"placeholder:text-muted-foreground",
						"focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
						"disabled:cursor-not-allowed disabled:opacity-50"
					)}
					placeholder="you@example.com"
				/>
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<label for="password" class="text-sm font-medium">Password</label>
					<a href="/forgot-password" class="text-sm text-primary hover:underline">
						Forgot password?
					</a>
				</div>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class={cn(
						"flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm",
						"placeholder:text-muted-foreground",
						"focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
						"disabled:cursor-not-allowed disabled:opacity-50"
					)}
					placeholder="Enter your password"
				/>
			</div>

			<Button type="submit" class="w-full h-11" disabled={loading}>
				{#if loading}
					<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
					Signing in...
				{:else}
					Sign in
				{/if}
			</Button>
		</form>

		<!-- Sign up link -->
		<p class="text-center text-sm text-muted-foreground">
			Don't have an account?
			<a href="/signup" class="font-medium text-primary hover:underline">
				Sign up
			</a>
		</p>
	</div>
</div>
