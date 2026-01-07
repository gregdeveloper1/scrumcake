<!--
	Signup Page
	===========
	Create new account with email/password or OAuth

	Security:
	- Password validation: 12+ chars, requires complexity
	- Email validation via HTML5 + Supabase
	- OAuth redirects validated in callback handler
-->

<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	// MARK: - Constants

	/** Minimum password length for security */
	const MIN_PASSWORD_LENGTH = 12;

	// MARK: - State

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	// MARK: - Validation

	/**
	 * Validates password meets security requirements:
	 * - At least 12 characters
	 * - Contains at least one uppercase letter
	 * - Contains at least one lowercase letter
	 * - Contains at least one number
	 *
	 * @returns Error message or null if valid
	 */
	function validatePassword(pwd: string): string | null {
		if (pwd.length < MIN_PASSWORD_LENGTH) {
			return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
		}
		if (!/[A-Z]/.test(pwd)) {
			return 'Password must contain at least one uppercase letter';
		}
		if (!/[a-z]/.test(pwd)) {
			return 'Password must contain at least one lowercase letter';
		}
		if (!/[0-9]/.test(pwd)) {
			return 'Password must contain at least one number';
		}
		return null;
	}

	// MARK: - Event Handlers

	async function handleEmailSignup(e: Event) {
		e.preventDefault();

		// SECURITY: Validate password complexity
		const passwordError = validatePassword(password);
		if (passwordError) {
			error = passwordError;
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		loading = true;
		error = '';

		const { error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`
			}
		});

		if (authError) {
			error = authError.message;
			loading = false;
		} else {
			success = true;
			loading = false;
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
	<title>Sign up - Scrum Master Jobs</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md space-y-8">
		<!-- Header -->
		<div class="text-center">
			<h1 class="text-3xl font-bold tracking-tight">Create an account</h1>
			<p class="mt-2 text-muted-foreground">
				Join our community of Scrum Masters
			</p>
		</div>

		{#if success}
			<!-- Success Message -->
			<div class="rounded-lg bg-green-500/10 border border-green-500/20 p-6 text-center">
				<svg class="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<h3 class="text-lg font-semibold mb-2">Check your email</h3>
				<p class="text-sm text-muted-foreground">
					We've sent you a confirmation link at <strong>{email}</strong>.
					Click the link to activate your account.
				</p>
			</div>
		{:else}
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
			<form onsubmit={handleEmailSignup} class="space-y-4">
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
					<label for="password" class="text-sm font-medium">Password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						minlength={MIN_PASSWORD_LENGTH}
						class={cn(
							"flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm",
							"placeholder:text-muted-foreground",
							"focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
							"disabled:cursor-not-allowed disabled:opacity-50"
						)}
						placeholder="Min 12 chars, upper/lower/number"
					/>
				</div>

				<div class="space-y-2">
					<label for="confirmPassword" class="text-sm font-medium">Confirm Password</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						required
						class={cn(
							"flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm",
							"placeholder:text-muted-foreground",
							"focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
							"disabled:cursor-not-allowed disabled:opacity-50"
						)}
						placeholder="Confirm your password"
					/>
				</div>

				<Button type="submit" class="w-full h-11" disabled={loading}>
					{#if loading}
						<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
						</svg>
						Creating account...
					{:else}
						Create account
					{/if}
				</Button>
			</form>

			<!-- Terms -->
			<p class="text-center text-xs text-muted-foreground">
				By signing up, you agree to our
				<a href="/terms" class="underline hover:text-foreground">Terms of Service</a>
				and
				<a href="/privacy" class="underline hover:text-foreground">Privacy Policy</a>
			</p>

			<!-- Login link -->
			<p class="text-center text-sm text-muted-foreground">
				Already have an account?
				<a href="/login" class="font-medium text-primary hover:underline">
					Sign in
				</a>
			</p>
		{/if}
	</div>
</div>
