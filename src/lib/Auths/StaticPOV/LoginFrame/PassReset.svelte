<script>
// @ts-nocheck

    import { staticStates } from "$lib/States/universalStates";
    import { scale } from "svelte/transition";
    import Buttons from "$lib/GenCom/Buttons.svelte";
    import Inputs from "$lib/GenCom/Inputs.svelte";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { sendPasswordResetEmail } from "firebase/auth";

    //handler password recovery
    let domMsg = "";
    const resetpassHandler = () => 
    {   
        const email = $staticStates.email.Bindthis;
        $staticStates.showLoading = true;
        sendPasswordResetEmail($auth, email)
        .then(voidResponse => 
        {
            domMsg = `Success! an email password reset has sent to ${email} kindly check your email.`;
            $staticStates.showLoading = false;
        })
        .catch(errorResponse => 
        {
            domMsg = errorResponse.code;
            $staticStates.showLoading = false;
        })
    }
</script>

<main>
    <div class="mx-auto sm:max-w-[400px] border-2 mt-[20vh] flex flex-col gap-2 p-5 rounded-md bg-slate-700 border-blue-500" in:scale>
        <p class="w-full text-red-400 text-center">{domMsg}</p>
        
        <div class="border-b-2 border-t-2 border-yellow-500 py-1">
            <p class="font-serif font-bold text-xl text-center bg-yellow-500">Password Recovery</p>
        </div>
        <Inputs Color="text-white" Type="email" Label="Email:" Placeholder=""
        bind:this={$staticStates.email}
        />
 
        <Buttons 
        on:click={resetpassHandler}
        Title="Send Reset"
        Logic={$staticStates.showLoading}
        Logic_Title="Sending."
        />


        <div class="flex flex-col gap-1">
            <button class="max-w-fit px-2 py-1 text-white font-serif transition-all hover:font-semibold active:scale-95"
            on:click={() => $staticStates.showRecover = false}
            >Login here</button>
        </div>
    </div>
</main>