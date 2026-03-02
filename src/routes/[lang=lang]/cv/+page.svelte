<script lang="ts">
    import CvPage from "../../cv/+page.svelte";

    const { data } = $props();
</script>

<CvPage {data} />
