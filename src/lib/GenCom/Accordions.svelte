
<svelte:options accessors />

<script>
    // @ts-nocheck

    export let Logic = false;
    export let Title = "Sample";
    export let Bindthis = "Sample Bind";
    export let Array_data = ["Male", "Female"];

    const transform = {
        showMenu: false,
        rotator: "rotate-45",

    }

    const showMenu = () => 
    {
        transform.showMenu = !transform.showMenu;
        transform.showMenu ?  transform.rotator = "rotate-[225deg]" : transform.rotator = "rotate-45";

    }

    const selectHandler = selectedData => 
    {
        Title = selectedData;
        Bindthis = selectedData;
        showMenu();
    }


</script>

<button class="bg-slate-200 w-full px-2 py-1 flex items-center"
on:click={showMenu}
>
    <div class="w-full text-left">
        {#if Logic} {Title} {:else} {Bindthis} {/if}
    </div>

    <div class="">
        <div class="transition-all w-2 h-2 border-b-2 border-r-2 border-black {transform.rotator}"></div>
    </div>

</button>

{#if transform.showMenu}
<div class="">
    {#each Array_data as selection}
    <button class="transition-all w-full px-2 py-1 text-left bg-slate-200 hover:opacity-50 hover:font-semibold active:scale-95"
    on:click={() => selectHandler(selection)}
    >
        {selection}
    </button>
    {/each}
</div>
{/if}