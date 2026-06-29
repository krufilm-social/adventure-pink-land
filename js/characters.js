const missions = JSON.parse(localStorage.getItem("missions")) || [];
const currentMissionIndex = Number(localStorage.getItem("currentMission"));
const currentMission = missions[currentMissionIndex];
const missionSkillLimit = currentMission && Number(currentMission.questionCount) >= 15 ? 2 : 1;

const characters = [
    {
        id:"monk",
        name:"พระ",
        image:"../images/characters/monk.png",
        skill:`🪷 ตัดตัวเลือกที่ผิดออก 2 ตัว ใช้ได้ ${missionSkillLimit} ครั้ง`,
        lives:3
    },
    {
        id:"wizard",
        name:"พ่อมด",
        image:"../images/characters/wizard.png",
        skill:`🔮 ข้ามคำถามพร้อมรับกุญแจ ใช้ได้ ${missionSkillLimit} ครั้ง`,
        lives:3
    },
    {
        id:"warrior",
        name:"นักรบ",
        image:"../images/characters/warrior.png",
        skill:`🛡️ มีหัวใจ 4 ดวง และกางโล่ป้องกันได้ ${missionSkillLimit} ครั้ง`,
        lives:4
    },
    {
        id:"king",
        name:"กษัตริย์",
        image:"../images/characters/king.png",
        skill:`👑 รับกุญแจพระราชทานเพิ่ม ใช้ได้ ${missionSkillLimit} ครั้ง`,
        lives:3
    },
    {
        id:"musician",
        name:"นักดนตรี",
        image:"../images/characters/musician.png",
        skill:`🎵 ส่องประกายคำตอบที่ถูก ใช้ได้ ${missionSkillLimit} ครั้ง`,
        lives:3
    }
];

const container = document.getElementById("characterContainer");
const playBtn = document.getElementById("playBtn");
let selectedCharacter = null;

if(!currentMission){
    Swal.fire({
        icon:"warning",
        title:"ยังไม่ได้เลือกภารกิจ",
        confirmButtonColor:"#ff69b4"
    }).then(()=>{
        location.href="load.html";
    });
}

characters.forEach(character=>{
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;
    card.innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <h2>${character.name}</h2>
        <div class="heart">${"♥".repeat(character.lives)}</div>
        <div class="skill">${character.skill}</div>
        <button type="button">เลือกตัวละคร</button>
    `;

    const selectCharacter = ()=>{
        document.querySelectorAll(".card").forEach(item=>{
            item.classList.remove("active");
        });

        card.classList.add("active");
        selectedCharacter = character;
        localStorage.setItem("player",JSON.stringify(character));
        playBtn.style.display = "block";
    };

    card.addEventListener("click",selectCharacter);
    card.addEventListener("keydown",event=>{
        if(event.key === "Enter" || event.key === " "){
            event.preventDefault();
            selectCharacter();
        }
    });

    container.appendChild(card);
});

playBtn.addEventListener("click",()=>{
    if(!selectedCharacter){
        Swal.fire({
            icon:"warning",
            title:"กรุณาเลือกตัวละคร",
            confirmButtonColor:"#ff69b4"
        });
        return;
    }

    localStorage.setItem("player",JSON.stringify(selectedCharacter));
    localStorage.setItem("gameSave",JSON.stringify({
        stage:1,
        keys:0,
        life:selectedCharacter.lives,
        complete:[],
        wrongStages:[],
        skillUses:{}
    }));

    localStorage.removeItem("currentStage");
    localStorage.removeItem("quizResult");
    localStorage.removeItem("collectLetters");
    localStorage.removeItem("correctAnswer");
    location.href="map.html";
});
