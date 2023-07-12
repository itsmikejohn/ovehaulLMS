<script>
// @ts-nocheck

    import { adminKey, adminState,staticStates } from "$lib/States/universalStates";
    import { scale } from "svelte/transition";
    import Buttons from "$lib/GenCom/Buttons.svelte";
    import GroupChats from "./GroupChats.svelte";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
	import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
	

    export let classInfo;

    //fetch enrolledStudents
    onSnapshot(query(collection($db, "enrolledStudents"), orderBy("createdAt", "desc")), snapshotsResponse => 
    {
        let fbData = [];
        snapshotsResponse.docs.forEach(doc => 
        {
            let mutatedDate = new Date(Number(JSON.stringify(doc.data().createdAt).slice(11,21)) * 1000);
            let date = mutatedDate.toLocaleTimeString() + " " + mutatedDate.toDateString();

            let data = {...doc.data(), id: doc.id, date: date};
            fbData = [data, ...fbData];
           
        })

        $adminState.enStudArray = fbData;
        
    })

    
    const enrollHandler = () => 
    {   
        $staticStates.showLoading = true;
        setDoc(doc(collection($db, "enrolledStudents"), $auth.currentUser.uid + classInfo.originUID), {
            createdAt: serverTimestamp(),
            name: $auth.currentUser.displayName,
            photoURL: $auth.currentUser.photoURL,
            email: $auth.currentUser.email,
            targetClassUID: classInfo.originUID,
            ownerUID: $auth.currentUser.uid,
        }, {merge:true})
        .then(voidResponse => 
        {
            setDoc(doc(collection($db, "createdClass"), classInfo.id), {[$auth.currentUser.uid]: $auth.currentUser.uid,}, {merge:true})
            $staticStates.showLoading = false;
        })
        .catch(errorResponse => 
        {
            $staticStates.showLoading = false;
        })
    }

    //student drop handler
    const dropHandler = () => 
    {
        $staticStates.showLoading = true;
        deleteDoc(doc(collection($db, "enrolledStudents"), $auth.currentUser.uid + classInfo.originUID))
        .then(voidResponse => 
        {
            updateDoc(doc(collection($db, "createdClass"), classInfo.id),{
                [$auth.currentUser.uid]: null,
            })

            $staticStates.showLoading = false;
        })
    }

    //admin drop handler
    const adminDropHandler = enrolledInfo => 
    {
        deleteDoc(doc(collection($db, "enrolledStudents"), enrolledInfo.id))
        .then(() => 
        {
            updateDoc(doc(collection($db, "createdClass"), classInfo.id),{
                [enrolledInfo.ownerUID]: null,
            })
        })
    }
    
</script>

<main class="fixed top-0 bottom-0 left-0 right-0 bg-white z-10 p-2 sm:p-0" id="colorMe">
    <div class="mx-auto max-w-xl border-2 bg-slate-200 min-h-[20vh] mt-[7vh]" transition:scale>
        <submain class="flex flex-col gap-2 p-2">
            <div class="border-b-2 border-t-2 border-yellow-500 py-1">
                <p class="bg-yellow-500 text-white text-center font-serif font-semibold">{classInfo.subject}</p>
            </div>

            <subwrap class="flex gap-2">
                
                <div class="">
                    <Buttons Title="Back"
                    on:click={() => $adminState.createClassComparison = 0.1}
                    />
                </div>

                <div class="w-full"></div>
                <!--View group chat for student who is already enrolled and for admin-->
                {#if classInfo[$auth.currentUser.uid] === $auth.currentUser.uid || $auth.currentUser.uid === $adminKey}
                    <div class="w-full">
                        <Buttons 
                        on:click={() => $adminState.viewChat = true}
                        Color="bg-purple-500" 
                        Title="View Group Chat"/>
                    </div>
                {/if}
            </subwrap>

            <div class="flex items-center gap-2">
                <div class="w-full">
                    <div class="border-b-2 border-t-2 border-blue-500 py-1 max-w-fit">
                        <p class="bg-blue-500 px-2 text-white font-serif">Currently Enrolled Learners</p>
                    </div>
                </div>
                
               <!--Ignore admin comparison because admin doesn't need to enroll lol-->
                {#if !($auth.currentUser.uid === $adminKey)} 
                    <!--Check if student is enrolled or not-->
                    {#if classInfo[$auth.currentUser.uid] === $auth.currentUser.uid}
                        <div class="border-b-2 border-t-2 border-green-500 py-1">
                            <p class="bg-green-500 px-2 text-white font-serif">Enrolled</p>
                        </div>
                        <div class="">
                            <Buttons 
                            on:click={dropHandler}
                            Color="bg-red-500"
                            Title="Drop"
                            Logic={$staticStates.showLoading}
                            Logic_Title="Enrolling."
                            />
                        </div>
                    {:else}
                        <div class="">
                            <Buttons 
                            on:click={enrollHandler}
                            Title="Enroll"
                            Logic={$staticStates.showLoading}
                            Logic_Title="Enrolling."
                            />
                        </div>
                    {/if}
                {/if}
            </div>
            
            <!--Rendered enrolled students-->
            <submain class="max-h-[70vh] overflow-y-scroll">
                {#each $adminState.enStudArray as enrolledInfo, index}
                    {#if enrolledInfo.targetClassUID === classInfo.originUID}
                    <div class="border-2 border-blue-500 mt-2">
                        <div class="flex gap-2 items-center p-2">
                            <img src={enrolledInfo.photoURL} alt="loadin" class="w-10 rounded-full bg-slate-800" />
                            
                            <div class="w-full">
                                <p class="font-bold font-serif">{enrolledInfo.name}</p>
                                <p>{enrolledInfo.email}</p>
                            </div>

                            <!--Drop student for admin only-->
                            {#if $auth.currentUser.uid === $adminKey}
                                <div class="">
                                    <button class="bg-red-500 px-2 text-white transition-all hover:font-semibold rounded-md active:scale-95"
                                    on:click={() => adminDropHandler(enrolledInfo)}
                                    >Drop</button>
                                </div>
                            {/if}
                        </div>

                        <div class="border-t-2 border-blue-500 py-1 text-center">
                            <p class="bg-blue-500 px-2 text-white ">{enrolledInfo.date}</p>
                        </div>
                    </div>
                    {/if}
                {/each}
            </submain>


        </submain>
    </div>
    {#if $adminState.viewChat}
        <GroupChats {classInfo}/>
    {/if}
</main>

<style>
    #colorMe{
        background-color: rgba(0, 0, 0, 0.271);
    }
</style>