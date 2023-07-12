<script>
// @ts-nocheck

    import { adminState, adminKey } from "$lib/States/universalStates";
    import { fly } from "svelte/transition";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { onSnapshot, collection, doc, query, orderBy, deleteDoc, setDoc } from "firebase/firestore";
	import Buttons from "$lib/GenCom/Buttons.svelte";
	import ViewClass from "./ViewClass.svelte";


    //get created class form db
    onSnapshot(query(collection($db, "createdClass"), orderBy("createdAt", "desc")), snapshotsResponse =>
    {
        let fbData = [];
        snapshotsResponse.docs.forEach(doc => 
        {

            let mutatedDate = new Date(Number(JSON.stringify(doc.data().createdAt).slice(11,21)) * 1000);
            let date = mutatedDate.toLocaleTimeString() + " " + mutatedDate.toDateString()
        
            let data = {...doc.data() , id: doc.id, date: date};
            fbData = [data, ...fbData];
        })
        $adminState.createdClassArray = fbData;
    })

    //handle view class
    const viewClassHandler = (classID, outerIndex) => {
        setDoc(doc(collection($db, "createdClass"), classID), {
            originUID: classID,
        },{merge:true})

        $adminState.createClassComparison = outerIndex

    }

    //drop class 
    const dropClassHandler = classID => {
        deleteDoc(doc(collection($db, "createdClass"), classID))
    }

   
</script>

<main class="flex flex-col sm:flex-row sm:flex-wrap">
    {#each $adminState.createdClassArray as classInfo, outerIndex}
        <div class="border-2 mt-2 sm:ml-5 sm:min-w-xl p-2 rounded-lg flex flex-col gap-2 bg-slate-200"
        in:fly={{x:-600, duration:800}}
        >
            
            <div class="border-b-2 border-t-2 border-orange-500 py-1">
                <p class="bg-orange-500 px-2 text-white font-serif text-center font-semibold">{classInfo.subject}</p>
            </div>
            
            <submain class="p-4 flex flex-col gap-2">
                <div class="">
                    <p class="font-semibold">Class Created:</p>
                    <p>{classInfo.date}</p>
                </div>
    
                <div class="">
                    <p class="font-semibold">Description:</p>
                    <p>{classInfo.description}</p>
                </div>
    
                <div class="">
                    <p class="font-semibold">Teacher:</p>
                    <p>{classInfo.teacherName}</p>
                </div>
    
                <div class="">
                    <p class="font-semibold">Youtube:</p>
                    <a href={classInfo.youtubeLink} target="_blank" class="underline text-blue-500">{classInfo.youtubeTitle}</a>
                </div>
    
                <div class="">
                    <p class="font-semibold">Module:</p>
                    <a href={classInfo.moduleLink} target="_blank" class="underline text-blue-500">{classInfo.moduleTitle}</a>
                </div>
            </submain>

            <div class="flex gap-1">
                <div class="w-full">
                    <Buttons 
                    Title="View Class"
                    on:click={() => viewClassHandler(classInfo.id, outerIndex) }
                    />
                </div>
                {#if $auth.currentUser.uid === $adminKey}
                <div class="w-full">
                

                    
                        <Buttons 
                        Color="bg-red-500" 
                        Title="Drop Class"
                        on:click={() => dropClassHandler(classInfo.id)}
                        />
                    
                
                </div>
                {/if}
            </div>
        </div>

        {#if $adminState.createClassComparison === outerIndex}
            <ViewClass {classInfo}/>
        {/if}

    {/each}
    
</main>