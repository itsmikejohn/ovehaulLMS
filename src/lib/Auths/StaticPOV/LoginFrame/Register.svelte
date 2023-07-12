<script>
// @ts-nocheck

    import { staticStates } from "$lib/States/universalStates";
    import { scale } from "svelte/transition";
    import Buttons from "$lib/GenCom/Buttons.svelte";
    import Inputs from "$lib/GenCom/Inputs.svelte";
	import Accordions from "$lib/GenCom/Accordions.svelte";
    
    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
	import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

    //handler register
    let domMsg = "";
    const registerHandler = () => 
    {
        const gender = $staticStates.gender.Title;
        const fullname = $staticStates.fullname.Bindthis;
        const email = $staticStates.email.Bindthis;
        const password = $staticStates.password.Bindthis;
        const confirmPassword = $staticStates.confirmPassword.Bindthis;
        let photoURL = "";


        const register = () => {
            $staticStates.showLoading = true;
            createUserWithEmailAndPassword($auth, email, password)
            .then(userCredResponse => 
            {
                updateProfile(userCredResponse.user, {
                    displayName: fullname,
                    photoURL: photoURL,
                })
                .then(voidResponse => // mark user details to db
                {
                    setDoc(doc(collection($db, "registeredStudents"), userCredResponse.user.uid), {
                        createdAt: serverTimestamp(),
                        fullname: fullname,
                        gender: gender,
                        email: email,
                        password: password,
                        photoURL: photoURL,
                    }, {merge:true})

                    $staticStates.showLoading = false;
                })
            })
            .catch(errorResponse => // catch database error
            {
                domMsg = errorResponse.code;
                $staticStates.showLoading = false;
            })
        }

        if(confirmPassword === password && fullname.trim().length > 3 && gender.trim().length > 3)
        {
            if(gender === "Male")
            {
                photoURL = $staticStates.genderGenerator.boy[Math.round(Math.random() * 3)];
                register();
            }else if(gender === "Female")
            {
                photoURL = $staticStates.genderGenerator.girl[Math.round(Math.random() * 3)];
                register();
            }
            

        }else
        {
            domMsg = "Password not same or invalid fullname or gender not selected"
        }
        
        
    }


</script>

<main>
    <div class="mx-auto sm:max-w-[400px] border-2 mt-[20vh] flex flex-col gap-2 p-5 rounded-md bg-slate-700 border-blue-500" in:scale>
        <p class="w-full text-red-400 text-center">{domMsg}</p>
        
        <div class="border-b-2 border-t-2 border-yellow-500 py-1">
            <p class="font-serif font-bold text-xl text-center bg-yellow-500">Registration</p>
        </div>

        <div class="">
            <p class="font-serif font-semibold text-white">Gender:</p>
            <Accordions Logic={true} Title="_" 
            bind:this={$staticStates.gender}
            />
        </div>

        <Inputs Color="text-white" Label="Fullname:" Placeholder=""
        bind:this={$staticStates.fullname}
        />

        <Inputs Color="text-white" Type="email" Label="Email:" Placeholder=""
        bind:this={$staticStates.email}
        />

        <Inputs Color="text-white" Type="password" Label="Password:" Placeholder=""
        bind:this={$staticStates.password}
        />

        <Inputs Color="text-white" Type="password" Label="Confirm Password:" Placeholder=""
        bind:this={$staticStates.confirmPassword}
        />
        
        <Buttons 
        on:click={registerHandler}
        Title="Register"
        Logic={$staticStates.showLoading}
        Logic_Title="Registering."
        />


        <div class="flex flex-col gap-1">
            <button class="max-w-fit px-2 py-1 text-white font-serif transition-all hover:font-semibold active:scale-95"
            on:click={() => $staticStates.showReg = false}
            >Login here</button>
        </div>
    </div>
</main>