<script lang="ts">
    import Modal from "./Modal.svelte";

    interface Props {
        title: string;
        period: string;
        content: string;
    }

    const { title, period, content }: Props = $props();
    let isModalOpen = $state(false);

    function toggleModal() {
        isModalOpen = !isModalOpen;
    }
</script>

<div
    class="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
    <div class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h3 class="text-xl font-bold">{title}</h3>
        <span class="text-sm font-medium text-blue-600 dark:text-blue-400">{period}</span>
    </div>

    <div class="relative mb-auto max-h-[80px] overflow-hidden">
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

<Modal show={isModalOpen} {title} onClose={toggleModal}>
    <p class="mb-4 text-sm font-medium text-blue-600 dark:text-blue-400">{period}</p>
    <div class="prose max-w-none prose-slate dark:prose-invert">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html content}
    </div>
</Modal>
