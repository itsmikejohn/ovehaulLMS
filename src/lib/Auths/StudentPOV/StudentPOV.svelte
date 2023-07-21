<script>
// @ts-nocheck

    import { staticStates } from "$lib/States/universalStates";
	import BackpackFrame from "./BackpackFrame/BackpackFrame.svelte";
	import CompilationLinkFrame from "./CompilationLinkFrame/CompilationLinkFrame.svelte";
    import MyClassFrame from "./MyClassFrame/MyClassFrame.svelte";
	import NotificationFrame from "./NotificationFrame/NotificationFrame.svelte";
	import QuizFrame from "./QuizFrame/QuizFrame.svelte";

</script>

<main>
    {#if $staticStates.activeItem === "My Class"}
        <MyClassFrame />
    {:else if $staticStates.activeItem === "Notification"}
        <NotificationFrame />
    {:else if $staticStates.activeItem === "Backpack"}
        <BackpackFrame />
    {:else if $staticStates.activeItem === "Quiz"}
        <QuizFrame />
    {:else if $staticStates.activeItem === "Online Compiler Links"}
        <CompilationLinkFrame />
    {/if}
</main>