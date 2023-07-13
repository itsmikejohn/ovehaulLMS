<script>
// @ts-nocheck
    export let quiz;


	import Buttons from "$lib/GenCom/Buttons.svelte";
    import { scale, fly } from "svelte/transition";
	import AnswerLayout from "./AnswerLayout.svelte";
	import { adminState, staticStates } from "$lib/States/universalStates";

    //datbase calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { setDoc, doc, collection, addDoc, serverTimestamp } from "firebase/firestore";

    const thisCompVar = {
        score: 0,
        mistake: 0,
        page: 0,
        length: quiz.quiz.length,

        showFinishLogic: false,

    }
    //correct answer checker with relation to database quiz
    const correctChecker = innerIndex => 
    {   
        if(quiz.quiz[thisCompVar.page].correctAnswer === innerIndex)
        {
            thisCompVar.score++;
            $adminState.showCorrectLogic = true;
            setTimeout(() => 
            {
                $adminState.showCorrectLogic = false;
                
                quiz.quiz.length  === (thisCompVar.page + 1) ? thisCompVar.showFinishLogic = true : thisCompVar.page++;
            }, 500)

        }else
        {
            thisCompVar.mistake++;
            $adminState.showIncorrectLogic = true;
            setTimeout(() => 
            {
                $adminState.showIncorrectLogic = false;
                quiz.quiz.length === (thisCompVar.page + 1) ? thisCompVar.showFinishLogic = true : thisCompVar.page++;
            }, 500)
        }
    }


    //submit data to database for scoring
    const sendScores = () => 
    {
        $staticStates.showLoading = true;
        const percentage = Math.floor((thisCompVar.score / quiz.quiz.length) * 100)
        
        setDoc(doc(collection($db, "quizSystem"), quiz.id), {
            [$auth.currentUser.uid]: $auth.currentUser.uid
        }, {merge:true})
        .then(voidRes => 
        {
            setDoc(doc(collection($db, "learnerScores"), $auth.currentUser.uid + quiz.id), {
                createdAt: serverTimestamp(),
                targetUID: quiz.id,
                ownerUID: $auth.currentUser.uid,
                score: percentage,
            }, {merge:true})
            .then(voidRes => 
            {
                $adminState.quizComparison = 0.1;
                thisCompVar.score = 0;
                thisCompVar.mistake = 0;
                thisCompVar.page = 0;
                thisCompVar.showFinishLogic = false;
                $staticStates.showLoading = false;
            })
        })
    }
</script>

<main class="fixed bottom-0 top-0 left-0 right-0  z-10" id="colorMe">
    <div class="mx-auto sm:max-w-xl border-2 mt-[10vh] p-4 flex flex-col gap-2 border-black bg-white rounded-md" transition:scale>
        <div class="border-b-2 border-t-2 border-yellow-500 py-1">
            <p class="bg-yellow-500 text-center font-serif text-white font-semibold">{quiz.quizTitle}</p>
            
        </div>
        <submain class="flex">
            <p class="font-serif p-2">Score: {thisCompVar.score}</p>
            <p class="font-serif p-2">Mistake: {thisCompVar.mistake}</p>
            <p class="font-serif p-2">Total Questions: {(thisCompVar.length -1) - thisCompVar.page}</p>
        </submain>
        {#if thisCompVar.showFinishLogic}
            <p class="text-center font-serif">Thank you for answering!</p>
            <Buttons Color="bg-green-500" 
            Logic={$staticStates.showLoading}
            Logic_Title="Uploading."
            Title="Ok"
            on:click={sendScores}
            />
        {:else}
        <AnswerLayout/>
        <submain>
            <p class="p-2">{quiz.quiz[thisCompVar.page].questionTitle}</p>
            {#each quiz.quiz[thisCompVar.page].selection as selection, innerIndex}
                <button class="transition-all w-full text-left px-2 py-1 bg-slate-200 mt-1 text-blue-900 hover:font-bold hover:bg-[#191830] hover:text-white hover:scale-105 active:scale-95"
                on:click={() => correctChecker(innerIndex)}
                >{selection}
                </button>
            {/each}
        </submain>
        {/if}
        
    </div>
</main>