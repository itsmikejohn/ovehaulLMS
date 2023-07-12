<script>
// @ts-nocheck

    
    import Buttons from "$lib/GenCom/Buttons.svelte";
	import ChatWithSend from "$lib/GenCom/ChatWithSend.svelte";
	import { adminKey, adminState, staticStates } from "$lib/States/universalStates";
    import { scale } from "svelte/transition";
    
    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { addDoc, collection, deleteDoc, onSnapshot, serverTimestamp, doc, query, orderBy } from "firebase/firestore";

    export let classInfo;

    //fetch chats
    
    onSnapshot(query(collection($db, "studentChats"), orderBy("createdAt", "desc")), snapsResponse => 
    {
        let fbData = [];
        snapsResponse.docs.forEach(doc => 
        {
            let mutatedDate = new Date(Number(JSON.stringify(doc.data().createdAt).slice(11,21)) * 1000);
            let date = mutatedDate.toLocaleTimeString() + " " + mutatedDate.toDateString();

            let data = {...doc.data(), id: doc.id, date: date};
            fbData = [data, ...fbData];

        })
        $adminState.chatsArray = fbData;


    })

    //send handler
    const sendHandler = () => {
        const textStore = $adminState.textStore.Bindthis;
        $staticStates.showLoading = true;
        addDoc(collection($db, "studentChats"), {
            createdAt: serverTimestamp(),
            photoURL: $auth.currentUser.photoURL,
            name: $auth.currentUser.displayName,
            email: $auth.currentUser.email,
            ownerUID: $auth.currentUser.uid,
            textStore: textStore,
            targetUID: classInfo.id,
        }).then(voidResponse => 
        {
           
            $adminState.textStore.Bindthis = "";
            $adminState.textStore.detectKey();
            $staticStates.showLoading = false;
        })
    }

    


</script>

<main class="fixed top-0 bottom-0 left-0 right-0 bg-white z-10 p-2 sm:p-0" id="colorMe">
    <div class="mx-auto max-w-xl border-2 bg-slate-200 min-h-[20vh] mt-[7vh]" transition:scale>
        <submain class="flex flex-col gap-2 p-2">
            <div class="border-b-2 border-t-2 border-yellow-500 py-1">
                <p class="bg-yellow-500 text-white text-center font-serif font-semibold">{classInfo.subject}'s Group Chat</p>
            </div>
            <div class="max-w-fit">
                <Buttons Title="Back" on:click={() => $adminState.viewChat = false}/>
            </div>

            <submain class="max-h-[70vh] border-2 border-blue-500 overflow-y-scroll">

                {#each $adminState.chatsArray as chatInfos}
                    {#if chatInfos.targetUID === classInfo.originUID}
                        <main class="p-2 flex flex-col gap-1 break-words">
                            
                            <div class="flex gap-2 items-center">                      
                                <img src={chatInfos.photoURL} alt="loading" class="w-10 rounded-full border-2 bg-slate-700"/>
                                <div class="w-full">
                                    <p class="font-serif">{chatInfos.name}</p>
                                    <p>{chatInfos.date}</p>
                                </div>
                                {#if $auth.currentUser.uid === chatInfos.ownerUID || $auth.currentUser.uid === $adminKey}
                                    <button class="text-red-500 mr-2 transition-all hover:font-semibold active:scale-95"
                                    on:click={() => deleteDoc(doc(collection($db, "studentChats"), chatInfos.id))}
                                    >Delete</button>
                                {/if}
                            </div>
                            <p class="p-2">{chatInfos.textStore}</p>
                        </main>
                    {/if}
                {/each}
            </submain>

            <div class="">
                <ChatWithSend 
                Logic={$staticStates.showLoading}
                bind:this={$adminState.textStore}
                on:click={sendHandler}/>
            </div>
        </submain>

    </div>
</main>

<style>
    #colorMe{
        background-color: rgba(0, 0, 0, 0.271);
    }
</style>
