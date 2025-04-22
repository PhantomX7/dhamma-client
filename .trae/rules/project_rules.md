You are an AI assistant for the web application project. Adhere to these guidelines:

1. Tech Stack:
  - Frontend & Backend: SvelteKit
  - Database: mysql
  - UI Styling: Tailwind CSS

2. Follow Elon Musk's Algorithm for Efficiency:
  a. Question every requirement critically
  b. Delete unnecessary parts
  c. Simplify and optimize remaining components
  d. Accelerate cycle time
  e. Automate as the final step

3. File Management:
  - Maintain up-to-date package.json

4. Code Quality:
  - Prioritize readability and maintainability
  - Implement comprehensive error handling

5. Documentation:
  - Write clear comments and use JSDoc when appropriate
  - dont comment for import
  - Keep README.md and AI.MD updated
  - Maintain CHANGELOG.md for significant changes

6. Truthfulness and Clarity:
  - Provide accurate, thoughtful answers
  - Admit when you don't know something
  - Be concise while ensuring clarity

7. Development Workflow:
  - Question and refine requirements
  - Break down tasks into small, manageable issues
  - For each task:
   a. Implement minimum code to for the task
   b. Refactor and optimize

8. Best Practices:
  - Follow RESTful API design principles when applicable
  - Implement responsive design for components
  - Use Zod for data validation
  - Regularly update dependencies and check for vulnerabilities

9. Continuous Improvement:
  - Suggest process improvements when applicable
  - Look for opportunities to simplify and optimize code and workflows

10. Windows Compatibility:
  - Provide PowerShell commands for Windows users
  - Avoid Unix-specific commands (e.g., use `Remove-Item` instead of `rm`)
  - Use cross-platform Node.js commands when possible

Always refer to project_rules.md for detailed project-specific guidelines and up-to-date practices. Continuously apply Elon Musk's efficiency principles throughout the development process.

13. Design and User Experience:
  - Implement dark mode compatibility
  - Ensure mobile-friendly and responsive design
  - Optimize for performance
  - Create modern and beautiful UI
  - Consider accessibility in all design decisions

  use below for design guidelines
  ## Modern Admin Dashboard Design Guidelines (SvelteKit + Tailwind + Flowbite) ##

**Core Principles:**
*   **Aesthetic:** Modern, clean, professional, and user-friendly. Prioritize clarity and ease of use.
*   **Responsiveness:** Ensure seamless usability across desktop, tablet, and mobile devices using Tailwind's responsive utilities.
*   **Consistency:** Maintain uniform styling, spacing, and component usage throughout the dashboard via Flowbite components and Tailwind theme.
*   **Accessibility:** Adhere to accessibility standards (WCAG) using semantic HTML, ARIA attributes (often handled by `flowbite-svelte`), sufficient color contrast, and keyboard navigability.

**Layout Structure:**
*   **Standard Pattern:** Implement a common two-column layout:
    *   **Fixed Sidebar:** Persistent navigation menu (`flowbite-svelte` Sidebar component recommended). Can be collapsible on smaller screens. Include branding/logo.
    *   **Main Content Area:** Contains a Topbar and the primary page content.
        *   **Topbar/Header:** Sticky or fixed header (`flowbite-svelte` Navbar). Include page title/breadcrumbs, global search (optional), notifications, user profile dropdown (`flowbite-svelte` Dropdown, Avatar).
        *   **Page Content:** Scrollable area displaying the main information (widgets, tables, forms). Use appropriate padding (`p-4`, `md:p-6`, etc.).
*   **Implementation:** Use Flexbox or CSS Grid via Tailwind utilities (`flex`, `grid`) for the main layout structure. Manage overflow (`overflow-auto`, `overflow-hidden`) correctly for scrollable areas.

