<script>
    import { staticStates } from "$lib/States/universalStates";
	import AnnouncementFrame from "./AnnouncementFrame/AnnouncementFrame.svelte";
	import CreateClassFrame from "./CreateClassFrame/CreateClassFrame.svelte";
	import CreateCompilationFrame from "./CreateCompilationFrame/CreateCompilationFrame.svelte";
	import CreateQuizFrame from "./CreateQuizFrame/CreateQuizFrame.svelte";
	import UploadAssignmentFrame from "./UploadAssignmentFrame/UploadAssignmentFrame.svelte";

</script>

<main>
    {#if $staticStates.activeItem === "Create Class"}
        <CreateClassFrame />
    {:else if $staticStates.activeItem === "Announcement"}
        <AnnouncementFrame />
    {:else if $staticStates.activeItem === "Upload Assignment"}
        <UploadAssignmentFrame />
    {:else if $staticStates.activeItem === "Create Quiz"}
        <CreateQuizFrame />
    {:else if $staticStates.activeItem === "Online Compiler Links"}
        <CreateCompilationFrame />
    {/if}
</main>