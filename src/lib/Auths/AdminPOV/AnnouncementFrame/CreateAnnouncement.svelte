<script>
// @ts-nocheck

    import { adminState, staticStates } from "$lib/States/universalStates";
	import Buttons from "$lib/GenCom/Buttons.svelte";
    import { scale } from "svelte/transition";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
	import AnnouncementTnS from "./AnnouncementTnS.svelte";
	import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";

    //send announcement to db
    const sendAnnouncement = () => 
    {
        const announcement = $adminState.chatTextStore.Bindthis;
        $staticStates.showLoading = true;
        addDoc(collection($db, "announcements"), {
            createdAt: serverTimestamp(),
            photoURL: $auth.currentUser.photoURL, 
            name: $auth.currentUser.displayName,
            email: $auth.currentUser.email,
            announcement: announcement,
            commentCount: 0,
            likeCount: 0,
        })
        .then(voidResponse => 
        {
            $adminState.chatTextStore.detectKey();
            $adminState.showCreateAnnouncement = false;
            $staticStates.showLoading = false;
        })
        .catch(errorRespose => 
        {
            $staticStates.showLoading = false;
            console.log(errorRespose);
        })
    }
    
</script>

<main>
    <div class="max-w-fit">
        <Buttons 
        Title="Create Announcement"
        on:click={() => $adminState.showCreateAnnouncement = true}
        />
    </div>
    <!--Show create announcement-->
    {#if $adminState.showCreateAnnouncement}
        <submain class="fixed bottom-0 top-0 left-0 right-0  z-10" id="colorMe">
            <div class="mx-auto sm:max-w-xl border-2 mt-[10vh] p-4 flex flex-col gap-2 bg-white rounded-md" transition:scale>
                <div class="border-b-2 border-t-2 border-yellow-500 py-1">
                    <p class="bg-yellow-500 text-center font-serif text-white font-semibold">New Announcement</p>
                </div>

                <div class="flex gap-2 items-center">
                    <img src={$auth.currentUser?.photoURL} alt="loading" class="w-10 rounded-full bg-slate-700" />

                    <submain >
                        <p class="font-serif">{$auth.currentUser?.displayName}</p>
                        <p>{$auth.currentUser?.email}</p>
                    </submain>
                </div>

                <!--Create Announcement Textarea with logic functionality-->
                <AnnouncementTnS 
                bind:this={$adminState.chatTextStore}
                Logic={$staticStates.showLoading}
                on:click={sendAnnouncement}
                />


            </div>
        </submain>
    {/if}
</main>


<style>
    #colorMe{
        background-color: rgba(0, 0, 0, 0.271);
    }
</style>
