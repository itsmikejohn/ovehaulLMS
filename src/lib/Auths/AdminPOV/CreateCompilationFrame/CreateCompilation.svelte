<script>
// @ts-nocheck

    import { adminState, staticStates } from "$lib/States/universalStates";

    import { scale } from "svelte/transition";
    import Buttons from "$lib/GenCom/Buttons.svelte";
	import Inputs from "$lib/GenCom/Inputs.svelte";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { addDoc, collection, serverTimestamp } from "firebase/firestore";

    //create handler
    const createHandler = () =>
    {
        const description = $adminState.linkDescription.Bindthis;
        const linkTitle = $adminState.linkTitle.Bindthis;
        const linkSrc = $adminState.linkSrc.Bindthis;
        
        $staticStates.showLoading = true;
        addDoc(collection($db, "createdLinks"), {
            createdAt: serverTimestamp(),
            name: $auth.currentUser.displayName,
            ownerPhotoURL: $auth.currentUser.photoURL,
            ownerUID: $auth.currentUser.uid,
            description: description,
            linkTitle: linkTitle,
            linkSrc: linkSrc,
        })
        .then(voidResp => 
        {
            $staticStates.showLoading = false;
            $adminState.showRepoLogic = false;
        })
        .catch(errorResp =>
        {
            $staticStates.showLoading = false;
            console.log(errorResp.code);
            
        })
    }
</script>

<main>
    <div class="max-w-fit">
        <Buttons Title="Create Link" on:click={() => $adminState.showRepoLogic = true}/>
    </div>

    {#if $adminState.showRepoLogic}
        <main class="fixed bottom-0 top-0 left-0 right-0  z-10" id="colorMe">
            <div class="mx-auto sm:max-w-xl border-2 mt-[10vh] p-4 flex flex-col gap-2 bg-white rounded-md" transition:scale>
                <div class="border-b-2 border-t-2 border-yellow-500 py-1">
                    <p class="bg-yellow-500 text-center font-serif text-white font-semibold">Create Link Repository</p>
                </div>

                <submain>
                    <Inputs Label="Extra Description:" Placeholder="Ex, this google link contains google link"
                    bind:this={$adminState.linkDescription}
                    />
                    <Inputs Label="Link Title:" Placeholder="This is the google link"
                    bind:this={$adminState.linkTitle}
                    />
                    <Inputs Label="Link Source:" Placeholder="Ex, https://www.google.com"
                    bind:this={$adminState.linkSrc}
                    />
                </submain>

                <submain class="flex gap-1">
                    <Buttons Title="Create"
                    Logic={$staticStates.showLoading}
                    Logic_Title="Creating."
                    on:click={createHandler}
                    />
                    <Buttons Title="Cancel" on:click={() => $adminState.showRepoLogic = false}/>
                </submain>
            </div>
        </main>
    {/if}
</main>