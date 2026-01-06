/**
 * Theme Store - Color Theme Management
 * =====================================
 *
 * This store manages the application's color theme system using Svelte 5 runes.
 * It provides reactive state for theme selection with localStorage persistence.
 *
 * Features:
 * - 7 built-in themes with unique color palettes and fonts
 * - Automatic persistence to localStorage
 * - SSR-safe initialization (checks for window/document)
 * - Theme metadata for UI display (name, description, preview color)
 *
 * Usage:
 * ```typescript
 * import { getTheme, setTheme, initTheme, themes } from '$lib/stores/theme.svelte';
 *
 * // In +layout.svelte onMount
 * onMount(() => initTheme());
 *
 * // Get current theme reactively
 * let theme = $derived(getTheme());
 *
 * // Change theme
 * setTheme('catppuccin');
 *
 * // Access theme metadata
 * themes.catppuccin.name // "Catppuccin"
 * ```
 *
 * How it works:
 * 1. Theme is stored in `data-theme` attribute on <html> element
 * 2. CSS in app.css uses [data-theme="themeName"] selectors
 * 3. Each theme defines CSS custom properties (--background, --primary, etc.)
 * 4. Some themes also override --font-sans for custom typography
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Available theme identifiers
 * Each corresponds to a CSS theme block in app.css
 */
export type Theme = 'zinc' | 'cursor' | 'catppuccin' | 'midnight' | 'cupertino' | 'jetbrains' | 'airbnb' | 'neobrutalism';

// ============================================
// REACTIVE STATE
// ============================================

/**
 * Current active theme
 * Uses Svelte 5 $state rune for reactivity
 * Default: 'zinc' (Classic - clean black & white)
 */
let currentTheme = $state<Theme>('zinc');

// ============================================
// PUBLIC API
// ============================================

/**
 * Get the current theme
 * Use with $derived for reactive access:
 * `let theme = $derived(getTheme());`
 *
 * @returns Current theme identifier
 */
export function getTheme(): Theme {
	return currentTheme;
}

/**
 * Set the active theme
 * Updates:
 * 1. Internal state (triggers reactivity)
 * 2. Document data-theme attribute (triggers CSS)
 * 3. localStorage (persistence)
 *
 * @param theme - Theme identifier to activate
 */
export function setTheme(theme: Theme): void {
	currentTheme = theme;

	// Update DOM and persist (only in browser)
	if (typeof document !== 'undefined') {
		// Set data-theme attribute for CSS theme selection
		document.documentElement.setAttribute('data-theme', theme);
		// Persist preference to localStorage
		localStorage.setItem('theme', theme);
	}
}

/**
 * Toggle between zinc and cursor themes
 * Utility for simple light/dark toggle scenarios
 *
 * @deprecated Consider using setTheme directly for more control
 */
export function toggleTheme(): void {
	setTheme(currentTheme === 'zinc' ? 'cursor' : 'zinc');
}

// ============================================
// VALIDATION
// ============================================

/**
 * List of valid theme identifiers
 * Used to validate localStorage values
 */
const validThemes: Theme[] = ['zinc', 'cursor', 'catppuccin', 'midnight', 'cupertino', 'jetbrains', 'airbnb', 'neobrutalism'];

/**
 * Initialize theme from localStorage
 * Call this in +layout.svelte's onMount to restore user's theme preference
 *
 * Behavior:
 * 1. Check localStorage for saved theme
 * 2. Validate it's a known theme
 * 3. Apply saved theme or default to 'cursor'
 *
 * SSR-safe: Only runs in browser environment
 */
export function initTheme(): void {
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('theme') as Theme | null;

		if (saved && validThemes.includes(saved)) {
			setTheme(saved);
		} else {
			setTheme('zinc'); // Default to Classic theme
		}
	}
}

// ============================================
// THEME METADATA
// ============================================

/**
 * Theme metadata for UI display
 * Used by ThemeSwitcher component and Settings page
 *
 * Properties:
 * - name: Display name for the theme
 * - description: Short description of the theme style
 * - color: CSS gradient for preview swatch
 */
export const themes = {
	zinc: {
		name: 'Classic',
		description: 'Clean black & white',
		color: 'linear-gradient(135deg, #fff 0%, #000 100%)'
	},
	cursor: {
		name: 'Cursor',
		description: 'Warm cream with CursorGothic',
		color: 'linear-gradient(135deg, #f7f5f0 0%, #e8e4dc 100%)'
	},
	catppuccin: {
		name: 'Catppuccin',
		description: 'Soothing pastel dark',
		color: 'linear-gradient(135deg, #cba6f7 0%, #1e1e2e 100%)'
	},
	midnight: {
		name: 'Midnight',
		description: 'Deep blue night',
		color: 'linear-gradient(135deg, #60a5fa 0%, #0f172a 100%)'
	},
	cupertino: {
		name: 'Cupertino',
		description: 'Apple iOS with SF Pro',
		color: 'linear-gradient(135deg, #007AFF 0%, #F2F2F7 100%)'
	},
	jetbrains: {
		name: 'JetBrains',
		description: 'Google Sans + M3 purple',
		color: 'linear-gradient(135deg, #6750A4 0%, #2B2B2B 100%)'
	},
	airbnb: {
		name: 'Airbnb',
		description: 'Cereal font + coral',
		color: 'linear-gradient(135deg, #FF5A5F 0%, #fff 100%)'
	},
	neobrutalism: {
		name: 'Neobrutalism',
		description: 'Classic cream with hard shadows',
		color: 'linear-gradient(135deg, #FF90E8 0%, #FEF6E4 50%, #3772FF 100%)'
	}
} as const;
