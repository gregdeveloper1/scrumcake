/**
 * Class name merging utilities
 * @module @jobboard/utils/cn
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
