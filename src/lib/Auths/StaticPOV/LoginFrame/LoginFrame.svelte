<script>
    import { staticStates } from "$lib/States/universalStates";
	import Login from "./Login.svelte";
	import PassReset from "./PassReset.svelte";
	import Register from "./Register.svelte";


</script>

<main>
    {#if $staticStates.showReg}
        <Register />
    {:else if $staticStates.showRecover}
        <PassReset />
    {:else}
        <Login />
    {/if}
</main>