<svelte:options accessors />

<script>
// @ts-nocheck

    import { adminState } from "$lib/States/universalStates";

    //database calls
    import { auth } from "$lib/DB/firebaseConfig";

    export let Logic = false;
    
    let disable = true;
    export let Bindthis = "";

    const transform = {
        backgroundColor: "bg-red-600",
        title: "Post disable",

    }

    export const detectKey = () => {
        if(Bindthis.trim().length <= 1){
            disable = true;
            transform.backgroundColor = "bg-red-600";
            transform.title = "Post disable"
        }else{
            disable = false;
            transform.backgroundColor = "bg-green-700";
            transform.title = "Post"
        }
    }
    
</script>

<div class="flex flex-col items-center gap-2 ">
    <div class="w-full">
        <textarea class="w-full focus:outline-none p-2 rounded-lg bg-[#1e1e1e] text-white" placeholder="Announce something.. {$auth.currentUser?.displayName}?"
        on:keyup={detectKey}
        bind:value={Bindthis}
        />
    </div>

    <div class="flex gap-1 w-full flex-row-reverse">
        
        <button class="transition-all px-2 py-1 {transform.backgroundColor} rounded-md transition-all active:scale-95 cursor-pointer" 
        disabled={disable}
        title={transform.title}
        on:click
        >
            {#if Logic}
                <div class="flex items-center gap-1">
                    <p class="text-white font-bold">Sending</p>
                    <div class="w-4 h-4 border-4 border-b-white rounded-full transition-all animate-spin"></div>
                </div>
            {:else}
                <p class="text-white font-bold">Send</p>
            {/if}
        </button>

        <button class="transition-all px-2 py-1 bg-blue-700 rounded-md hover:opacity-50 active:scale-95 cursor-pointer" 
        title="Go Back"
        on:click={() => $adminState.commentComparison = 0.1}
        
        >
        <p class="text-white font-bold">Cancel</p>
        </button>

        
    </div>
</div>