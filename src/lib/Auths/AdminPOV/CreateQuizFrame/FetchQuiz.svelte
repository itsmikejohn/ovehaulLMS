<script>
// @ts-nocheck
    import { adminState, adminKey } from "$lib/States/universalStates";
    import { fly, scale } from "svelte/transition";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
	import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
	import Buttons from "$lib/GenCom/Buttons.svelte";
	import MainQuizActivity from "./MainQuizActivity.svelte";

    //fetcj scores
    onSnapshot(collection($db, "learnerScores"), snapsRes => 
    {
        let fbData = [];
        snapsRes.docs.forEach(doc => 
        {
            let mutatedDate = new Date(Number(JSON.stringify(doc.data().createdAt).slice(11,21)) * 1000)
            let date = mutatedDate.toLocaleDateString() + " " + mutatedDate.toLocaleTimeString();
            let data = {...doc.data(), id:doc.id, date:date};
            fbData = [data, ...fbData];

        })
        $adminState.scoreArray = fbData;
    })

    //fetch quiz data from db
    onSnapshot(collection($db, "quizSystem"), snapsRes => 
    {   
        let fbData = [];
        snapsRes.docs.forEach(doc => 
        {
            let mutatedDate = new Date(Number(JSON.stringify(doc.data().createdAt).slice(11,21)) * 1000)
            let date = mutatedDate.toLocaleDateString() + " " + mutatedDate.toLocaleTimeString();
            let data = {...doc.data(), id:doc.id, date:date};
            fbData = [data, ...fbData];
        })

        $adminState.fetchQuizArray = fbData;
        
    })

    //start quiz handler make marking to the quiz data
    const startQuiz = (quiz, outerIndex) => 
    {
        updateDoc(doc(collection($db, "quizSystem"), quiz.id), {
            originUID: quiz.id
        })
        .then(voidRes => 
        {
            $adminState.quizComparison = outerIndex;
        })
        
    }
    
    //delete quiz
    const deleteHandler = quiz =>
    {
        deleteDoc(doc(collection($db, "quizSystem"), quiz.id))
        
    }
  
    
</script>

<main class="flex flex-col sm:flex-row sm:flex-wrap">
    {#each $adminState.fetchQuizArray as quiz, outerIndex}
        <div class="border-2 mt-2 sm:ml-5 sm:min-w-xl p-2 rounded-lg flex flex-col gap-2 bg-slate-200 h-fit"
        in:fly={{x:-600, duration:800}}>
            
            <div class="border-b-2 border-t-2 border-yellow-500 py-1">
                <p class="bg-yellow-500 px-2 font-serif text-white">{quiz.quizTitle}</p>
            </div>
            <p class="text-center">{quiz.date}</p>
            
            {#each $adminState.scoreArray as score}
                {#if score.targetUID === quiz.originUID && score.ownerUID === $auth.currentUser.uid}
                    <p class="text-green-500 text-4xl text-center p-2">{score.score}%</p>
                {/if}
            {/each}
            
            <submain class="flex gap-1">
                {#if !(quiz[$auth.currentUser.uid] === $auth.currentUser.uid)}
                    <Buttons Title="Start" on:click={() => startQuiz(quiz, outerIndex)}/>
                {/if}
                    {#if $auth.currentUser.uid === $adminKey}
                        <Buttons Color="bg-red-500" 
                        Title="Delete"
                        on:click={() => deleteHandler(quiz)}
                        />
                    {/if}
            </submain>
            
            
        </div>

        {#if $adminState.quizComparison === outerIndex}
            <MainQuizActivity {quiz} />
        {/if}

    {/each}
</main>


