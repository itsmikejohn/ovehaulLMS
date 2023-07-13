
<svelte:options accessors />

<script>
    // @ts-nocheck
    export let Bindthis = "Select";
    export let numericAnswer = 0;
    export let Array_data = ["Selection One", "Selection Two", "Selection Three", "Selection Four"];

    const transform = {
        showMenu: false,
        rotator: "rotate-45",

    }

    const showMenu = () => 
    {
        transform.showMenu = !transform.showMenu;
        transform.showMenu ?  transform.rotator = "rotate-[225deg]" : transform.rotator = "rotate-45";

    }

    const selectHandler = (selectedData, index) => 
    {
        numericAnswer = index;
        Bindthis = selectedData;
        showMenu();
    }


</script>
<main>
    <p class="font-serif font-semibold py-1">Correct Answer: </p>
    <button class="bg-slate-200 w-full px-2 py-1 flex items-center text-left"
    on:click={showMenu}
    >
        <p class="w-full font-serif font-semibold">{Bindthis}</p>

        <div class="">
            <div class="transition-all w-2 h-2 border-b-2 border-r-2 border-black {transform.rotator}"></div>
        </div>

    </button>
</main>

{#if transform.showMenu}
<div class="">
    {#each Array_data as selection, index}
    <button class="transition-all w-full px-2 py-1 text-left bg-slate-200 hover:opacity-50 hover:font-semibold active:scale-95"
    on:click={() => selectHandler(selection, index)}
    >
        {selection}
    </button>
    {/each}
</div>
{/if}