<svelte:options accessors />

<script>
// @ts-nocheck

    import { auth } from "$lib/DB/firebaseConfig";
    import send from "$lib/Images/send.svg";

    export let Logic = false;
    
    let disable = true;
    export let Bindthis = "";

    const transform = {
        backgroundColor: "bg-red-600",
        title: "Send disable",

    }

    export const detectKey = () => {
        if(Bindthis.trim().length <= 1){
            disable = true;
            transform.backgroundColor = "bg-red-600";
            transform.title = "Send disable"
        }else{
            disable = false;
            transform.backgroundColor = "bg-green-500";
            transform.title = "Send"
        }
    }
    
</script>

<div class="flex items-center gap-2 ">
    <div class="w-full">
        <textarea class="w-full focus:outline-none p-2 rounded-lg bg-[#1e1e1e] text-white" placeholder="Say something.. {$auth.currentUser?.displayName}"
        on:keyup={detectKey}
        bind:value={Bindthis}
        />
    </div>

    <div class="">
        <button class="transition-all p-2 {transform.backgroundColor} rounded-full transition-all active:scale-95 cursor-pointer" 
        disabled={disable}
        title={transform.title}

        on:click
        >
            {#if Logic}
                <div class="w-4 h-4 border-4 border-b-white rounded-full transition-all animate-spin"></div>
            {:else}
            <img src={send} alt="loading" class="w-8" />
            {/if}
        </button>
    </div>
</div>