/**
 * Articles Data
 * ==============
 *
 * Mock data for article/post entities in the platform.
 * Contains 50 diverse articles across different topics and communities.
 *
 * In production, this data would come from a database/API.
 *
 * Usage:
 * ```typescript
 * import { articles, getArticleBySlug, getArticlesByAuthor, type Article } from '$lib/data/articles';
 *
 * // Get all articles
 * articles.forEach(a => console.log(a.title));
 *
 * // Find specific article
 * const article = getArticleBySlug('getting-started-with-svelte-5-runes');
 *
 * // Get articles by author
 * const userArticles = getArticlesByAuthor('sarahchen');
 * ```
 */

import { users, type User } from './users';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Article entity type
 * Represents a blog post/article in the platform
 */
export interface Article {
	/** Unique identifier */
	id: string;
	/** Article title */
	title: string;
	/** URL-friendly slug (used in routes) */
	slug: string;
	/** Short preview text */
	excerpt: string;
	/** Full article content (markdown/HTML) */
	content: string;
	/** Cover image URL (Unsplash) or null */
	coverImage: string | null;
	/** Article author (User reference) */
	author: User;
	/** Topic tags */
	tags: string[];
	/** Reaction counts */
	reactions: {
		hearts: number;
		unicorns: number;
		saves: number;
	};
	/** Number of comments */
	commentsCount: number;
	/** Estimated reading time in minutes */
	readingTime: number;
	/** ISO date string of publication */
	publishedAt: string;
	/** Community ID this article belongs to */
	community: string;
}

