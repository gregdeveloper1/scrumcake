/**
 * Utility Functions
 * ==================
 *
 * Shared utility functions used throughout the application.
 * Includes class name merging and TypeScript utility types.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge and deduplicate Tailwind CSS classes
 *
 * Combines clsx (conditional class handling) with tailwind-merge
 * (deduplicating and resolving Tailwind class conflicts).
 *
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns Merged and deduplicated class string
 *
 * @example
 * // Basic usage
 * cn('px-4 py-2', 'bg-primary')
 * // => 'px-4 py-2 bg-primary'
 *
 * @example
 * // Conditional classes
 * cn('px-4', isActive && 'bg-primary', className)
 *
 * @example
 * // Resolving conflicts (tailwind-merge handles this)
 * cn('px-4 px-6')
 * // => 'px-6' (last value wins)
 *
 * @example
 * // With shadcn-svelte components
 * <Button class={cn('custom-class', className)} />
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

// ============================================
// TYPESCRIPT UTILITY TYPES
// ============================================
// These types are used by shadcn-svelte components
// to handle prop forwarding and element references

/**
 * Remove the 'child' prop from a type
 * Used by shadcn-svelte components that use the child snippet pattern
 */
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, "child"> : T;

/**
 * Remove both 'children' and 'child' props from a type
 * Combination of WithoutChildren and WithoutChild
 */
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;

/**
 * Remove the 'children' prop from a type
 * Used when forwarding props but handling children separately
 */
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, "children"> : T;

/**
 * Add an optional element reference to a type
 * Used for components that need to expose their DOM element
 *
 * @template T - The base props type
 * @template U - The HTML element type (defaults to HTMLElement)
 */
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