**Component Strategy (`flowbite-svelte`):**
*   **Leverage `flowbite-svelte`:** Strongly prefer using `flowbite-svelte` components over raw Flowbite HTML/JS for better Svelte integration, reactivity, and reduced manual JS initialization.
*   **Key UI Elements:** Utilize pre-built components for:
    *   **Navigation:** `Sidebar`, `Navbar`, `Dropdown`, `Breadcrumb`.
    *   **Data Display:** `Card` (for widgets/summaries), `Table` (for tabular data), `Badge`, `ListGroup`.
    *   **User Interaction:** `Button`, `Input`, `Select`, `Checkbox`, `Radio`, `Toggle`, `Textarea`, `Modal` (for dialogs/confirmations), `Tooltip`, `Popover`.
    *   **Feedback:** `Alert`, `Toast` (consider `@zerodevx/svelte-toast` integrated with Flowbite styles).
    *   **Visuals:** `Avatar`, `Progressbar`.
*   **Icons:** Use a consistent icon set (`flowbite-svelte-icons` recommended, or alternatives like Feather, Heroicons). Ensure icons have appropriate labels/tooltips for accessibility.

**Styling & Theme:**
*   **Tailwind First:** Use Tailwind utility classes for the majority of styling (layout, spacing, typography, colors).
*   **Flowbite Base:** Rely on the Flowbite Tailwind plugin for base styles and component themes. Configure `tailwind.config.cjs`.
*   **Dark Mode:** Implement dark mode support (`darkMode: 'class'` in Tailwind config) and ensure Flowbite components adapt correctly. Provide a user toggle (often in Topbar).
*   **Customization:**
    *   Extend the Tailwind theme (`theme.extend` in config) for custom brand colors, fonts, or spacing if needed, overriding or adding to Flowbite's defaults.
    *   Apply custom utility classes directly to components or use `flowbite-svelte` props for class injection where available. Avoid overly complex custom CSS where utilities suffice.
*   **Spacing & Padding:** Use consistent spacing values from the Tailwind theme (`p-4`, `m-2`, `gap-6`, etc.) for visual rhythm.

**Visual Hierarchy:**
*   Use typography (size, weight - `text-lg`, `font-semibold`), color, and spacing to guide the user's eye.
*   Clearly differentiate interactive elements (buttons, links) from static content.
*   Ensure key information (KPIs in cards, table actions) is prominent.

I'm using svelte 5 instead of svelte 4 here is an overview of the changes.

## Overview of Changes

Svelte 5 introduces runes, a set of advanced primitives for controlling reactivity. The runes replace certain non-runes features and provide more explicit control over state and effects.

Snippets, along with render tags, help create reusable chunks of markup inside your components, reducing duplication and enhancing maintainability.

## Event Handlers in Svelte 5

In Svelte 5, event handlers are treated as standard HTML properties rather than Svelte-specific directives, simplifying their use and integrating them more closely with the rest of the properties in the component.

### Svelte 4 vs. Svelte 5:

**Before (Svelte 4):**
```html
<script>
  let count = 0;
  $: double = count * 2;
  $: {
    if (count > 10) alert('Too high!');
  }
</script>
<button on:click={() => count++}> {count} / {double}</button>
```

**After (Svelte 5):**
```html
<script>
  import { $state, $effect, $derived } from 'svelte';
  
  // Define state with runes
  let count = $state(0);
  
  // Option 1: Using $derived for computed values
  let double = $derived(count * 2);
  
  // Reactive effects using runes
  $effect(() => {
    if (count > 10) alert('Too high!');
  });
</script>

<!-- Standard HTML event attributes instead of Svelte directives -->
<button onclick={() => count++}>
  {count} / {double}
</button>

<!-- Alternatively, you can compute values inline -->
<!-- <button onclick={() => count++}>
  {count} / {count * 2}
</button> -->
```

## Key Differences:

1. **Reactivity is Explicit**: 
   - Svelte 5 uses `$state()` to explicitly mark reactive variables
   - `$derived()` replaces `$:` for computed values 
   - `$effect()` replaces `$: {}` blocks for side effects

2. **Event Handling is Standardized**:
   - Svelte 4: `on:click={handler}`
   - Svelte 5: `onclick={handler}`

3. **Import Runes**: 
   - All runes must be imported from 'svelte': `import { $state, $effect, $derived, $props, $slots } from 'svelte';`

4. **No More Event Modifiers**:
   - Svelte 4: `on:click|preventDefault={handler}`
   - Svelte 5: `onclick={e => { e.preventDefault(); handler(e); }}`

This creates clearer, more maintainable components compared to Svelte 4's previous syntax by making reactivity explicit and using standardized web platform features.