const articleData: Omit<Article, 'author'>[] = [
	{
		id: '1',
		title: 'Getting Started with Svelte 5 Runes',
		slug: 'getting-started-with-svelte-5-runes',
		excerpt: 'Learn how to use the new runes system in Svelte 5 for better reactivity and cleaner code.',
		content: `Svelte 5 introduces a *revolutionary* new way to handle reactivity with **runes**. If you've been working with Svelte 3 or 4, buckle up—this is the biggest change since Svelte's inception, and honestly? It's **fantastic**.

![Svelte Logo Animation](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzd5cDIzZnBzM2xjZ3B4OWJqaGt0cTd5ZHBrdWJ5a2xmYjBmYWk1aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ln7z2eWriiQAllfVcn/giphy.gif)

> **TL;DR**: Runes replace the magic \`$:\` syntax with explicit, predictable functions. Your code becomes easier to reason about, TypeScript integration is seamless, and the compiler can optimize better than ever.

---

## Why Runes? 🤔

Before we dive in, let me explain *why* the Svelte team made this change. The old reactive syntax had some quirks:

- \`$:\` was magical and implicit
- TypeScript support was hacky at best
- Debugging reactivity was confusing
- It was hard to know *when* things re-ran

> "Runes make reactivity **explicit** without making it **verbose**." — Rich Harris

---

## The Core Runes

Let's break down each rune and when to use it:

| Rune | Purpose | Replaces |
|------|---------|----------|
| \`$state\` | Reactive state | \`let x = 0\` |
| \`$derived\` | Computed values | \`$: doubled = x * 2\` |
| \`$effect\` | Side effects | \`$: console.log(x)\` |
| \`$props\` | Component props | \`export let prop\` |
| \`$bindable\` | Two-way bindable props | \`export let value\` (with bind:) |

---

### \`$state\` - Reactive State ✨

The \`$state\` rune creates reactive state that *automatically* triggers updates when changed. This is your bread and butter:

\`\`\`svelte
<script lang="ts">
  // Simple primitive state
  let count = $state(0);

  // Object state (deeply reactive!)
  let user = $state({
    name: 'John',
    age: 25,
    preferences: {
      theme: 'dark',
      notifications: true
    }
  });

  // Array state
  let todos = $state<string[]>([]);

  function increment() {
    count++; // Automatically reactive!
  }

  function addTodo(text: string) {
    todos.push(text); // Mutations work too!
  }
</script>

<button onclick={increment}>
  Count: {count}
</button>

<p>Hello, {user.name}!</p>
\`\`\`

> **Pro tip**: Unlike React's useState, you can mutate objects and arrays directly. Svelte handles it all! 🎉

---

### \`$derived\` - Computed Values 📊

Use \`$derived\` for values that depend on other reactive state. Think of it like a spreadsheet formula:

\`\`\`svelte
<script lang="ts">
  let count = $state(0);
  let items = $state([
    { name: 'Apple', active: true },
    { name: 'Banana', active: false },
    { name: 'Cherry', active: true }
  ]);

  // Simple derived values
  let doubled = $derived(count * 2);
  let isEven = $derived(count % 2 === 0);
  let quadrupled = $derived(doubled * 2); // Can chain!

  // For complex computations, use $derived.by()
  let activeItems = $derived.by(() => {
    console.log('Recalculating...'); // Only runs when items change
    return items.filter(i => i.active);
  });

  let summary = $derived.by(() => {
    return \`\${activeItems.length} of \${items.length} items active\`;
  });
</script>

<p>{count} × 2 = {doubled}</p>
<p>Active: {summary}</p>
\`\`\`

---

### \`$effect\` - Side Effects 🔄

The \`$effect\` rune handles side effects that should run when dependencies change. It's *perfect* for:

- Logging and debugging
- DOM manipulation
- Subscriptions
- Local storage sync

\`\`\`svelte
<script lang="ts">
  let count = $state(0);
  let query = $state('');

  // Basic effect - runs when count changes
  $effect(() => {
    console.log('Count is now:', count);
  });

  // Effect with cleanup (great for subscriptions!)
  $effect(() => {
    const timer = setInterval(() => {
      console.log('Tick! Count is', count);
    }, 1000);

    // Cleanup function runs before re-running
    return () => {
      clearInterval(timer);
      console.log('Timer cleaned up');
    };
  });

  // Debounced search effect
  $effect(() => {
    const searchQuery = query; // Track this dependency

    const timeout = setTimeout(() => {
      if (searchQuery) {
        console.log('Searching for:', searchQuery);
        // fetch(\`/api/search?q=\${searchQuery}\`)
      }
    }, 300);

    return () => clearTimeout(timeout);
  });
</script>
\`\`\`

> ⚠️ **Warning**: Don't update state inside effects without being careful—you can create infinite loops!

---

### \`$props\` - Component Props 📦

Define component props with *full* TypeScript support. No more guessing:

\`\`\`svelte
<script lang="ts">
  interface Props {
    // Required prop
    title: string;

    // Optional with default
    count?: number;
    variant?: 'primary' | 'secondary' | 'danger';

    // Event handler
    onclick?: (event: MouseEvent) => void;

    // Children snippet
    children?: import('svelte').Snippet;
  }

  let {
    title,
    count = 0,
    variant = 'primary',
    onclick,
    children
  }: Props = $props();
</script>

<div class="card card-{variant}">
  <h2>{title}</h2>
  <span class="badge">{count}</span>

  {#if children}
    {@render children()}
  {/if}

  <button {onclick}>Click me</button>
</div>
\`\`\`

---

## Migration Cheat Sheet

Here's your quick reference for migrating from Svelte 4:

### ❌ Old Svelte 4 Way

\`\`\`svelte
<script>
  export let name;
  export let count = 0;

  let doubled;
  $: doubled = count * 2;

  $: console.log('Count changed:', count);

  $: if (count > 10) {
    alert('High count!');
  }
</script>
\`\`\`

### ✅ New Svelte 5 Way

\`\`\`svelte
<script lang="ts">
  interface Props {
    name: string;
    count?: number;
  }

  let { name, count = 0 }: Props = $props();

  let doubled = $derived(count * 2);

  $effect(() => {
    console.log('Count changed:', count);
  });

  $effect(() => {
    if (count > 10) {
      alert('High count!');
    }
  });
</script>
\`\`\`

---

## Real-World Example: Todo App

Let's put it all together with a practical example:

\`\`\`svelte
<script lang="ts">
  interface Todo {
    id: number;
    text: string;
    completed: boolean;
  }

  let todos = $state<Todo[]>([]);
  let newTodo = $state('');
  let filter = $state<'all' | 'active' | 'completed'>('all');

  // Derived state
  let filteredTodos = $derived.by(() => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  });

  let remaining = $derived(todos.filter(t => !t.completed).length);
  let allCompleted = $derived(todos.length > 0 && remaining === 0);

  // Persist to localStorage
  $effect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  });

  function addTodo() {
    if (!newTodo.trim()) return;

    todos.push({
      id: Date.now(),
      text: newTodo.trim(),
      completed: false
    });

    newTodo = '';
  }

  function toggleAll() {
    const newState = !allCompleted;
    todos.forEach(t => t.completed = newState);
  }

  function clearCompleted() {
    todos = todos.filter(t => !t.completed);
  }
</script>

<div class="todo-app">
  <h1>todos</h1>

  <input
    type="text"
    placeholder="What needs to be done?"
    bind:value={newTodo}
    onkeydown={(e) => e.key === 'Enter' && addTodo()}
  />

  {#each filteredTodos as todo (todo.id)}
    <div class="todo-item">
      <input type="checkbox" bind:checked={todo.completed} />
      <span class:completed={todo.completed}>{todo.text}</span>
    </div>
  {/each}

  <footer>
    <span>{remaining} items left</span>
    <button onclick={clearCompleted}>Clear completed</button>
  </footer>
</div>
\`\`\`

---

## Key Takeaways 🎯

1. **\`$state\`** for reactive variables—objects and arrays are deeply reactive
2. **\`$derived\`** for computed values—use \`.by()\` for complex logic
3. **\`$effect\`** for side effects—always return a cleanup function when needed
4. **\`$props\`** for component props—full TypeScript inference
5. **No more \`$:\`**—everything is explicit now

The migration might feel like a lot at first, but trust me—once you get used to runes, you'll never want to go back. Your code will be *cleaner*, more *predictable*, and easier to *debug*.

**Happy coding!** 🚀

---

*Questions? Drop them in the comments! I love discussing Svelte patterns.*`,
		coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
		tags: ['svelte', 'javascript', 'tutorial'],
		reactions: { hearts: 245, unicorns: 32, saves: 89 },
		commentsCount: 42,
		readingTime: 12,
		publishedAt: '2024-12-28',
		community: 'dev'
	},
	{
		id: '2',
		title: 'Building a REST API with Node.js and Express',
		slug: 'building-rest-api-nodejs-express',
		excerpt: 'A comprehensive guide to creating robust REST APIs using Node.js and Express framework.',
		content: 'REST APIs are the backbone of modern web applications...',
		coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
		tags: ['nodejs', 'express', 'api', 'backend'],
		reactions: { hearts: 189, unicorns: 24, saves: 156 },
		commentsCount: 35,
		readingTime: 8,
		publishedAt: '2024-12-27',
		community: 'webdev'
	},
	{
		id: '3',
		title: 'CSS Grid vs Flexbox: When to Use Which',
		slug: 'css-grid-vs-flexbox-when-to-use',
		excerpt: 'Understanding the differences between CSS Grid and Flexbox and when to use each.',
		content: 'Both CSS Grid and Flexbox are powerful layout systems...',
		coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop',
		tags: ['css', 'webdev', 'frontend'],
		reactions: { hearts: 567, unicorns: 89, saves: 234 },
		commentsCount: 78,
		readingTime: 6,
		publishedAt: '2024-12-26',
		community: 'webdev'
	},
	{
		id: '4',
		title: 'Introduction to TypeScript Generics',
		slug: 'introduction-typescript-generics',
		excerpt: 'Master TypeScript generics to write more flexible and reusable code.',
		content: `Generics are often called the *"scary part"* of TypeScript. But here's the thing—they're actually **incredibly intuitive** once you understand the mental model. Today, I'll break down generics in a way that finally makes sense.

![TypeScript Animation](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnVyNXV5ZGVnOWlxN3NiaXV5eHpsdHQ4NHVxajRwbW5ua2M3aXFwYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SS8CV2rQdlYNLtBCiF/giphy.gif)

> **TL;DR**: Generics are like *function parameters*, but for **types**. Just as you pass values to functions, you pass types to generics.

---

## The Problem Generics Solve 🤔

Let me show you *why* generics exist with a real scenario. Imagine you're building a utility function:

### ❌ The Naive Approach (Loses Type Safety)

\`\`\`typescript
// Using 'any' - BAD! We lose all type information
function getFirstElement(arr: any[]): any {
  return arr[0];
}

const numbers = [1, 2, 3];
const first = getFirstElement(numbers);
// TypeScript thinks 'first' is 'any' 😩
// first.toUpperCase() // No error, but will crash at runtime!
\`\`\`

### ❌ The Exhaustive Approach (Doesn't Scale)

\`\`\`typescript
// Writing separate functions - tedious!
function getFirstNumber(arr: number[]): number { return arr[0]; }
function getFirstString(arr: string[]): string { return arr[0]; }
function getFirstUser(arr: User[]): User { return arr[0]; }
// ... and on and on forever 🙄
\`\`\`

### ✅ The Generic Approach (Perfect!)

\`\`\`typescript
// One function that works with ANY type
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const numbers = [1, 2, 3];
const strings = ['a', 'b', 'c'];
const users: User[] = [{ name: 'Alice' }, { name: 'Bob' }];

const firstNum = getFirstElement(numbers);    // type: number ✨
const firstStr = getFirstElement(strings);    // type: string ✨
const firstUser = getFirstElement(users);     // type: User ✨
\`\`\`

> Think of \`<T>\` as a **placeholder** that gets filled in when you use the function. TypeScript *infers* the type from what you pass!

---

## Generic Syntax Breakdown

Let's demystify the syntax piece by piece:

| Syntax | Meaning | Example |
|--------|---------|---------|
| \`<T>\` | Type parameter declaration | \`function foo<T>()\` |
| \`T\` | Reference to the type parameter | \`arr: T[]\` |
| \`<T, U>\` | Multiple type parameters | \`function pair<T, U>()\` |
| \`<T extends X>\` | Type constraint | \`<T extends string>\` |
| \`<T = string>\` | Default type | \`<T = unknown>\` |

---

## Multiple Type Parameters

You can use as many type parameters as you need:

\`\`\`typescript
// Two type parameters: T and U
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair("hello", 42);
// result type: [string, number]

// Three type parameters
function transform<Input, Output, Meta>(
  value: Input,
  transformer: (val: Input) => Output,
  metadata: Meta
): { result: Output; meta: Meta } {
  return {
    result: transformer(value),
    meta: metadata
  };
}

const transformed = transform(
  "42",
  (str) => parseInt(str),
  { timestamp: Date.now() }
);
// { result: number; meta: { timestamp: number } }
\`\`\`

> **Naming convention**: Use \`T\` for the first type, \`U\` for second, \`V\` for third. For semantics, use descriptive names like \`TInput\`, \`TOutput\`, \`TKey\`, \`TValue\`.

---

## Generic Interfaces & Types

Interfaces and type aliases can also be generic:

\`\`\`typescript
// Generic interface for API responses
interface ApiResponse<TData> {
  data: TData;
  status: number;
  message: string;
  timestamp: Date;
}

// Generic interface for paginated data
interface PaginatedResult<TItem> {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  sku: string;
  name: string;
  price: number;
}

// Type-safe responses!
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "Alice", email: "alice@example.com" },
  status: 200,
  message: "Success",
  timestamp: new Date()
};

const productList: PaginatedResult<Product> = {
  items: [{ sku: "ABC123", name: "Widget", price: 9.99 }],
  total: 100,
  page: 1,
  pageSize: 10,
  hasNextPage: true
};
\`\`\`

---

## Generic Constraints with \`extends\`

Sometimes you need to *limit* what types can be used. That's where constraints come in:

\`\`\`typescript
// Constrain T to objects with a 'length' property
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): number {
  console.log(\`Length is: \${item.length}\`);
  return item.length;
}

// All of these work! ✅
logLength("hello");           // string has length
logLength([1, 2, 3]);         // array has length
logLength({ length: 10 });    // object with length property
logLength(new Map([[1, 2]])); // Map has size, not length - ERROR! ❌
\`\`\`

### Real-World Constraint Example

\`\`\`typescript
// Ensure T has an 'id' property for database operations
interface Entity {
  id: string | number;
}

class Repository<T extends Entity> {
  private items: Map<T['id'], T> = new Map();

  save(item: T): void {
    this.items.set(item.id, item);
  }

  find(id: T['id']): T | undefined {
    return this.items.get(id);
  }

  findAll(): T[] {
    return Array.from(this.items.values());
  }

  delete(id: T['id']): boolean {
    return this.items.delete(id);
  }
}

interface User extends Entity {
  id: number;
  name: string;
  email: string;
}

interface Post extends Entity {
  id: string;  // UUID
  title: string;
  content: string;
  authorId: number;
}

const userRepo = new Repository<User>();
const postRepo = new Repository<Post>();

userRepo.save({ id: 1, name: "Alice", email: "alice@test.com" });
postRepo.save({ id: "abc-123", title: "Hello", content: "...", authorId: 1 });
\`\`\`

---

## Generic Classes

Build reusable, type-safe data structures:

\`\`\`typescript
// Generic Stack implementation
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  get size(): number {
    return this.items.length;
  }
}

// Usage - fully typed!
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);

const popped = numberStack.pop(); // type: number | undefined

const stringStack = new Stack<string>();
stringStack.push("hello");
// stringStack.push(42);  // Error: Argument of type 'number'...
\`\`\`

---

## Practical Example: Type-Safe API Client

Here's a real-world example combining everything we've learned:

\`\`\`typescript
// Define our API types
interface ApiError {
  code: string;
  message: string;
}

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

// Generic fetch wrapper with full type safety
async function fetchApi<TResponse>(
  url: string,
  options?: RequestInit
): Promise<Result<TResponse>> {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: \`HTTP_\${response.status}\`,
          message: response.statusText
        }
      };
    }

    const data = await response.json() as TResponse;
    return { success: true, data };

  } catch (err) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error'
      }
    };
  }
}

// Helper for POST/PUT requests
async function postApi<TBody, TResponse>(
  url: string,
  body: TBody
): Promise<Result<TResponse>> {
  return fetchApi<TResponse>(url, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserInput {
  name: string;
  email: string;
}

// Fully typed!
const result = await fetchApi<User[]>('/api/users');

if (result.success) {
  // TypeScript knows result.data is User[]
  result.data.forEach(user => {
    console.log(user.name); // ✅ Autocomplete works!
  });
} else {
  // TypeScript knows result.error exists
  console.error(result.error.message);
}

const createResult = await postApi<CreateUserInput, User>(
  '/api/users',
  { name: 'Alice', email: 'alice@example.com' }
);
\`\`\`

---

## Common Generic Utility Types

TypeScript ships with helpful built-in generic types:

| Utility | Purpose | Example |
|---------|---------|---------|
| \`Partial<T>\` | All properties optional | \`Partial<User>\` |
| \`Required<T>\` | All properties required | \`Required<Config>\` |
| \`Pick<T, K>\` | Select specific keys | \`Pick<User, 'id' | 'name'>\` |
| \`Omit<T, K>\` | Remove specific keys | \`Omit<User, 'password'>\` |
| \`Record<K, V>\` | Object with key type K, value type V | \`Record<string, number>\` |
| \`ReturnType<F>\` | Extract return type of function | \`ReturnType<typeof myFn>\` |

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// For updates, all fields are optional
type UpdateUserInput = Partial<User>;

// For display, hide the password
type PublicUser = Omit<User, 'password'>;

// For creation, exclude auto-generated fields
type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

// Dictionary of users by ID
type UserMap = Record<number, User>;
\`\`\`

---

## Key Takeaways 🎯

1. **Generics are type parameters** — just like function parameters, but for types
2. **Use \`<T>\`** to declare a type parameter, then reference it throughout
3. **Constraints with \`extends\`** — limit what types can be used
4. **TypeScript infers types** — you often don't need to specify them explicitly
5. **Built-in utility types** — \`Partial\`, \`Pick\`, \`Omit\`, etc. are your friends

Generics are one of those features that seem complex at first but become *indispensable* once you get them. Start small—add generics to one function—and build from there!

**Happy typing!** 🚀

---

*Found this helpful? Follow me for more TypeScript deep dives!*`,
		coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
		tags: ['typescript', 'javascript', 'tutorial'],
		reactions: { hearts: 423, unicorns: 67, saves: 198 },
		commentsCount: 56,
		readingTime: 14,
		publishedAt: '2024-12-25',
		community: 'javascript'
	},
	{
		id: '5',
		title: 'Python Decorators Explained Simply',
		slug: 'python-decorators-explained-simply',
		excerpt: 'Demystifying Python decorators with practical examples and use cases.',
		content: `Decorators are one of Python's most *elegant* features—and also one of the most **misunderstood**. Today, I'm going to demystify them completely. By the end of this article, you'll be writing your own decorators like a pro.

![Python Animation](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3V0djVnY2FsZ3dlYmwxa3dud2F2c3czZzAzYnQzNHN4YjFobTEzciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KAq5w47R9rmTuvWOWa/giphy.gif)

> **TL;DR**: A decorator is just a function that *wraps* another function to extend its behavior—without modifying the original function's code.

---

## The Mental Model 🧠

Before we dive into code, let's build the right mental model. Think of decorators like *gift wrapping*:

- **The function** = the gift inside
- **The decorator** = the wrapping paper
- **The result** = a nicely wrapped present with the same gift inside

The gift (your function) doesn't change, but now it comes with something extra (the wrapping).

---

## Why Do Decorators Exist?

Decorators solve a common problem: *adding behavior to functions without touching their code*. Here are real scenarios where they shine:

| Use Case | Without Decorator | With Decorator |
|----------|-------------------|----------------|
| Logging | Add print statements everywhere 😩 | \`@log\` once |
| Timing | Wrap every function manually | \`@timer\` once |
| Authentication | Check auth in every route | \`@login_required\` once |
| Caching | Manual cache logic everywhere | \`@cache\` once |
| Retry logic | Try/except in every function | \`@retry(3)\` once |

---

## Basic Decorator Anatomy

Let's break down a decorator step by step:

\`\`\`python
def my_decorator(func):
    """
    A decorator that prints messages before and after
    the wrapped function executes.
    """
    def wrapper():
        print("🚀 Before the function runs")
        func()  # Call the original function
        print("✅ After the function runs")
    return wrapper

# Apply the decorator with @ syntax
@my_decorator
def say_hello():
    print("Hello, World!")

# When you call say_hello(), you're actually calling wrapper()
say_hello()

# Output:
# 🚀 Before the function runs
# Hello, World!
# ✅ After the function runs
\`\`\`

> **Key insight**: The \`@my_decorator\` syntax is just *syntactic sugar* for:
> \`\`\`python
> say_hello = my_decorator(say_hello)
> \`\`\`

---

## Handling Function Arguments

Real functions have arguments. Here's how to handle them properly:

\`\`\`python
def log_calls(func):
    """Logs every call with arguments and return value."""
    def wrapper(*args, **kwargs):
        # *args captures positional arguments
        # **kwargs captures keyword arguments
        print(f"📞 Calling {func.__name__}")
        print(f"   Args: {args}")
        print(f"   Kwargs: {kwargs}")

        result = func(*args, **kwargs)

        print(f"   Returned: {result}")
        return result
    return wrapper

@log_calls
def add(a, b, verbose=False):
    if verbose:
        print(f"Adding {a} + {b}")
    return a + b

# Test it!
result = add(3, 5, verbose=True)

# Output:
# 📞 Calling add
#    Args: (3, 5)
#    Kwargs: {'verbose': True}
# Adding 3 + 5
#    Returned: 8
\`\`\`

---

## The Critical \`@wraps\` Decorator ⚠️

There's a subtle bug in our decorators. Watch this:

### ❌ Without \`@wraps\`

\`\`\`python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def greet(name):
    """Greets a person by name."""
    return f"Hello, {name}!"

print(greet.__name__)  # Output: "wrapper" 😱
print(greet.__doc__)   # Output: None 😱
\`\`\`

### ✅ With \`@wraps\`

\`\`\`python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # This preserves the original function's metadata!
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def greet(name):
    """Greets a person by name."""
    return f"Hello, {name}!"

print(greet.__name__)  # Output: "greet" ✅
print(greet.__doc__)   # Output: "Greets a person by name." ✅
\`\`\`

> **Always use \`@wraps\`!** It preserves the function's \`__name__\`, \`__doc__\`, and other metadata. This is crucial for debugging and introspection.

---

## Practical Example: Timing Decorator ⏱️

One of the most useful decorators measures execution time:

\`\`\`python
import time
from functools import wraps

def timer(func):
    """Measures and prints function execution time."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()

        result = func(*args, **kwargs)

        end = time.perf_counter()
        duration = end - start

        # Format nicely based on duration
        if duration < 0.001:
            print(f"⚡ {func.__name__} took {duration*1000000:.2f}μs")
        elif duration < 1:
            print(f"⏱️ {func.__name__} took {duration*1000:.2f}ms")
        else:
            print(f"🐌 {func.__name__} took {duration:.2f}s")

        return result
    return wrapper

@timer
def fast_function():
    return sum(range(100))

@timer
def slow_function():
    time.sleep(1.5)
    return "Done!"

fast_function()   # ⚡ fast_function took 3.21μs
slow_function()   # 🐌 slow_function took 1.50s
\`\`\`

---

## Decorators with Parameters

Sometimes you need *configurable* decorators. This requires an extra layer of nesting:

\`\`\`python
from functools import wraps
import time

def retry(max_attempts=3, delay=1.0):
    """
    Retries a function on failure.

    Args:
        max_attempts: Maximum retry attempts (default: 3)
        delay: Seconds between retries (default: 1.0)
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None

            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    print(f"⚠️ Attempt {attempt}/{max_attempts} failed: {e}")

                    if attempt < max_attempts:
                        print(f"   Retrying in {delay}s...")
                        time.sleep(delay)

            raise last_exception

        return wrapper
    return decorator

# Usage - configurable!
@retry(max_attempts=5, delay=0.5)
def flaky_api_call():
    import random
    if random.random() < 0.7:  # 70% chance of failure
        raise ConnectionError("Network timeout")
    return {"status": "success"}

# Or with defaults
@retry()
def another_function():
    pass
\`\`\`

---

## Class-Based Decorators

For stateful decorators, use a class:

\`\`\`python
class CountCalls:
    """Counts how many times a function is called."""

    def __init__(self, func):
        self.func = func
        self.count = 0
        # Preserve function metadata manually
        self.__name__ = func.__name__
        self.__doc__ = func.__doc__

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"📊 {self.func.__name__} has been called {self.count} time(s)")
        return self.func(*args, **kwargs)

    def reset(self):
        """Reset the call counter."""
        self.count = 0

@CountCalls
def fetch_data():
    return {"data": "some value"}

fetch_data()  # 📊 fetch_data has been called 1 time(s)
fetch_data()  # 📊 fetch_data has been called 2 time(s)
fetch_data()  # 📊 fetch_data has been called 3 time(s)

print(f"Total calls: {fetch_data.count}")  # Total calls: 3
fetch_data.reset()  # Reset the counter
\`\`\`

---

## Real-World Example: Caching Decorator

Here's a production-ready caching decorator:

\`\`\`python
from functools import wraps
from datetime import datetime, timedelta

def cache(ttl_seconds=60):
    """
    Caches function results with time-to-live expiration.

    Args:
        ttl_seconds: Cache lifetime in seconds (default: 60)
    """
    def decorator(func):
        _cache = {}

        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create a hashable cache key
            key = (args, tuple(sorted(kwargs.items())))

            now = datetime.now()

            # Check if we have a valid cached value
            if key in _cache:
                result, timestamp = _cache[key]
                if now - timestamp < timedelta(seconds=ttl_seconds):
                    print(f"📦 Cache HIT for {func.__name__}")
                    return result
                else:
                    print(f"⏰ Cache EXPIRED for {func.__name__}")

            # Cache miss - compute and store
            print(f"🔄 Cache MISS for {func.__name__}")
            result = func(*args, **kwargs)
            _cache[key] = (result, now)
            return result

        # Add utility method to clear cache
        def clear_cache():
            _cache.clear()
            print(f"🗑️ Cache cleared for {func.__name__}")

        wrapper.clear_cache = clear_cache
        return wrapper

    return decorator

@cache(ttl_seconds=30)
def expensive_calculation(n):
    """Simulates an expensive operation."""
    import time
    time.sleep(2)  # Simulate slow computation
    return n ** 2

# First call - cache miss (takes 2 seconds)
result = expensive_calculation(5)  # 🔄 Cache MISS

# Second call - cache hit (instant!)
result = expensive_calculation(5)  # 📦 Cache HIT

# Clear cache manually if needed
expensive_calculation.clear_cache()  # 🗑️ Cache cleared
\`\`\`

---

## Stacking Multiple Decorators

You can apply multiple decorators to a single function:

\`\`\`python
@timer
@log_calls
@retry(max_attempts=3)
def fetch_user_data(user_id):
    # This function is now:
    # 1. Retried on failure
    # 2. Logged on every call
    # 3. Timed for performance
    return api.get(f"/users/{user_id}")

# Decorators apply from bottom to top!
# Equivalent to: timer(log_calls(retry(max_attempts=3)(fetch_user_data)))
\`\`\`

> **Order matters!** Decorators are applied bottom-to-top, but execute top-to-bottom.

---

## Common Decorator Patterns Cheat Sheet

| Pattern | Use Case | Key Features |
|---------|----------|--------------|
| \`@timer\` | Performance monitoring | Measure execution time |
| \`@retry\` | Network resilience | Auto-retry on failure |
| \`@cache\` | Expensive operations | Memoize results |
| \`@validate\` | Input validation | Type/value checking |
| \`@authenticate\` | Security | Check permissions |
| \`@deprecated\` | Migration | Warn about old APIs |
| \`@rate_limit\` | API protection | Throttle calls |

---

## Key Takeaways 🎯

1. **Decorators wrap functions** — they add behavior without changing the original code
2. **Use \`*args, **kwargs\`** — to handle any function signature
3. **Always use \`@wraps\`** — to preserve function metadata
4. **Three levels for parameters** — decorator factory → decorator → wrapper
5. **Class decorators for state** — when you need to track information across calls

Decorators are a *superpower* in Python. Once you master them, you'll find yourself using them everywhere to write cleaner, more maintainable code.

**Happy decorating!** 🐍✨

---

*Got decorator patterns you love? Share them in the comments!*`,
		coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
		tags: ['python', 'tutorial', 'beginners'],
		reactions: { hearts: 312, unicorns: 45, saves: 167 },
		commentsCount: 29,
		readingTime: 13,
		publishedAt: '2024-12-24',
		community: 'python'
	},
	{
		id: '6',
		title: 'Design Systems: Building for Scale',
		slug: 'design-systems-building-for-scale',
		excerpt: 'How to create and maintain design systems that scale with your organization.',
		content: 'A well-structured design system is crucial for consistency...',
		coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
		tags: ['design', 'designsystems', 'ui'],
		reactions: { hearts: 234, unicorns: 56, saves: 178 },
		commentsCount: 34,
		readingTime: 9,
		publishedAt: '2024-12-23',
		community: 'design'
	},
	{
		id: '7',
		title: 'Svelte 5 Components Deep Dive',
		slug: 'svelte-5-components-deep-dive',
		excerpt: 'Understanding Svelte 5 components and how runes change the game.',
		content: 'Svelte 5 components represent a paradigm shift in frontend development...',
		coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
		tags: ['svelte', 'sveltekit', 'performance'],
		reactions: { hearts: 678, unicorns: 123, saves: 345 },
		commentsCount: 89,
		readingTime: 12,
		publishedAt: '2024-12-22',
		community: 'javascript'
	},
	{
		id: '8',
		title: 'Docker for JavaScript Developers',
		slug: 'docker-for-javascript-developers',
		excerpt: 'A practical guide to using Docker in your JavaScript projects.',
		content: 'Docker has become an essential tool for modern development...',
		coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop',
		tags: ['docker', 'devops', 'javascript'],
		reactions: { hearts: 456, unicorns: 78, saves: 234 },
		commentsCount: 45,
		readingTime: 10,
		publishedAt: '2024-12-21',
		community: 'dev'
	},
	{
		id: '9',
		title: 'Mastering Git Branching Strategies',
		slug: 'mastering-git-branching-strategies',
		excerpt: 'Learn different Git branching strategies and when to use them.',
		content: 'Choosing the right branching strategy is crucial for team productivity...',
		coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop',
		tags: ['git', 'devops', 'productivity'],
		reactions: { hearts: 567, unicorns: 89, saves: 289 },
		commentsCount: 67,
		readingTime: 7,
		publishedAt: '2024-12-20',
		community: 'dev'
	},
	{
		id: '10',
		title: 'Building Accessible Web Forms',
		slug: 'building-accessible-web-forms',
		excerpt: 'Best practices for creating web forms that everyone can use.',
		content: 'Accessibility in web forms is often overlooked but crucial...',
		coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
		tags: ['accessibility', 'html', 'webdev'],
		reactions: { hearts: 345, unicorns: 67, saves: 189 },
		commentsCount: 34,
		readingTime: 6,
		publishedAt: '2024-12-19',
		community: 'webdev'
	},
	{
		id: '11',
		title: 'Understanding JavaScript Closures',
		slug: 'understanding-javascript-closures',
		excerpt: 'A deep dive into JavaScript closures and how to use them effectively.',
		content: 'Closures are a fundamental concept in JavaScript...',
		coverImage: null,
		tags: ['javascript', 'beginners', 'tutorial'],
		reactions: { hearts: 234, unicorns: 34, saves: 156 },
		commentsCount: 28,
		readingTime: 5,
		publishedAt: '2024-12-18',
		community: 'javascript'
	},
	{
		id: '12',
		title: 'PostgreSQL Performance Optimization Tips',
		slug: 'postgresql-performance-optimization-tips',
		excerpt: 'Practical tips to improve your PostgreSQL database performance.',
		content: 'Database performance is critical for application responsiveness...',
		coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
		tags: ['postgresql', 'database', 'performance'],
		reactions: { hearts: 189, unicorns: 23, saves: 134 },
		commentsCount: 19,
		readingTime: 8,
		publishedAt: '2024-12-17',
		community: 'dev'
	},
	{
		id: '13',
		title: 'Creating Beautiful UI with Tailwind CSS',
		slug: 'creating-beautiful-ui-tailwind-css',
		excerpt: 'Learn how to build stunning user interfaces using Tailwind CSS.',
		content: 'Tailwind CSS has revolutionized how we approach styling...',
		coverImage: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=800&h=400&fit=crop',
		tags: ['tailwindcss', 'css', 'design'],
		reactions: { hearts: 456, unicorns: 78, saves: 234 },
		commentsCount: 56,
		readingTime: 7,
		publishedAt: '2024-12-16',
		community: 'design'
	},
	{
		id: '14',
		title: 'Machine Learning with Python: A Beginner Guide',
		slug: 'machine-learning-python-beginner-guide',
		excerpt: 'Start your machine learning journey with Python and scikit-learn.',
		content: 'Machine learning is transforming every industry...',
		coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
		tags: ['python', 'machinelearning', 'beginners'],
		reactions: { hearts: 678, unicorns: 123, saves: 456 },
		commentsCount: 89,
		readingTime: 15,
		publishedAt: '2024-12-15',
		community: 'python'
	},
	{
		id: '15',
		title: 'Web Security Best Practices 2024',
		slug: 'web-security-best-practices-2024',
		excerpt: 'Essential security practices every web developer should know.',
		content: 'Security should never be an afterthought in web development...',
		coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
		tags: ['security', 'webdev', 'bestpractices'],
		reactions: { hearts: 567, unicorns: 89, saves: 345 },
		commentsCount: 67,
		readingTime: 10,
		publishedAt: '2024-12-14',
		community: 'dev'
	},
	{
		id: '16',
		title: 'State Management in Vue 3 with Pinia',
		slug: 'state-management-vue3-pinia',
		excerpt: 'Master state management in Vue 3 applications using Pinia.',
		content: 'Pinia has become the recommended state management solution for Vue...',
		coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=400&fit=crop',
		tags: ['vue', 'javascript', 'statemanagement'],
		reactions: { hearts: 234, unicorns: 45, saves: 167 },
		commentsCount: 34,
		readingTime: 8,
		publishedAt: '2024-12-13',
		community: 'javascript'
	},
	{
		id: '17',
		title: 'Building CLI Tools with Node.js',
		slug: 'building-cli-tools-nodejs',
		excerpt: 'Create powerful command-line tools using Node.js and popular libraries.',
		content: 'Command-line tools are essential for developer productivity...',
		coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop',
		tags: ['nodejs', 'cli', 'tools'],
		reactions: { hearts: 189, unicorns: 34, saves: 123 },
		commentsCount: 23,
		readingTime: 9,
		publishedAt: '2024-12-12',
		community: 'dev'
	},
	{
		id: '18',
		title: 'Color Theory for UI Designers',
		slug: 'color-theory-ui-designers',
		excerpt: 'Understanding color theory and applying it to create harmonious designs.',
		content: 'Color is one of the most powerful tools in a designer arsenal...',
		coverImage: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&h=400&fit=crop',
		tags: ['design', 'colortheory', 'ui'],
		reactions: { hearts: 345, unicorns: 67, saves: 234 },
		commentsCount: 45,
		readingTime: 6,
		publishedAt: '2024-12-11',
		community: 'design'
	},
	{
		id: '19',
		title: 'Testing Svelte Applications with Vitest',
		slug: 'testing-svelte-applications-vitest',
		excerpt: 'A complete guide to testing Svelte apps using Vitest and Testing Library.',
		content: 'Testing is crucial for maintaining code quality...',
		coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
		tags: ['svelte', 'testing', 'vitest'],
		reactions: { hearts: 289, unicorns: 45, saves: 178 },
		commentsCount: 34,
		readingTime: 11,
		publishedAt: '2024-12-10',
		community: 'javascript'
	},
	{
		id: '20',
		title: 'Introduction to GraphQL',
		slug: 'introduction-to-graphql',
		excerpt: 'Learn the basics of GraphQL and why it might be better than REST for your API.',
		content: 'GraphQL provides a more efficient alternative to REST...',
		coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
		tags: ['graphql', 'api', 'backend'],
		reactions: { hearts: 456, unicorns: 78, saves: 267 },
		commentsCount: 56,
		readingTime: 8,
		publishedAt: '2024-12-09',
		community: 'dev'
	},
	{
		id: '21',
		title: 'Async/Await Patterns in Python',
		slug: 'async-await-patterns-python',
		excerpt: 'Master asynchronous programming in Python with async/await.',
		content: 'Asynchronous programming can significantly improve performance...',
		coverImage: null,
		tags: ['python', 'async', 'performance'],
		reactions: { hearts: 234, unicorns: 34, saves: 145 },
		commentsCount: 28,
		readingTime: 7,
		publishedAt: '2024-12-08',
		community: 'python'
	},
	{
		id: '22',
		title: 'Responsive Design Without Media Queries',
		slug: 'responsive-design-without-media-queries',
		excerpt: 'Modern CSS techniques for creating responsive layouts without media queries.',
		content: 'CSS has evolved to provide powerful responsive capabilities...',
		coverImage: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&h=400&fit=crop',
		tags: ['css', 'responsive', 'webdev'],
		reactions: { hearts: 567, unicorns: 89, saves: 345 },
		commentsCount: 67,
		readingTime: 6,
		publishedAt: '2024-12-07',
		community: 'webdev'
	},
	{
		id: '23',
		title: 'Kubernetes for Beginners',
		slug: 'kubernetes-for-beginners',
		excerpt: 'Get started with Kubernetes and container orchestration.',
		content: 'Kubernetes has become the standard for container orchestration...',
		coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop',
		tags: ['kubernetes', 'devops', 'docker'],
		reactions: { hearts: 456, unicorns: 67, saves: 289 },
		commentsCount: 56,
		readingTime: 12,
		publishedAt: '2024-12-06',
		community: 'dev'
	},
	{
		id: '24',
		title: 'Building Real-time Apps with Socket.io',
		slug: 'building-realtime-apps-socketio',
		excerpt: 'Create real-time applications using Socket.io and Node.js.',
		content: 'Real-time functionality is essential for modern web apps...',
		coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
		tags: ['nodejs', 'socketio', 'realtime'],
		reactions: { hearts: 345, unicorns: 56, saves: 198 },
		commentsCount: 45,
		readingTime: 9,
		publishedAt: '2024-12-05',
		community: 'webdev'
	},
	{
		id: '25',
		title: 'Design Principles Every Developer Should Know',
		slug: 'design-principles-every-developer-should-know',
		excerpt: 'Essential design principles that will make you a better developer.',
		content: 'Good design is not just for designers...',
		coverImage: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=800&h=400&fit=crop',
		tags: ['design', 'frontend', 'career'],
		reactions: { hearts: 678, unicorns: 123, saves: 456 },
		commentsCount: 89,
		readingTime: 7,
		publishedAt: '2024-12-04',
		community: 'design'
	},
	{
		id: '26',
		title: 'JavaScript Event Loop Explained',
		slug: 'javascript-event-loop-explained',
		excerpt: 'Understand how the JavaScript event loop works under the hood.',
		content: 'The event loop is central to JavaScript asynchronous behavior...',
		coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop',
		tags: ['javascript', 'fundamentals', 'tutorial'],
		reactions: { hearts: 456, unicorns: 78, saves: 289 },
		commentsCount: 56,
		readingTime: 8,
		publishedAt: '2024-12-03',
		community: 'javascript'
	},
	{
		id: '27',
		title: 'Data Visualization with D3.js',
		slug: 'data-visualization-d3js',
		excerpt: 'Create stunning data visualizations using D3.js.',
		content: 'D3.js is the most powerful library for data visualization...',
		coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
		tags: ['d3js', 'visualization', 'javascript'],
		reactions: { hearts: 289, unicorns: 45, saves: 178 },
		commentsCount: 34,
		readingTime: 10,
		publishedAt: '2024-12-02',
		community: 'dev'
	},
	{
		id: '28',
		title: 'Django REST Framework Complete Guide',
		slug: 'django-rest-framework-complete-guide',
		excerpt: 'Build powerful APIs with Django REST Framework.',
		content: 'Django REST Framework makes it easy to build web APIs...',
		coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop',
		tags: ['python', 'django', 'api'],
		reactions: { hearts: 345, unicorns: 56, saves: 234 },
		commentsCount: 45,
		readingTime: 14,
		publishedAt: '2024-12-01',
		community: 'python'
	},
	{
		id: '29',
		title: 'CSS Animation Techniques',
		slug: 'css-animation-techniques',
		excerpt: 'Master CSS animations to create engaging user experiences.',
		content: 'Animations can greatly enhance user experience...',
		coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
		tags: ['css', 'animation', 'frontend'],
		reactions: { hearts: 456, unicorns: 89, saves: 267 },
		commentsCount: 56,
		readingTime: 7,
		publishedAt: '2024-11-30',
		community: 'webdev'
	},
	{
		id: '30',
		title: 'Microservices Architecture Patterns',
		slug: 'microservices-architecture-patterns',
		excerpt: 'Common patterns for building microservices architectures.',
		content: 'Microservices have become the go-to architecture for large applications...',
		coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
		tags: ['microservices', 'architecture', 'backend'],
		reactions: { hearts: 567, unicorns: 89, saves: 345 },
		commentsCount: 78,
		readingTime: 13,
		publishedAt: '2024-11-29',
		community: 'dev'
	},
	{
		id: '31',
		title: 'SvelteKit Routing Deep Dive',
		slug: 'sveltekit-routing-deep-dive',
		excerpt: 'Everything you need to know about SvelteKit file-based routing.',
		content: 'File-based routing is a core feature of SvelteKit...',
		coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=400&fit=crop',
		tags: ['sveltekit', 'svelte', 'frontend'],
		reactions: { hearts: 789, unicorns: 145, saves: 456 },
		commentsCount: 98,
		readingTime: 11,
		publishedAt: '2024-11-28',
		community: 'javascript'
	},
	{
		id: '32',
		title: 'UI/UX Best Practices for Mobile Apps',
		slug: 'ui-ux-best-practices-mobile-apps',
		excerpt: 'Design principles for creating great mobile experiences.',
		content: 'Mobile design requires special considerations...',
		coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
		tags: ['design', 'mobile', 'ux'],
		reactions: { hearts: 345, unicorns: 67, saves: 234 },
		commentsCount: 45,
		readingTime: 8,
		publishedAt: '2024-11-27',
		community: 'design'
	},
	{
		id: '33',
		title: 'Redis Caching Strategies',
		slug: 'redis-caching-strategies',
		excerpt: 'Implement effective caching strategies using Redis.',
		content: 'Caching is essential for application performance...',
		coverImage: null,
		tags: ['redis', 'caching', 'performance'],
		reactions: { hearts: 234, unicorns: 34, saves: 156 },
		commentsCount: 28,
		readingTime: 9,
		publishedAt: '2024-11-26',
		community: 'dev'
	},
	{
		id: '34',
		title: 'TypeScript Utility Types Deep Dive',
		slug: 'typescript-utility-types-deep-dive',
		excerpt: 'Master TypeScript built-in utility types for better code.',
		content: 'TypeScript utility types are powerful tools...',
		coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
		tags: ['typescript', 'javascript', 'tutorial'],
		reactions: { hearts: 456, unicorns: 78, saves: 289 },
		commentsCount: 56,
		readingTime: 10,
		publishedAt: '2024-11-25',
		community: 'javascript'
	},
	{
		id: '35',
		title: 'Flask vs FastAPI: Which to Choose',
		slug: 'flask-vs-fastapi-which-to-choose',
		excerpt: 'Comparing Flask and FastAPI for your next Python project.',
		content: 'Both Flask and FastAPI are excellent choices...',
		coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
		tags: ['python', 'flask', 'fastapi'],
		reactions: { hearts: 345, unicorns: 56, saves: 198 },
		commentsCount: 67,
		readingTime: 8,
		publishedAt: '2024-11-24',
		community: 'python'
	},
	{
		id: '36',
		title: 'Building a Component Library',
		slug: 'building-a-component-library',
		excerpt: 'Create and maintain your own reusable component library.',
		content: 'A well-designed component library saves development time...',
		coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop',
		tags: ['components', 'frontend', 'design'],
		reactions: { hearts: 456, unicorns: 89, saves: 267 },
		commentsCount: 56,
		readingTime: 12,
		publishedAt: '2024-11-23',
		community: 'design'
	},
	{
		id: '37',
		title: 'Serverless Functions with Vercel',
		slug: 'serverless-functions-vercel',
		excerpt: 'Deploy serverless functions easily with Vercel.',
		content: 'Serverless computing has simplified backend development...',
		coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
		tags: ['serverless', 'vercel', 'backend'],
		reactions: { hearts: 289, unicorns: 45, saves: 178 },
		commentsCount: 34,
		readingTime: 7,
		publishedAt: '2024-11-22',
		community: 'webdev'
	},
	{
		id: '38',
		title: 'Web Performance Optimization Guide',
		slug: 'web-performance-optimization-guide',
		excerpt: 'Comprehensive guide to improving your website performance.',
		content: 'Website performance directly impacts user experience...',
		coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
		tags: ['performance', 'webdev', 'optimization'],
		reactions: { hearts: 678, unicorns: 123, saves: 456 },
		commentsCount: 89,
		readingTime: 14,
		publishedAt: '2024-11-21',
		community: 'webdev'
	},
	{
		id: '39',
		title: 'Understanding JavaScript Prototypes',
		slug: 'understanding-javascript-prototypes',
		excerpt: 'Deep dive into JavaScript prototype chain and inheritance.',
		content: 'Prototypes are fundamental to JavaScript...',
		coverImage: null,
		tags: ['javascript', 'fundamentals', 'tutorial'],
		reactions: { hearts: 234, unicorns: 34, saves: 156 },
		commentsCount: 28,
		readingTime: 6,
		publishedAt: '2024-11-20',
		community: 'javascript'
	},
	{
		id: '40',
		title: 'CI/CD Pipeline Best Practices',
		slug: 'ci-cd-pipeline-best-practices',
		excerpt: 'Build reliable CI/CD pipelines for your projects.',
		content: 'Continuous integration and deployment are essential...',
		coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop',
		tags: ['cicd', 'devops', 'automation'],
		reactions: { hearts: 456, unicorns: 78, saves: 289 },
		commentsCount: 56,
		readingTime: 10,
		publishedAt: '2024-11-19',
		community: 'dev'
	},
	{
		id: '41',
		title: 'Designing for Dark Mode',
		slug: 'designing-for-dark-mode',
		excerpt: 'Best practices for implementing dark mode in your apps.',
		content: 'Dark mode has become a must-have feature...',
		coverImage: 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?w=800&h=400&fit=crop',
		tags: ['design', 'darkmode', 'css'],
		reactions: { hearts: 345, unicorns: 67, saves: 234 },
		commentsCount: 45,
		readingTime: 7,
		publishedAt: '2024-11-18',
		community: 'design'
	},
	{
		id: '42',
		title: 'Building APIs with FastAPI',
		slug: 'building-apis-with-fastapi',
		excerpt: 'Create high-performance APIs using FastAPI.',
		content: 'FastAPI is a modern Python framework...',
		coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop',
		tags: ['python', 'fastapi', 'api'],
		reactions: { hearts: 456, unicorns: 89, saves: 267 },
		commentsCount: 56,
		readingTime: 11,
		publishedAt: '2024-11-17',
		community: 'python'
	},
	{
		id: '43',
		title: 'Svelte Stores vs Runes: State Management',
		slug: 'svelte-stores-vs-runes-state-management',
		excerpt: 'Comparing Svelte stores and runes for state management.',
		content: 'State management is crucial for Svelte applications...',
		coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=400&fit=crop',
		tags: ['svelte', 'statemanagement', 'javascript'],
		reactions: { hearts: 567, unicorns: 89, saves: 345 },
		commentsCount: 78,
		readingTime: 9,
		publishedAt: '2024-11-16',
		community: 'javascript'
	},
	{
		id: '44',
		title: 'HTML Semantic Elements Guide',
		slug: 'html-semantic-elements-guide',
		excerpt: 'Using semantic HTML for better accessibility and SEO.',
		content: 'Semantic HTML improves code readability and accessibility...',
		coverImage: null,
		tags: ['html', 'accessibility', 'seo'],
		reactions: { hearts: 234, unicorns: 34, saves: 156 },
		commentsCount: 23,
		readingTime: 5,
		publishedAt: '2024-11-15',
		community: 'webdev'
	},
	{
		id: '45',
		title: 'AWS Lambda Fundamentals',
		slug: 'aws-lambda-fundamentals',
		excerpt: 'Getting started with AWS Lambda and serverless.',
		content: 'AWS Lambda enables serverless computing...',
		coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
		tags: ['aws', 'serverless', 'cloud'],
		reactions: { hearts: 345, unicorns: 56, saves: 198 },
		commentsCount: 34,
		readingTime: 10,
		publishedAt: '2024-11-14',
		community: 'dev'
	},
	{
		id: '46',
		title: 'Typography in Web Design',
		slug: 'typography-in-web-design',
		excerpt: 'Mastering typography for better web designs.',
		content: 'Typography is a crucial element of design...',
		coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
		tags: ['design', 'typography', 'css'],
		reactions: { hearts: 289, unicorns: 45, saves: 178 },
		commentsCount: 34,
		readingTime: 6,
		publishedAt: '2024-11-13',
		community: 'design'
	},
	{
		id: '47',
		title: 'Node.js Streams Explained',
		slug: 'nodejs-streams-explained',
		excerpt: 'Understanding and using Node.js streams effectively.',
		content: 'Streams are a powerful feature in Node.js...',
		coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
		tags: ['nodejs', 'streams', 'performance'],
		reactions: { hearts: 234, unicorns: 34, saves: 145 },
		commentsCount: 28,
		readingTime: 8,
		publishedAt: '2024-11-12',
		community: 'dev'
	},
	{
		id: '48',
		title: 'Python Type Hints Complete Guide',
		slug: 'python-type-hints-complete-guide',
		excerpt: 'Add type safety to your Python code with type hints.',
		content: 'Type hints make Python code more maintainable...',
		coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
		tags: ['python', 'typing', 'bestpractices'],
		reactions: { hearts: 345, unicorns: 56, saves: 198 },
		commentsCount: 45,
		readingTime: 9,
		publishedAt: '2024-11-11',
		community: 'python'
	},
	{
		id: '49',
		title: 'WebSockets vs Server-Sent Events',
		slug: 'websockets-vs-server-sent-events',
		excerpt: 'Choosing between WebSockets and SSE for real-time features.',
		content: 'Real-time communication can be achieved in multiple ways...',
		coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
		tags: ['websockets', 'sse', 'realtime'],
		reactions: { hearts: 289, unicorns: 45, saves: 167 },
		commentsCount: 34,
		readingTime: 7,
		publishedAt: '2024-11-10',
		community: 'webdev'
	},
	{
		id: '50',
		title: 'My Journey from Junior to Senior Developer',
		slug: 'journey-junior-to-senior-developer',
		excerpt: 'Lessons learned on the path to becoming a senior developer.',
		content: 'The journey from junior to senior is not just about technical skills...',
		coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
		tags: ['career', 'growth', 'advice'],
		reactions: { hearts: 1234, unicorns: 234, saves: 678 },
		commentsCount: 156,
		readingTime: 8,
		publishedAt: '2024-11-09',
		community: 'dev'
	},
	{
		id: '51',
		title: 'SwiftUI State Management with @Observable',
		slug: 'swiftui-state-management-observable',
		excerpt: 'Master modern SwiftUI state management using the @Observable macro in iOS 17+.',
		content: `SwiftUI's state management has evolved *significantly* with iOS 17. The new \`@Observable\` macro simplifies how we handle reactive state in our apps, and I'm genuinely excited to share what I've learned after migrating several production apps.

![SwiftUI Logo Animation](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd4Y2V5OWFyOGZxbWE5MnRhbHB6cWR0Y3o4NjBtZGV1Mml0bWxjYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SWoRKslHVtqEasqYCJ/giphy.gif)

> **TL;DR**: If you're still using \`ObservableObject\` with \`@Published\`, you're working too hard. The \`@Observable\` macro is simpler, more performant, and just *feels* right.

---

## Why This Matters

Before we dive in, let me share a quick story. Last month, I was debugging a **massive performance issue** in our app. Views were re-rendering constantly, and the profiler showed our \`ObservableObject\` classes were triggering updates even when unrelated properties changed.

Sound familiar? *You're not alone.*

The \`@Observable\` macro solves this by implementing **fine-grained reactivity**. Only the properties your view *actually reads* will trigger updates. This isn't just a syntactic improvement—it's a fundamental change in how SwiftUI tracks dependencies.

---

## The Old Way vs The New Way

### Before iOS 17 (The Verbose Way)

Here's what we used to write:

\`\`\`swift
// Old approach (iOS 16 and earlier)
// Notice all the boilerplate? 😩

class UserViewModel: ObservableObject {
    @Published var name: String = ""
    @Published var email: String = ""
    @Published var isLoggedIn: Bool = false
    @Published var profileImage: UIImage?
    @Published var followers: [User] = []

    // Every @Published property triggers view updates
    // even if the view doesn't use that property!
}

struct ContentView: View {
    @StateObject private var viewModel = UserViewModel()

    var body: some View {
        // This view only uses 'name'
        // But it re-renders when ANY @Published property changes 🐌
        Text(viewModel.name)
    }
}
\`\`\`

### After iOS 17 (The Clean Way)

Now look at this beauty:

\`\`\`swift
// New approach (iOS 17+)
// Clean, simple, performant ✨

@Observable
class UserModel {
    var name: String = ""
    var email: String = ""
    var isLoggedIn: Bool = false
    var profileImage: UIImage?
    var followers: [User] = []

    // SwiftUI automatically tracks which properties
    // each view actually uses!
}

struct ContentView: View {
    @State private var user = UserModel()

    var body: some View {
        // This view ONLY re-renders when 'name' changes
        // Other properties? Doesn't matter! 🚀
        Text(user.name)
    }
}
\`\`\`

> **Pro tip**: Notice we use \`@State\` instead of \`@StateObject\`. This is intentional! With \`@Observable\`, you don't need the special property wrappers anymore.

---

## Key Benefits

Let me break down why this matters:

| Feature | ObservableObject | @Observable |
|---------|------------------|-------------|
| Boilerplate | High (\`@Published\` everywhere) | Minimal |
| Performance | Coarse-grained updates | Fine-grained updates |
| Learning curve | Moderate | Easy |
| Debugging | Complex | Simple |

### 1. Automatic Tracking

Only properties that are **actually read** trigger updates. This is *huge* for performance.

### 2. Simpler Syntax

No more \`@Published\` wrappers on every single property. Your code reads like plain Swift.

### 3. Better Performance

I measured a **40% reduction** in unnecessary view updates in our production app after migrating.

---

## Creating Bindings with @Bindable

Here's where it gets interesting. When you need two-way bindings (like for forms), you use \`@Bindable\`:

\`\`\`swift
@Observable
class FormModel {
    var username: String = ""
    var password: String = ""
    var rememberMe: Bool = false

    var isValid: Bool {
        !username.isEmpty && password.count >= 8
    }
}

struct LoginForm: View {
    @State private var form = FormModel()
    @State private var showError = false

    var body: some View {
        NavigationStack {
            Form {
                // Create a bindable reference
                @Bindable var form = form

                Section("Credentials") {
                    TextField("Username", text: $form.username)
                        .textContentType(.username)
                        .autocapitalization(.none)

                    SecureField("Password", text: $form.password)
                        .textContentType(.password)
                }

                Section {
                    Toggle("Remember me", isOn: $form.rememberMe)
                }

                Section {
                    Button(action: performLogin) {
                        HStack {
                            Spacer()
                            Text("Sign In")
                                .fontWeight(.semibold)
                            Spacer()
                        }
                    }
                    .disabled(!form.isValid)
                }
            }
            .navigationTitle("Welcome Back")
        }
        .alert("Error", isPresented: $showError) {
            Button("OK") { }
        }
    }

    private func performLogin() {
        print("Logging in: \\(form.username)")
        // Handle authentication...
    }
}
\`\`\`

*Notice how clean that is?* No \`$viewModel.username\` nonsense. Just simple, readable code.

---

## Environment Injection (My Favorite Pattern)

This is where \`@Observable\` really shines. Sharing state across your entire app becomes trivial:

\`\`\`swift
@Observable
class AppState {
    var currentUser: User?
    var theme: Theme = .system
    var notifications: [Notification] = []
    var cartItems: [CartItem] = []

    // Computed properties work great!
    var isAuthenticated: Bool {
        currentUser != nil
    }

    var cartTotal: Decimal {
        cartItems.reduce(0) { $0 + $1.price }
    }

    var unreadCount: Int {
        notifications.filter { !$0.isRead }.count
    }
}

@main
struct MyApp: App {
    @State private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(appState)
        }
    }
}

// Any view can now access the app state!
struct ProfileView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        Group {
            if let user = appState.currentUser {
                VStack(spacing: 16) {
                    AsyncImage(url: user.avatarURL) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        ProgressView()
                    }
                    .frame(width: 100, height: 100)
                    .clipShape(Circle())

                    Text("Welcome, \\(user.name)!")
                        .font(.title)

                    Text(user.email)
                        .foregroundStyle(.secondary)
                }
            } else {
                ContentUnavailableView(
                    "Not Signed In",
                    systemImage: "person.crop.circle.badge.xmark",
                    description: Text("Please sign in to view your profile")
                )
            }
        }
    }
}
\`\`\`

---

## Real-World Example: Async Data Loading

Let's build something practical. Here's a complete example combining \`@Observable\` with Swift concurrency:

\`\`\`swift
@Observable
class ArticleListModel {
    // State
    var articles: [Article] = []
    var isLoading = false
    var errorMessage: String?
    var searchQuery = ""

    // Computed
    var filteredArticles: [Article] {
        guard !searchQuery.isEmpty else { return articles }
        return articles.filter {
            $0.title.localizedCaseInsensitiveContains(searchQuery)
        }
    }

    var hasError: Bool {
        errorMessage != nil
    }

    // Actions
    @MainActor
    func loadArticles() async {
        isLoading = true
        errorMessage = nil

        do {
            // Simulate network delay
            try await Task.sleep(for: .seconds(1))

            let url = URL(string: "https://api.example.com/articles")!
            let (data, response) = try await URLSession.shared.data(from: url)

            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 200 else {
                throw URLError(.badServerResponse)
            }

            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601
            articles = try decoder.decode([Article].self, from: data)

        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    @MainActor
    func refresh() async {
        articles = []
        await loadArticles()
    }
}

struct ArticleListView: View {
    @State private var model = ArticleListModel()

    var body: some View {
        NavigationStack {
            Group {
                if model.isLoading && model.articles.isEmpty {
                    ProgressView("Loading articles...")
                } else if model.hasError {
                    ContentUnavailableView {
                        Label("Error", systemImage: "exclamationmark.triangle")
                    } description: {
                        Text(model.errorMessage ?? "Unknown error")
                    } actions: {
                        Button("Try Again") {
                            Task { await model.loadArticles() }
                        }
                    }
                } else {
                    List(model.filteredArticles) { article in
                        NavigationLink(value: article) {
                            ArticleRow(article: article)
                        }
                    }
                    .refreshable {
                        await model.refresh()
                    }
                    .searchable(text: $model.searchQuery)
                }
            }
            .navigationTitle("Articles")
            .navigationDestination(for: Article.self) { article in
                ArticleDetailView(article: article)
            }
        }
        .task {
            await model.loadArticles()
        }
    }
}
\`\`\`

---

## Common Mistakes to Avoid

Before you go, let me save you some debugging time:

### ❌ Don't do this:

\`\`\`swift
// WRONG: Using @StateObject with @Observable
@StateObject private var model = SomeObservableClass()
\`\`\`

### ✅ Do this instead:

\`\`\`swift
// CORRECT: Use @State with @Observable
@State private var model = SomeObservableClass()
\`\`\`

### ❌ Don't forget @Bindable for bindings:

\`\`\`swift
// WRONG: This won't compile
TextField("Name", text: $model.name) // Error!
\`\`\`

### ✅ Create a bindable reference first:

\`\`\`swift
// CORRECT: Use @Bindable
@Bindable var model = model
TextField("Name", text: $model.name) // Works!
\`\`\`

---

## Conclusion

The \`@Observable\` macro is one of the best additions to SwiftUI since its introduction. It makes your code:

- **Cleaner** - Less boilerplate
- **Faster** - Fine-grained updates
- **Easier** - Simple mental model

If you're starting a new project or have the luxury of targeting iOS 17+, there's *no reason* not to use it. And if you're maintaining an older codebase, start migrating gradually—it's worth the effort.

**Happy coding!** 🚀

---

*Have questions? Drop them in the comments below. I read and respond to every one!*`,
		coverImage: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&h=400&fit=crop',
		tags: ['swift', 'swiftui', 'ios', 'tutorial'],
		reactions: { hearts: 892, unicorns: 156, saves: 423 },
		commentsCount: 87,
		readingTime: 15,
		publishedAt: '2024-12-29',
		community: 'dev'
	}
];

// Assign authors to articles (cycling through users)
export const articles: Article[] = articleData.map((article, index) => ({
	...article,
	author: users[index % users.length]
}));

export function getArticleBySlug(slug: string): Article | undefined {
	return articles.find((a) => a.slug === slug);
}

export function getArticlesByCommunity(communityId: string): Article[] {
	return articles.filter((a) => a.community === communityId);
}

export function getArticlesByAuthor(username: string): Article[] {
	return articles.filter((a) => a.author.username === username);
}

export function getArticlesByTag(tag: string): Article[] {
	return articles.filter((a) => a.tags.includes(tag));
}
