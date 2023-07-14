<script>
// @ts-nocheck

    import { staticStates } from "$lib/States/universalStates";
    import { fly } from "svelte/transition";
    import Buttons from "$lib/GenCom/Buttons.svelte";

    //database calls
    import { auth } from "$lib/DB/firebaseConfig";
	import { signOut } from "firebase/auth";

    export let Array_data = ["Firebase", "SvelteKit", "Easy WebDev"];
    let sliderLogic = false;

    const showSlider = () => {
        sliderLogic = !sliderLogic;
    }

    const selectionHandler = selectedData => {
        $staticStates.activeItem = selectedData;
        showSlider();
    }


</script>

<main class="fixed w-full left-0 top-0 bg-[#3c3965] p-2 flex items-center">
    <div class="">
        <button class="transition-all flex flex-col gap-1 p-2 rounded-full hover:bg-blue-500"
        on:click={showSlider}
        >
            <div class="w-6 border-[0.01rem] border-white"></div>
            <div class="w-6 border-[0.01rem] border-white"></div>
            <div class="w-6 border-[0.01rem] border-white"></div>
        </button>
    </div>
    <div class="w-full">
        <p class="text-white font-serif text-left ml-5">{$staticStates.activeItem}</p>
    </div>

    <div class="w-full ">
        <div class="mr-5 max-w-fit float-right">
            <Buttons 
            Color="bg-red-500"
            Title="Logout"
            on:click={() => signOut($auth)}
            />
        </div>
    </div>
</main>

{#if sliderLogic}
    <main class="fixed left-0 top-0 bottom-0 w-[70%] sm:w-[30%] md:w-[20%] bg-[#3c3965]" in:fly={{x:-100, duration:700}}>
        <div class="p-2">
            <button class="transition-all flex flex-col gap-1 px-2 py-4 rounded-full hover:bg-blue-500 float-right"
            on:click={showSlider}
            >
            <div class="w-6 border-[0.01rem] border-white rotate-45 absolute"></div>
            <div class="w-6 border-[0.01rem] border-white rotate-[-45deg]"></div>
            </button>
        </div>

        <div class="flex gap-2 items-center p-2 border-2 mt-10 mx-2 flex-wrap">
            <img src={$auth.currentUser?.photoURL} alt="loading" class="w-10"/>
            <div class="text-white font-serif">
                <p>{$auth.currentUser?.displayName}</p>
                <p>{$auth.currentUser?.email}</p>
            </div>
        </div>

        <div class="mt-10">
            {#each Array_data as selection}
                <button class="transition-all font-serif w-full text-xl text-left px-2 py-1 text-white hover:font-semibold hover:bg-slate-200 hover:text-black active:scale-95"
                class:active={$staticStates.activeItem === selection}
                on:click={() => selectionHandler(selection)}
                >
                    {selection}
                </button>
            {/each}
        </div>
    </main>
{/if}

<style>
    .active{
        background-color: rgba(0, 0, 0, 0.281);
    }
</style>