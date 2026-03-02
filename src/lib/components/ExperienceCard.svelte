<script lang="ts">
    import Modal from "./Modal.svelte";

    interface Props {
        title: string;
        period: string;
        role?: string;
        content: string;
    }

    const { title, period, role = "", content }: Props = $props();
    let isModalOpen = $state(false);

    /**
     * Toggles the visibility of the details modal.
     */
    function toggleModal(): void {
        isModalOpen = !isModalOpen;
    }
</script>

<div
    class="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
    <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{period}</p>
    <h3 class="mt-2 text-base font-medium text-gray-700 dark:text-zinc-300">{title}</h3>
    {#if role}
        <p class="mt-1 text-base font-medium text-gray-700 dark:text-zinc-300">{role}</p>
    {/if}

    <div class="relative mt-4 mb-auto max-h-20 overflow-hidden">
        <div class="prose prose-sm max-w-none dark:prose-invert">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html content}
        </div>
        <div class="absolute bottom-0 h-8 w-full bg-gradient-to-t from-white to-transparent dark:from-zinc-900/50">
        </div>
    </div>

    <div class="mt-4 flex justify-end">
        <button
            onclick={toggleModal}
            class="text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            Details
        </button>
    </div>
</div>

<Modal show={isModalOpen} title={period} onClose={toggleModal}>
    <p class="text-base font-medium text-gray-700 dark:text-zinc-300">{title}</p>
    {#if role}
        <p class="mt-1 text-base font-medium text-gray-700 dark:text-zinc-300">{role}</p>
    {/if}
    <div class="prose mt-4 max-w-none prose-slate dark:prose-invert">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html content}
    </div>
</Modal>
