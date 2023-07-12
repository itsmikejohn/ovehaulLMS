<script>
    export let Title = "Btn";
    export let Logic = false;
    export let Logic_Title = "Btn loading";
    export let Color = "bg-blue-700";
</script>

<button class="{Color} w-full px-2 py-1 text-white font-serif transition-all hover:opacity-50 active:scale-95 rounded-md"
on:click
>
    {#if Logic}
        <div class="flex gap-1 items-center justify-center">
            <p>{Logic_Title}</p>
            <div class="w-4 h-4 border-2 border-slate-700 border-b-white rounded-full animate-spin"></div>
        </div>
    {:else}
        <p>{Title}</p>
    {/if}
</button>