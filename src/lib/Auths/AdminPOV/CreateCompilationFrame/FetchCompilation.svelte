<script>
// @ts-nocheck

    import { adminState, adminKey } from "$lib/States/universalStates";
    import { fly, scale } from "svelte/transition";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { onSnapshot, collection, orderBy, query, deleteDoc, doc } from "firebase/firestore";

    //fetch created link data from db
    onSnapshot(collection($db, "createdLinks"), snapsResp =>
    {
        let fbData = [];
        snapsResp.docs.forEach(doc => 
        {
            let mutatedDate = new Date(Number(JSON.stringify(doc.data().createdAt).slice(11,21)) * 1000);
            let date = mutatedDate.toLocaleTimeString() + " " + mutatedDate.toDateString();
            let data = {...doc.data(), id: doc.id, date:date };
            fbData = [data, ...fbData];
        })
        $adminState.createdLinksArray = fbData;
    })
</script>

<main class="flex flex-col">
    {#each $adminState.createdLinksArray as links }
        <submain class="border-2 mt-2 sm:ml-5 h-fit p-2 rounded-lg flex flex-col gap-2 bg-slate-200 " in:fly={{x:-600, duration:800}}>
            <div class="flex gap-1 items-center">
                <img src={links.ownerPhotoURL} alt="loading" class="w-10"/>
                <div class="w-full">
                    <p>{links.name}</p>
                    <p>{links.date}</p>
                </div>
                
                {#if $auth.currentUser.uid === $adminKey}
                    <button class="-mt-4 px-2 bg-red-500 text-white font-serif rounded-md transition-all hover:font-semibold active:scale-95"
                    on:click={() => deleteDoc(doc(collection($db, "createdLinks"), links.id))}
                    >Delete</button>
                {/if}
            </div>

            <div class="p-2 flex flex-col gap-2">
                <p>{links.description}</p>
                <a href={links.linkSrc} target="_blank" class="text-blue-500 underline">{links.linkTitle}</a>
            </div>
            
        </submain>
    {/each}
</main>