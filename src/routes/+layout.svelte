<script lang="ts">
    import "../app.css";
    const { children } = $props();
</script>

<div
    class="flex min-h-screen flex-col bg-white font-sans text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100">
    <header class="border-b border-gray-200 dark:border-gray-800 print:hidden">
        <nav class="mx-auto flex max-w-5xl items-center justify-between p-4">
            <a href="/" class="text-xl font-bold">Portfolio</a>
            <div class="space-x-4">
                <a href="/cv" class="hover:text-blue-600 dark:hover:text-blue-400">CV</a>
            </div>
        </nav>
    </header>

    <main class="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
        {@render children()}
    </main>

    <footer class="border-t border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-800 print:hidden">
        <p>© {new Date().getFullYear()} Colin Mörbe</p>
    </footer>
</div>
