<script>
// @ts-nocheck

    import { adminState, adminKey } from "$lib/States/universalStates";
    import { fly } from "svelte/transition";

    //database calls
    import { auth, db, storage } from "$lib/DB/firebaseConfig";
    import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
    import { ref, deleteObject } from "firebase/storage";
	import Buttons from "$lib/GenCom/Buttons.svelte";

    //fetch data of assignment links
    onSnapshot(query(collection($db, "assignmentLinks"), orderBy("createdAt", "desc")), snapsResponse => 
    {
        let fbData = [];
        snapsResponse.docs.forEach(doc => 
        {
            let mutatedDate = new Date(Number(JSON.stringify(doc.data().createdAt).slice(11,21)) * 1000);
            let date = mutatedDate.toLocaleTimeString() + ", " + mutatedDate.toDateString();
            let data = {...doc.data(), id: doc.id, date: date};
            fbData = [data, ...fbData];

        })
        $adminState.assignmentsArray = fbData;
    })

    //handles deleting assignment
    const deleteHandler = assignment => 
    {
        deleteDoc(doc(collection($db, "assignmentLinks"), assignment.id))
        .then(voidResponse => 
        {
            deleteObject(ref($storage, `assignments/${assignment.id}`))
        })
    }

</script>

<main class="flex flex-col sm:flex-row sm:flex-wrap">
    {#each $adminState.assignmentsArray as assignment}
    <div class="flex flex-col gap-2">
       
        <button class="transition-all mt-2 sm:ml-5 h-fit p-2 rounded-lg flex flex-col gap-2 bg-slate-200 hover:shadow-lg hover:shadow-black hover:scale-105 active:scale-95" 
        on:click={() => open(assignment.fileLink)}
        in:fly={{x:-600, duration:800}}>

            <div class="flex gap-2 items-center">
                <div class="">
                    <img src={assignment.filePhoto} alt="loading" class="w-20"/>
                </div>
                <div class="">
                    <p class="font-serif">{assignment.fileName}</p>
                    <p>{assignment.date}</p>
                </div>
            </div>

        </button>
    
        
        {#if $auth.currentUser.uid === $adminKey}
            <div class="sm:ml-5">
                <Buttons 
                Color="bg-red-500" 
                Title="Delete"
                on:click={() => deleteHandler(assignment)}
                />
            </div>
        {/if}
    </div>
    {/each}
</main>