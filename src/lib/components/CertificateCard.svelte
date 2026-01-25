<script lang="ts">
    interface Props {
        title: string;
        info: string;
        link?: string;
    }

    const { title, info, link }: Props = $props();
</script>

<div
    class="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
    <div>
        <h3 class="mb-2 text-lg font-bold">{title}</h3>
        <p class="text-sm text-gray-500 italic dark:text-zinc-400">{info}</p>
    </div>
    {#if link}
        <div class="mt-4">
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                View Certificate
            </a>
        </div>
    {/if}
</div>
