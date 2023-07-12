<script>
    import { staticStates, studentState, adminState, adminKey } from "$lib/States/universalStates";
    import StaticPOV from "./StaticPOV/StaticPOV.svelte";
    import StudentPOV from "./StudentPOV/StudentPOV.svelte";
    import AdminPOV from "./AdminPOV/AdminPOV.svelte";


    //database calls
    import { auth, db } from "$lib/DB/firebaseConfig";
    import { onAuthStateChanged } from "firebase/auth";
	import NavFrame from "./Nav/NavFrame.svelte";

    //constantly check if there is authentication and filter depends of its UID
    onAuthStateChanged($auth, credResponse => 
    {
        if(credResponse)
        {
            if(credResponse.uid === $adminKey)
            {
                $staticStates.hadAdmin = true;
                $staticStates.activeItem = "Create Class";
                $staticStates.navArray = $adminState.navArray;
            }else
            {
                $staticStates.hadStud = true;
                $staticStates.activeItem = "My Class";
                $staticStates.navArray = $studentState.navArray;
            }

        }else
        {
            $staticStates.hadAdmin = false;
            $staticStates.hadStud = false;
        }
    })

</script>

<main class="p-2 text-xs sm:text-base min-h-screen mt-[8vh]">
    {#if $staticStates.hadAdmin}
        <NavFrame Array_data={$staticStates.navArray}/>
        <AdminPOV />
    {:else if $staticStates.hadStud}
        <NavFrame Array_data={$staticStates.navArray}/>
        <StudentPOV />
    {:else}
        <StaticPOV />
    {/if}
</main>