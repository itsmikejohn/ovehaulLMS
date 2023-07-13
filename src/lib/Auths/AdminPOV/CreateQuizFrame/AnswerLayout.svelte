<script>
    import { adminState } from "$lib/States/universalStates";
    import { scale } from "svelte/transition";
</script>

{#if $adminState.showCorrectLogic}
    <div class="fixed top-0 bottom-0 right-0 left-0 z-10 mt-[20vh] sm:mt-[10vh]">
        <div class="mx-auto sm:max-w-xs bg-green-500 mt-[15vh]" in:scale>
            <p class="text-white font-bold text-center">Correct!</p>
        </div>
    </div>
{/if}

{#if $adminState.showIncorrectLogic}
    <div class="fixed top-0 bottom-0 right-0 left-0 z-10 mt-[20vh] sm:mt-[10vh]">
        <div class="mx-auto sm:max-w-xs bg-red-500 mt-[15vh]" in:scale>
            <p class="text-white font-bold text-center">Wrong!</p>
        </div>
    </div>
{/if}