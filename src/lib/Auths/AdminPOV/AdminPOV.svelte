<script>
    import { staticStates } from "$lib/States/universalStates";
	import AnnouncementFrame from "./AnnouncementFrame/AnnouncementFrame.svelte";
	import CreateClassFrame from "./CreateClassFrame/CreateClassFrame.svelte";
	import UploadAssignmentFrame from "./UploadAssignmentFrame/UploadAssignmentFrame.svelte";
</script>

<main>
    {#if $staticStates.activeItem === "Create Class"}
        <CreateClassFrame />
    {:else if $staticStates.activeItem === "Announcement"}
        <AnnouncementFrame />
    {:else if $staticStates.activeItem === "Upload Assignment"}
        <UploadAssignmentFrame />
    {/if}
</main>