<script>
// @ts-nocheck
    import { adminState, staticStates, adminKey } from "$lib/States/universalStates";
    import { scale } from "svelte/transition";
	import CommentTnS from "./CommentTnS.svelte";

    //database calls
    import { auth,db } from "$lib/DB/firebaseConfig";
	import { addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, updateDoc, doc, increment, deleteDoc } from "firebase/firestore";

    export let announcement;
    
    

    //fetch comments from announcementComments
    onSnapshot(query(collection($db, "announcementComments"), orderBy("createdAt", "desc")), snapsResponse => 
    {   
        let fbData = [];
        snapsResponse.docs.forEach(doc => 
        {
            let mutatedDate = new Date(Number(JSON.stringify(doc.data().createdAt).slice(11,21)) * 1000);
            let date = mutatedDate.toLocaleTimeString() + " " + mutatedDate.toDateString();
            let data = {...doc.data(), id: doc.id, date: date }
            fbData = [data, ...fbData];
        })
        $adminState.commentsArray = fbData;
    })

    //send comment to specific announcement
    const sendComment = () => 
    {
        const announceComment = $adminState.commentTextStore.Bindthis;
        $staticStates.showLoading = true;
        
        addDoc(collection($db, "announcementComments"), {
            createdAt: serverTimestamp(),
            targetUID: announcement.id,
            ownerUID: $auth.currentUser.uid,
            photoURL: $auth.currentUser.photoURL,
            name: $auth.currentUser.displayName,
            email: $auth.currentUser.email,
            announceComment: announceComment,
        })
        .then(voidResponse => 
        {
            updateDoc(doc(collection($db, "announcements"), announcement.id),{
                commentCount: increment(1),
            })
            .then(voidInnerResponse => 
            {
                $adminState.commentTextStore.Bindthis = "";
                $adminState.commentTextStore.detectKey();
                $staticStates.showLoading = false;
            })
        })
        .catch(errorResponse => 
        {
            $staticStates.showLoading = false;
            console.log(errorResponse.code);
        })
    }

    //remove comment 
    const deleteCommentHandler = comment => 
    {
        deleteDoc(doc(collection($db, "announcementComments"), comment.id))
        .then(voidRes => 
        {
            updateDoc(doc(collection($db, "announcements"), announcement.id),{
                commentCount: increment(-1),
            })
        })
    }

</script>

<main class="fixed top-0 bottom-0 left-0 right-0 bg-white z-10 p-2 sm:p-0" id="colorMe">
    <div class="mx-auto max-w-xl border-2 bg-slate-200 min-h-[20vh] mt-[7vh] p-2" transition:scale>
        <submain class="flex flex-col gap-2">
            <div class="border-b-2 border-t-2 border-yellow-500 py-1">
                <p class="px-2 bg-yellow-500 text-white text-center">{announcement.name}'s Post</p>
            </div>

            <submain class="p-2 border-b-2 border-black">
                <submain class="flex gap-2 items-center">
                    <img src={announcement.photoURL} alt="loading" class="w-10 rounded-full bg-slate-700"/>
                    <div class="">
                        <p class="font-serif">{announcement.name}</p>
                        <p>{announcement.date}</p>
                    </div>
                </submain>

                <p class="py-2">{announcement.announcement}</p>
            </submain>

            <!--Comment panel here-->
            <main class="max-h-[40vh] sm:max-h-[60vh] overflow-y-scroll p-2">
                {#each $adminState.commentsArray as comment}
                    <!--Compare the target comment to db to promp in frontend-->
                    {#if comment.targetUID === announcement.originUID}
                        <submain class="p-2 break-words">
                            <submain class="flex gap-2 items-center">
                                <img src={comment.photoURL} alt="loading" class="w-10 rounded-full bg-slate-700"/>
                                <div class="w-full">
                                    <p class="font-serif">{comment.name} <i class="text-red-500 font-serif">Replied</i></p>
                                    <p>{comment.date}</p>
                                </div>

                                <!--Filter user and admin to show specific delete function-->
                                {#if $auth.currentUser.uid === comment.ownerUID || $auth.currentUser.uid === $adminKey}
                                    <button class="text-red-500 transition-all hover:font-semibold active:scale-95 -mt-6 mr-4"
                                    on:click={() => deleteCommentHandler(comment)}
                                    >
                                        Delete
                                    </button>
                                {/if}
                            </submain>

                            <p class="py-2">{comment.announceComment}</p>
                        </submain>
                    {/if}
                {/each}
            </main>
        </submain>
        <!--Calling comment chat component with logic functionality-->
        <CommentTnS bind:this={$adminState.commentTextStore}
        on:click={sendComment}
        Logic={$staticStates.showLoading}
        
        />
    </div>

</main>


<style>
    #colorMe{
        background-color: rgba(0, 0, 0, 0.271);
    }
</style>