<script>
// @ts-nocheck
    import { adminKey, adminState } from "$lib/States/universalStates";
    import { fly } from "svelte/transition";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { onSnapshot, collection, query, orderBy, deleteDoc, doc, setDoc, increment, updateDoc, where } from "firebase/firestore";
	import Buttons from "$lib/GenCom/Buttons.svelte";
	import Comments from "./Comments.svelte";
	

    //fetch announcement
    onSnapshot(query(collection($db, "announcements"), orderBy("createdAt", "desc")), snapsResponse => 
    {
        let fbData = [];
        snapsResponse.docs.forEach(doc => {
            let mutatedDate = new Date(Number(JSON.stringify(doc.data().createdAt).slice(11,21)) * 1000);
            let date = mutatedDate.toLocaleTimeString() + " " + mutatedDate.toDateString();
            let data = {...doc.data(), id: doc.id, date: date};
            fbData = [data, ...fbData];

        })
        $adminState.announcementArray = fbData;
    })

    //delete announcement
    const deleteHandler = announcement => 
    {
        deleteDoc(doc(collection($db, "announcements"), announcement.id))
        .then(voidRes => 
        {
            onSnapshot(query(collection($db, "announcementComments"), where("targetUID", "==", announcement.id)), snapsRes => 
            {
                snapsRes.docs.forEach(document => 
                {
                    deleteDoc(doc(collection($db, "announcementComments"), document.id))
                })
            })
        })
    }

    //sendLike count
    const sendLike = announcement => 
    {   
        updateDoc(doc(collection($db, "announcements"), announcement.id), {
            [$auth.currentUser.uid]: $auth.currentUser.uid,
            likeCount: increment(1),
        })
    }
    //undoLike count
    const sendUndoLike = announcement => 
    {
        updateDoc(doc(collection($db, "announcements"), announcement.id), {
            [$auth.currentUser.uid]: null,
            likeCount: increment(-1),
        })
    }

    //show comment and make markings on announcement
    const showComment = (announcement, outerIndex) => 
    {
        updateDoc(doc(collection($db, "announcements"), announcement.id), {
            originUID: announcement.id,
        })
        .then(voidResponse => 
        {
            $adminState.commentComparison = outerIndex;
        })
    }
    
</script>

<main class="flex flex-col sm:flex-row sm:flex-wrap ">
    {#each $adminState.announcementArray as announcement, outerIndex}
        <submain class="border-2 mt-2 sm:ml-5 h-fit p-2 rounded-lg flex flex-col gap-2 bg-slate-200 " in:fly={{x:-600, duration:800}}>
            <div class="flex flex-col gap-2 ">

                <div class="flex gap-2 items-center">
                    <img src={announcement.photoURL} alt="loading" class="w-10 rounded-full bg-slate-700" />
    
                    <div class="w-full">
                        <p class="font-serif">{announcement.name}</p>
                        <p>{announcement.date}</p>
                    </div>
                    
                    <!--Delete func for admin only-->
                    {#if $auth.currentUser.uid === $adminKey}
                        <div class="-mt-8">
                            <button class="transitiona-all hover:font-semibold active:scale-95 text-red-500"
                            on:click={() => deleteHandler(announcement)}
                            >
                                Delete
                            </button>
                        </div>
                    {/if}
                </div>

                
                <p class="p-2 max-w-xl break-words">{announcement.announcement}</p>
               
                <!--Like and comment logics-->
                <div class="flex gap-2 mt-2">
                    {#if announcement[$auth.currentUser.uid] === $auth.currentUser.uid}

                        <button class="w-full border-2 border-white bg-white transition-all hover:opacity-50 active:scale-95 text-blue-500"
                        on:click={() => sendUndoLike(announcement)}
                        >{announcement.likeCount} Liked</button>

                    {:else if announcement.likeCount === undefined}

                        <button class="w-full border-2 border-white bg-white transition-all hover:opacity-50 active:scale-95"
                        on:click={() => sendLike(announcement)}
                        >Like</button>

                    {:else}
                        <button class="w-full border-2 border-white bg-white transition-all hover:opacity-50 active:scale-95"
                        on:click={() => sendLike(announcement)}
                        >
                            <!--Like grammar logic haha-->
                            {#if announcement.likeCount === 0}
                                Like 
                            {:else}
                                {#if announcement.likeCount > 1}
                                    {announcement.likeCount} Likes
                                {:else}
                                    {announcement.likeCount} Like
                                {/if}
                            {/if}
                        </button>

                    {/if}
                    
                    
                    <button class="w-full border-2 border-white bg-white transition-all hover:opacity-50 active:scale-95"
                    on:click={() => showComment(announcement, outerIndex)}
                    >
                        <!--Comment grammar logic haha-->
                        {#if announcement.commentCount === 0}
                            Comment
                        {:else if announcement.commentCount > 1}
                            {announcement.commentCount} Comments
                        {:else}
                            {announcement.commentCount} Comment
                        {/if}
                    </button>
                </div>
            </div>
        </submain>
        <!--Prop drilling comments-->
        {#if $adminState.commentComparison === outerIndex}
            <Comments {announcement} />
        {/if}
    {/each}
</main>