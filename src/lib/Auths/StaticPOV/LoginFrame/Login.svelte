<script>
// @ts-nocheck

    import { staticStates } from "$lib/States/universalStates";
    import { scale } from "svelte/transition";
    import Buttons from "$lib/GenCom/Buttons.svelte";
    import Inputs from "$lib/GenCom/Inputs.svelte";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { signInWithEmailAndPassword } from "firebase/auth";
	import { collection, doc, increment, updateDoc } from "firebase/firestore";

    //login handler
    let domMsg = "";
    const loginHandler = () => {
        const email = $staticStates.email.Bindthis;
        const password = $staticStates.password.Bindthis;
        $staticStates.showLoading = true;
        signInWithEmailAndPassword($auth, email, password)
        .then(userCredResponse => 
        {
            updateDoc(doc(collection($db, "registeredStudents"), userCredResponse.user.uid),{
                email: email,
                fullname: $auth.currentUser.displayName,
                password: password,
                loginCount: increment(1),
            })

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
            <p class="font-serif font-bold text-xl text-center bg-yellow-500">Login</p>
        </div>

        <Inputs Color="text-white" Type="email" Label="Email:" Placeholder=""
        bind:this={$staticStates.email}
        />

        <Inputs Color="text-white" Type="password" Label="Password:" Placeholder=""
        bind:this={$staticStates.password}
        />

        <Buttons 
        on:click={loginHandler}
        Title="Login"
        Logic={$staticStates.showLoading}
        Logic_Title="Logging."
        />


        <div class="flex flex-col gap-1">
            <button class="max-w-fit px-2 py-1 text-white font-serif transition-all hover:font-semibold active:scale-95"
            on:click={() => $staticStates.showRecover = true}
            >Forgot password?</button>
            
            <button class="max-w-fit px-2 py-1 text-white font-serif transition-all hover:font-semibold active:scale-95"
            on:click={() => $staticStates.showReg = true}
            >Register here</button>
        </div>
    </div>
</main>