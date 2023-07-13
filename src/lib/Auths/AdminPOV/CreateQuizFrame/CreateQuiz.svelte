<script>
// @ts-nocheck

    import { adminState, adminKey, staticStates } from "$lib/States/universalStates";
	import Buttons from "$lib/GenCom/Buttons.svelte";
	import Inputs from "$lib/GenCom/Inputs.svelte";
    import { fly, scale } from "svelte/transition";
	import CorrectAnswer from "./CorrectAnswer.svelte";

    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
	import { addDoc, collection, serverTimestamp } from "firebase/firestore";
    
    //clearup function
    const cleanThings = () => 
    {
        $adminState.questionTitle.Bindthis = "";
        $adminState.selectionOne.Bindthis = "";
        $adminState.selectionTwo.Bindthis = "";
        $adminState.selectionThree.Bindthis = "";
        $adminState.selectionFour.Bindthis = "";
        $adminState.correctAnswer.Bindthis = "Select";
        $adminState.quizArrayPack = [];
        $adminState.quizTitle = "";
        thisCompoVar.counter = 0;
        thisCompoVar.showNext = false;
        thisCompoVar.switcherLogic = false;
        thisCompoVar.domMsg = "";
        thisCompoVar.quizTitle = "";


    }
    
    const thisCompoVar = {
        showNext: false,
        switcherLogic: false,
        counter: 0,
        domMsg: "",
        quizTitle: "",
    }


    //just detection
    const detectKey = () => 
    {
        $adminState.quizTitle.Bindthis.trim().length > 4 ? thisCompoVar.showNext = true : thisCompoVar.showNext = false;

    }



    // this function will save quiz title and use a logic ternatary to switch function from nextHandler to subNext function
    const nextHandler = () => 
    {   
        
        thisCompoVar.quizTitle = $adminState.quizTitle.Bindthis;
        thisCompoVar.switcherLogic = true;
        thisCompoVar.counter++; 
    }
    // this function will save and increment counter and almost all data need for the quiz making system
    const subNext = () => 
    {
        
        const questionTitle = $adminState.questionTitle.Bindthis;
        const selectionOne = $adminState.selectionOne.Bindthis;
        const selectionTwo = $adminState.selectionTwo.Bindthis;
        const selectionThree = $adminState.selectionThree.Bindthis;
        const selectionFour = $adminState.selectionFour.Bindthis;
        const correctAnswer = $adminState.correctAnswer.numericAnswer;

        if(questionTitle.trim().length > 3&&
        selectionOne.trim().length > 1&&
        selectionTwo.trim().length > 1&&
        selectionThree.trim().length > 1&&
        selectionFour.trim().length > 1)
        {
            thisCompoVar.counter++;
            let templatedObject = {
                quizTitle: thisCompoVar.quizTitle,
                questionTitle: questionTitle,
                correctAnswer: correctAnswer,
                selection: [
                    selectionOne,
                    selectionTwo,
                    selectionThree,
                    selectionFour,
                ]
            }

            $adminState.quizArrayPack.push(templatedObject);
            
            //clean up for next question generation 
            $adminState.questionTitle.Bindthis = "";
            $adminState.selectionOne.Bindthis = "";
            $adminState.selectionTwo.Bindthis = "";
            $adminState.selectionThree.Bindthis = "";
            $adminState.selectionFour.Bindthis = "";
            $adminState.correctAnswer.Bindthis = "Select";
            thisCompoVar.domMsg = "";
           
        }else
        {
            thisCompoVar.domMsg = "Had error please check your inputs";
        }




        
        
    }

    //this function when triggered it will decrement counter and use logic to reset the next button and so on.
    const backHandler = () => 
    {
        thisCompoVar.counter--;
        thisCompoVar.counter === 0 ? (thisCompoVar.switcherLogic = false, thisCompoVar.showNext = false) : thisCompoVar.switcherLogic = true;
        $adminState.quizArrayPack.pop();
        
    }

    //this function will send all the data to DB to fetch in the front end
    const finishQuizMaker = () => 
    {
        $staticStates.showLoading = true;
        addDoc(collection($db, "quizSystem"), {
            createdAt: serverTimestamp(),
            quizTitle: thisCompoVar.quizTitle,
            quiz: $adminState.quizArrayPack,
        })
        .then(voidResponse => 
        {
            cleanThings();
            $staticStates.showLoading = false;
            $adminState.showCreateQuiz = false;
            
        })
        .catch(errorRespose =>
        {
            $staticStates.showLoading = false;
        })
    }
</script>

<main>
    <div class="max-w-fit">
        <Buttons Title="Create Quiz" on:click={() => $adminState.showCreateQuiz = true}/>
    </div>

    {#if $adminState.showCreateQuiz}
        <main class="fixed bottom-0 top-0 left-0 right-0  z-10" id="colorMe">
            <div class="mx-auto sm:max-w-xl border-2 mt-[10vh] p-4 flex flex-col gap-2 bg-white rounded-md" transition:scale>
                <div class="border-b-2 border-t-2 border-yellow-500 py-1">
                    <p class="bg-yellow-500 text-center font-serif text-white font-semibold">New Quiz</p>
                </div>

                <p class="text-red-500 text-center">{thisCompoVar.domMsg}</p>

                {#if thisCompoVar.switcherLogic}
                    <submain in:fly={{x:-100, duration:700}}>
                        <Inputs Label="Question {thisCompoVar.counter}" Placeholder="Ex, is Java and Javascript same?"
                        bind:this={$adminState.questionTitle}
                        />
                        <Inputs Label="Selection One" Placeholder="Ex, Not really"
                        bind:this={$adminState.selectionOne}
                        />
                        <Inputs Label="Selection Two" Placeholder="Ex, Maybe"
                        bind:this={$adminState.selectionTwo}
                        />
                        <Inputs Label="Selection Three" Placeholder="Ex, Java is same as Javascript"
                        bind:this={$adminState.selectionThree}
                        />
                        <Inputs Label="Selection Four" Placeholder="Ex, No they are different languages"
                        bind:this={$adminState.selectionFour}
                        />
                        <CorrectAnswer bind:this={$adminState.correctAnswer}/>
                    </submain>
                {:else}
                    <Inputs Label="Quiz Title" Placeholder="Ex, Simple Math Quiz" on:keyup={detectKey}
                    bind:this={$adminState.quizTitle}
                    />
                {/if}

                <submain class="flex gap-1">
                    {#if thisCompoVar.showNext}
                        <Buttons Title="Next"
                        on:click={thisCompoVar.switcherLogic ? subNext : nextHandler}
                        />
                        {#if thisCompoVar.switcherLogic}
                            <Buttons Title="Back"
                            on:click={backHandler}
                            />
                        {/if}

                        {#if $adminState.quizArrayPack.length > 0}
                            <Buttons Title="Finish"
                            Logic={$staticStates.showLoading}
                            Logic_Title="Uploading."
                            on:click={finishQuizMaker}
                            />
                        {/if}
                    {/if}

                    <Buttons Title="Cancel" on:click={() => {
                        $adminState.showCreateQuiz = false;
                        cleanThings();
                    }}/>
                </submain>
            </div>
        </main>
    {/if}
</main>


<style>
    #colorMe{
        background-color: rgba(0, 0, 0, 0.271);
    }
</style>