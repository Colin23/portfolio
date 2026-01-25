<script lang="ts">
    import Modal from "./Modal.svelte";

    interface Props {
        title: string;
        tech: string;
        content: string;
        github?: string;
        liveDemo?: string;
    }

    const { title, tech, content, github, liveDemo }: Props = $props();
    let isModalOpen = $state(false);

    /**
     * Toggles the visibility of the details modal.
     */
    function toggleModal() {
        isModalOpen = !isModalOpen;
    }
</script>

<div
    class="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
    <h3 class="mb-2 text-xl font-bold">{title}</h3>
    <p class="mb-4 text-sm text-gray-500 italic dark:text-zinc-400">{tech}</p>

    <div class="relative mb-auto max-h-[80px] overflow-hidden">
        <div class="prose prose-sm max-w-none dark:prose-invert prose-h1:hidden prose-h2:hidden">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html content}
        </div>
        <div class="absolute bottom-0 h-8 w-full bg-gradient-to-t from-white to-transparent dark:from-zinc-900/50">
        </div>
    </div>

    <div class="mt-4 flex min-h-[1.5rem] flex-wrap items-center gap-4">
        {#if github}
            <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">GitHub</a>
        {/if}
        {#if liveDemo}
            <a
                href={liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">Live Demo</a>
        {/if}
        <button
            onclick={toggleModal}
            class="ml-auto text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            Details
        </button>
    </div>
</div>

<Modal show={isModalOpen} {title} onClose={toggleModal}>
    <p class="mb-4 text-sm text-gray-500 italic dark:text-zinc-400">{tech}</p>
    <div class="prose max-w-none prose-slate dark:prose-invert">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html content}
    </div>
    <div class="mt-8 flex gap-4">
        {#if github}
            <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >GitHub</a>
        {/if}
        {#if liveDemo}
            <a
                href={liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >Live Demo</a>
        {/if}
    </div>
</Modal>
