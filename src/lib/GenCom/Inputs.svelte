
<svelte:options accessors />

<script>
    export let Label = "Label";
    export let Bindthis = "";
    export let Type ="text";
    export let Placeholder = "Placeholer";
    export let Color = "text-black";

</script>

{#if Type === "text"}
    <p class="">
        <b class="font-serif {Color}">{Label}</b>
        <input type="text" placeholder={Placeholder} bind:value={Bindthis} class="w-full px-2 py-1 bg-slate-200 focus:outline-none" />
    </p>
{:else if Type === "email"}
    <p class="">
        <b class="font-serif {Color}">{Label}</b>
        <input type="text" placeholder={Placeholder} bind:value={Bindthis} class="w-full px-2 py-1 bg-slate-200 focus:outline-none" />
    </p>
{:else if Type === "password"}
    <p class="">
        <b class="font-serif {Color}">{Label}</b>
        <input type="password" placeholder={Placeholder} bind:value={Bindthis} class="w-full px-2 py-1 bg-slate-200 focus:outline-none" />
    </p>
{:else if Type === "number"}
    <p class="">
        <b class="font-serif {Color}">{Label}</b>
        <input type="number" placeholder={Placeholder} bind:value={Bindthis} class="w-full px-2 py-1 bg-slate-200 focus:outline-none" />
    </p>
{/if}
