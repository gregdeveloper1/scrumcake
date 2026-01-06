/**
 * TypeScript utility types for shadcn-svelte components
 * @module @jobboard/utils/types
 */

/**
 * Remove the 'child' prop from a type
 * Used by shadcn-svelte components that use the child snippet pattern
 */
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, 'child'> : T;

/**
 * Remove both 'children' and 'child' props from a type
 * Combination of WithoutChildren and WithoutChild
 */
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;

/**
 * Remove the 'children' prop from a type
 * Used when forwarding props but handling children separately
 */
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, 'children'> : T;

/**
 * Add an optional element reference to a type
 * Used for components that need to expose their DOM element
 *
 * @template T - The base props type
 * @template U - The HTML element type (defaults to HTMLElement)
 */
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
