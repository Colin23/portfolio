<script lang="ts">
    import { onMount, type Snippet } from "svelte";

    interface Props {
        show: boolean;
        title: string;
        onClose: () => void;
        children: Snippet;
    }

    const { show, title, onClose, children }: Props = $props();

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            onClose();
        }
    }

    onMount(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    });

    $effect(() => {
        document.body.style.overflow = show ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    });
</script>

{#if show}
    <!-- Backdrop -->
    <!-- eslint-disable-next-line svelte/valid-compile -->
    <div
        class="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm"
        onclick={onClose}
        onkeydown={handleKeydown}
        role="button"
        tabindex="0">
        <!-- Modal Content -->
        <!-- eslint-disable-next-line svelte/valid-compile -->
        <div
            class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            onclick={e => e.stopPropagation()}
            onkeydown={e => e.stopPropagation()}
            role="presentation">
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold">{title}</h2>
                <button
                    onclick={onClose}
                    class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    aria-label="Close Modal">
                    <span class="text-2xl">✕</span>
                </button>
            </div>
            <div class="prose max-w-none prose-slate dark:prose-invert">
                {@render children()}
            </div>
        </div>
    </div>
{/if}
