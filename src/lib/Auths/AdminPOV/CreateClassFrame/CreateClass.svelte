<script>
// @ts-nocheck

    import { adminState, staticStates } from "$lib/States/universalStates";
	import Buttons from "$lib/GenCom/Buttons.svelte";
	import Inputs from "$lib/GenCom/Inputs.svelte";
    import { scale } from "svelte/transition";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { addDoc, collection, serverTimestamp } from "firebase/firestore";

    //handle creating class
    const createClassHandler = () => 
    {
        const subject = $adminState.subject.Bindthis;
        const description = $adminState.description.Bindthis;
        const teacher = $adminState.teacher.Bindthis;
        const youtubeTitle = $adminState.youtubeTitle.Bindthis;
        const youtubeLink = $adminState.youtubeLink.Bindthis;
        const moduleTitle = $adminState.moduleTitle.Bindthis;
        const modulelink = $adminState.modulelink.Bindthis;
        $staticStates.showLoading = true;

        addDoc(collection($db, "createdClass"), {
            createdAt: serverTimestamp(),
            subject: subject,
            description: description,
            teacherName: teacher,
            youtubeTitle: youtubeTitle,
            youtubeLink: youtubeLink,
            moduleTitle: moduleTitle,
            modulelink: modulelink,
        })
        .then(voidResponse => 
        {
            $staticStates.showLoading = false;
            $adminState.createClassLogic = false;
        })
        .catch(errorResponse => 
        {
            console.log(errorResponse.code)
            $staticStates.showLoading = false;
        })
    }   


</script>

<main>
    <div class="max-w-fit">
        <Buttons Title="Create Class" on:click={() => $adminState.createClassLogic = true}/>
    </div>
    {#if $adminState.createClassLogic}
        <main class="fixed bottom-0 top-0 left-0 right-0  z-10" id="colorMe">
            <div class="mx-auto sm:max-w-xl border-2 mt-[10vh] p-4 flex flex-col gap-2 bg-white rounded-md" transition:scale>
                <div class="border-b-2 border-t-2 border-yellow-500 py-1">
                    <p class="bg-yellow-500 text-center font-serif text-white font-semibold">Create Class</p>
                </div>

                <Inputs Label="Subject:" Placeholder="Enter class subject"
                bind:this={$adminState.subject}
                />

                <Inputs Label="Description:" Placeholder="Enter class description"
                bind:this={$adminState.description}
                />
                
                <Inputs Label="Teacher:" Placeholder="Enter class teacher"
                bind:this={$adminState.teacher}
                />

                <div class="flex gap-1 items-center">
                    <div class="w-full">
                        <Inputs Label="Youtube title:" Placeholder="Enter youtube title"
                        bind:this={$adminState.youtubeTitle}
                        />
                    </div>

                    <div class="w-full">
                        <Inputs Label="Youtube link:" Placeholder="Enter youtube link"
                        bind:this={$adminState.youtubeLink}
                        />
                    </div>
                </div>

                <div class="flex gap-1 items-center">
                    <div class="w-full">
                        <Inputs Label="Module title" Placeholder="Enter module title"
                        bind:this={$adminState.moduleTitle}
                        />
                    </div>

                    <div class="w-full">
                        <Inputs Label="Module link" Placeholder="Enter module link"
                        bind:this={$adminState.modulelink}
                        />
                    </div>
                </div>
                
                <div class="flex gap-1 items-center">
                    <div class="w-full">
                        <Buttons 
                        on:click={createClassHandler}
                        Title="Create"
                        Logic={$staticStates.showLoading}
                        Logic_Title="Creating."
                        />
                    </div>

                    <div class="w-full">
                        <Buttons Title="Cancel" on:click={() => $adminState.createClassLogic = false}/>
                    </div>
                </div>
            </div>
        </main>
    {/if}
</main>

<style>
    #colorMe{
        background-color: rgba(0, 0, 0, 0.271);
    }
</style>