import { writable } from "svelte/store";

export const adminKey = writable("H0ryIenlUBgAaElh2Jf8TtBXqZ42");

export const adminState = writable({
    navArray: ["Create Class", "Announcement", "Upload Assignment", "Create Quiz"],

    //create class state
    createClassLogic: false,
    subject: "",
    description: "",
    teacher: "",
    youtubeTitle: "",
    youtubeLink: "",
    moduleTitle: "",
    moduleLink: "",

    createdClassArray: [],
    createClassComparison: 0.1,
    enStudArray: [],
    viewChat: false,
    textStore: "",
    chatsArray: [],

    //announcement state
    showCreateAnnouncement: false,
    chatTextStore: "",
    announcementArray: [],
    commentComparison: 0.1,
    commentTextStore: "",
    commentsArray: [],

    //assignment state
    showCreateAssignment: false,
    assignmentsArray: [],
    MIMEtypes: {
        word: "https://www.svgrepo.com/show/374188/word2.svg",
        powerpoint: "https://www.svgrepo.com/show/452069/ms-powerpoint.svg",
        pdf: "https://www.svgrepo.com/show/484943/pdf-file.svg",
        excel: "https://www.svgrepo.com/show/373590/excel2.svg",
    }
});

export const studentState = writable({
    navArray: ["My Class", "Notification", "Backpack", "Quiz"],
});

export const staticStates = writable({

    //nav states
    activeItem: "",
    hadAdmin: false,
    hadStud: false,
    navArray: ["Made from scratch", "SvelteKit", "Firebase"],

    //login states
    showLoading: false,
    showReg: false,
    showRecover: false,
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    gender: "",

    genderGenerator: {
        boy: [
            "https://em-content.zobj.net/source/microsoft-teams/363/boy_1f466.png",
            "https://em-content.zobj.net/source/skype/289/boy_1f466.png",
            "https://em-content.zobj.net/thumbs/120/whatsapp/352/boy_1f466.png",
            "https://em-content.zobj.net/thumbs/120/twitter/348/boy_1f466.png"
        ],
        girl: [
            "https://em-content.zobj.net/source/skype/289/girl_1f467.png",
            "https://em-content.zobj.net/source/microsoft-teams/363/girl_1f467.png",
            "https://em-content.zobj.net/thumbs/120/twitter/348/girl_1f467.png",
            "https://em-content.zobj.net/thumbs/120/joypixels/340/girl_1f467.png",
        ],
    }
});