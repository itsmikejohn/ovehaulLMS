<script>
// @ts-nocheck
    import { adminKey, adminState, staticStates } from "$lib/States/universalStates";
    import Buttons from "$lib/GenCom/Buttons.svelte";
    import { scale } from "svelte/transition";

    //database calls
    import { auth, db, storage } from "$lib/DB/firebaseConfig";
	import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
    import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

    //some unoptimize global variables hahaha soon i will make this secure
    let files = [];
    let percentage = 0;
    let showUpload = false;

    

   //upload handle that sends data to database storage and relink to firestore
   const uploadHandler = () => 
   {
        $staticStates.showLoading = true;
        const uploadSomething = uploadBytesResumable(ref($storage, `assignments/${files[0].name}`), files[0]);
        uploadSomething.on("state_changed", snapshot => 
        {
            setTimeout(() => {
                percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                $staticStates.showLoading = false;
            },300)
            
            
        }, error => 
        {
            console.log(error);
            $staticStates.showLoading = false;
        }
        ,voidRes => 
        {
            getDownloadURL(uploadSomething.snapshot.ref)
            .then(urlResponse => 
            {
                //relinking to firestore function
                let filePhoto = "";
                const connectFirestore = () => {
                    setDoc(doc(collection($db, "assignmentLinks"), files[0].name),{
                        createdAt: serverTimestamp(),
                        fileName: files[0].name,
                        fileLink: urlResponse,
                        filePhoto: filePhoto,
                    }, {merge:true})
                }

                if(files[0].type === "application/pdf")
                {
                    filePhoto = $adminState.MIMEtypes.pdf;
                    connectFirestore();
                }else if(files[0].type === "application/vnd.openxmlformats-officedocument.presentationml.presentation")
                {
                    filePhoto = $adminState.MIMEtypes.powerpoint;
                    connectFirestore();
                }else if(files[0].type === "application/vnd.ms-excel")
                {
                    filePhoto = $adminState.MIMEtypes.excel;
                    connectFirestore();
                }else if(files[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                {
                    filePhoto = $adminState.MIMEtypes.word;
                    connectFirestore();
                }

                $staticStates.showLoading = false;
                
                document.querySelector("#tobeReset").value = "";
                showUpload = false;
                percentage = 0;
            })

        
        })
   }

</script>

<main>
    <div class="max-w-fit">
        <Buttons 
        Title="Upload Assignment"
        on:click={() => $adminState.showCreateAssignment  = true}
        />
    </div> 
    
    {#if $adminState.showCreateAssignment}
        <submain class="fixed bottom-0 top-0 left-0 right-0  z-10 p-2 sm:p-0" id="colorMe">
            <div class="mx-auto sm:max-w-xl border-2 mt-[10vh] p-4 flex flex-col gap-2 bg-white rounded-md" transition:scale>
                <div class="border-b-2 border-t-2 border-yellow-500 py-1">
                    <p class="bg-yellow-500 text-center font-serif text-white font-semibold">Upload Assignment</p>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-2 items-center">
                    <div class="border-2 border-black p-2">
                        <input type="file" id="tobeReset" bind:files 
                        accept="application/pdf, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                        on:change={() => files[0] ? showUpload = true : showUpload = false}>

                        <progress max="100" value={percentage} class="w-full"/>
                    </div>

                    <div class="w-full p-2">
                        <p class="font-serif font-bold">Take note.</p>
                        <p class="">Only PDF, DOCx, PPTx, XLSx, file types can be uploaded.</p>
                    </div>
                </div>

                <div class="flex gap-1">
                    {#if showUpload}
                        <Buttons Color="bg-green-500" Title="Upload"
                        Logic={$staticStates.showLoading}
                        Logic_Title="Uploading"
                        on:click={uploadHandler}
                        />
                    {/if}

                    <Buttons Title="Cancel"
                    on:click={() => $adminState.showCreateAssignment = false}
                    />
                </div>
            </div>
        </submain>
    {/if}

    


</main>


<style>
    #colorMe{
        background-color: rgba(0, 0, 0, 0.271);
    }
</style>


