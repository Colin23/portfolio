<script lang="ts">
    import { type Snippet } from "svelte";
    import { browser } from "$app/environment";

    interface Props {
        show: boolean;
        title: string;
        onClose: () => void;
        children: Snippet;
    }

    const { show, title, onClose, children }: Props = $props();

    let modalEl: HTMLDivElement | undefined = $state(undefined);
    let previousBodyOverflow = $state<string | null>(null);
    let previousBodyPaddingRight = $state<string | null>(null);

    // Move the modal element to the body when it appears (portal pattern).
    // This intentionally manipulates the DOM to avoid clipping/stacking issues in nested containers
    // and to ensure consistent fullscreen backdrop/scroll locking behavior.
    $effect(() => {
        if (!browser || !modalEl) return;
        document.body.appendChild(modalEl);
        return () => {
            // eslint-disable-next-line svelte/no-dom-manipulating
            modalEl?.remove();
        };
    });

    // Only listen for Escape when modal is shown
    $effect(() => {
        if (!show) return;

        const handleEscape = (e: KeyboardEvent): void => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return (): void => window.removeEventListener("keydown", handleEscape);
    });

    $effect(() => {
        if (!browser) return;
        if (show) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            previousBodyOverflow = document.body.style.overflow;
            previousBodyPaddingRight = document.body.style.paddingRight;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = previousBodyOverflow ?? "";
            document.body.style.paddingRight = previousBodyPaddingRight ?? "";
        }
        return (): void => {
            document.body.style.overflow = previousBodyOverflow ?? "";
            document.body.style.paddingRight = previousBodyPaddingRight ?? "";
        };
    });
</script>

{#if show}
    <div bind:this={modalEl}>
        <!-- Backdrop -->
        <div
            class="fixed inset-0 z-60 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm"
            onclick={onClose}
            onkeydown={e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClose();
                }
            }}
            role="button"
            tabindex="0">
            <!-- Modal Content -->
            <div
                class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-100 bg-white p-8 text-gray-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                onclick={e => e.stopPropagation()}
                role="presentation">
                <div class="mb-6 flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-zinc-100">{title}</h2>
                    <button
                        onclick={onClose}
                        class="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        aria-label="Close Modal">
                        <span class="text-2xl">✕</span>
                    </button>
                </div>
                <div class="prose max-w-none prose-slate dark:prose-invert">
                    {@render children()}
                </div>
            </div>
        </div>
    </div>
{/if}
