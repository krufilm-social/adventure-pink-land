// =====================================================
// MAP.JS (ตอนที่ 1/2)
// Adventure Pink Land
// =====================================================

// ----------------------------
// โหลดข้อมูล
// ----------------------------

const player =
JSON.parse(localStorage.getItem("player"));

const missions =
JSON.parse(localStorage.getItem("missions")) || [];

const missionIndex =
Number(localStorage.getItem("currentMission"));

const mission =
missions[missionIndex];

if(!mission){

    Swal.fire({

        icon:"error",

        title:"ไม่พบภารกิจ",

        text:"กรุณาเลือกภารกิจก่อน",

        confirmButtonColor:"#ff69b4"

    }).then(()=>{

        location.href="../index.html";

    });

}

// ----------------------------
// โหลด Save
// ----------------------------

let gameSave =
JSON.parse(localStorage.getItem("gameSave"));

if(!gameSave){

    gameSave={

        stage:1,

        keys:0,

        life:player.lives,

        complete:[]

    };

}

// รองรับ Save เก่า
if(!Array.isArray(gameSave.complete)){

    gameSave.complete=[];

}

if(!Array.isArray(gameSave.wrongStages)){

    gameSave.wrongStages=[];

}

if(gameSave.keys===undefined){

    gameSave.keys=0;

}

if(gameSave.life===undefined){

    gameSave.life=player.lives;

}

// ----------------------------
// Elements
// ----------------------------

const heartBox =
document.getElementById("heartBox");

const keyBox =
document.getElementById("keyBox");

const stageContainer =
document.getElementById("stageContainer");

const playerImage =
document.getElementById("player");

// ----------------------------
// HUD
// ----------------------------

function refreshHUD(){

    heartBox.innerHTML =
    "♥".repeat(gameSave.life);

    keyBox.innerHTML =
    `${gameSave.keys} / ${mission.questionCount}`;

}

refreshHUD();

// ----------------------------
// ตัวละคร
// ----------------------------

playerImage.src = player.image;

// ----------------------------
// จุดบนแผนที่
// ----------------------------

const mapPoints=[

{x:12,y:70},
{x:23,y:60},
{x:37,y:67},
{x:49,y:54},
{x:61,y:63},
{x:74,y:48},
{x:83,y:59},
{x:71,y:36},
{x:57,y:28},
{x:42,y:37},
{x:28,y:28},
{x:16,y:40},
{x:11,y:22},
{x:26,y:14},
{x:44,y:18},
{x:59,y:11},
{x:73,y:20},
{x:86,y:11},
{x:90,y:30},
{x:82,y:78}

];

// ----------------------------
// สร้างแผนที่
// ----------------------------

createMap();

function createMap(){

    stageContainer.innerHTML="";

    for(let i=1;i<=mission.questionCount;i++){

        const point = mapPoints[i-1];

        const stage =
        document.createElement("div");

        stage.classList.add("stage");

        stage.dataset.stage=i;

        stage.textContent=i;

        stage.style.left=point.x+"%";

        stage.style.top=point.y+"%";

        // ผ่านแล้ว
        if(gameSave.complete.includes(i)){

            stage.classList.add(
                gameSave.wrongStages.includes(i)
                ? "wrong"
                : "complete"
            );

        }

        // ด่านปัจจุบัน
        else if(i===gameSave.stage){

            stage.classList.add("current");

        }

        // ยังไม่เปิด
        else{

            stage.classList.add("lock");

        }

        stage.onclick=()=>{

            selectStage(i);

        };

        stageContainer.appendChild(stage);

    }

    movePlayer(gameSave.stage);

}

// ----------------------------
// วางตัวละคร
// ----------------------------

function movePlayer(stageNumber){

    const stage =
    document.querySelector(

        `.stage[data-stage="${stageNumber}"]`

    );

    if(!stage) return;

    playerImage.style.left =
    (stage.offsetLeft+10)+"px";

    playerImage.style.top =
    (stage.offsetTop-90)+"px";

}

// ----------------------------
// เซฟเกม
// ----------------------------

function saveGame(){

    localStorage.setItem(

        "gameSave",

        JSON.stringify(gameSave)

    );

}

// =====================================================
// MAP.JS (ตอนที่ 2/2)
// ระบบเล่นเกม
// =====================================================

// ----------------------------
// เลือกด่าน
// ----------------------------

function selectStage(stageNumber){

    // ด่านที่ยังไม่เปิด
    if(stageNumber > gameSave.stage){

        Swal.fire({

            icon:"warning",

            title:"ด่านนี้ยังไม่เปิด",

            text:"ผ่านด่านก่อนหน้าให้ได้ก่อน",

            confirmButtonColor:"#ff69b4"

        });

        return;

    }

    // ด่านที่ผ่านแล้ว
    if(stageNumber < gameSave.stage){

        Swal.fire({

            icon:"info",

            title:"ผ่านด่านนี้แล้ว",

            text:"เลือกด่านปัจจุบันเพื่อเล่นต่อ",

            confirmButtonColor:"#ff69b4"

        });

        return;

    }

    // เซฟด่านที่กำลังเล่น
    localStorage.setItem(

        "currentStage",

        stageNumber

    );

    location.href="quiz.html";

}

// =====================================================
// โหลดผลจาก Quiz
// =====================================================

const quizResult =
localStorage.getItem("quizResult");

if(quizResult){

    // โหลดข้อมูลล่าสุดจาก quiz.js
    gameSave =
    JSON.parse(localStorage.getItem("gameSave"));

    refreshHUD();

    createMap();

    localStorage.removeItem("quizResult");

}

// =====================================================
// Game Over
// =====================================================

if(gameSave.life<=0){

    Swal.fire({

        icon:"error",

        title:"เกมจบแล้ว",

        text:"หัวใจหมดแล้ว",

        confirmButtonColor:"#ff69b4",

        allowOutsideClick:false

    }).then(()=>{

        localStorage.removeItem("gameSave");
        localStorage.removeItem("currentStage");
        localStorage.removeItem("quizResult");

        location.href="../index.html";

    });

}

// =====================================================
// ผ่านทุกด่าน
// =====================================================

if(gameSave.complete.length>=mission.questionCount){

    Swal.fire({

        icon:"success",

        title:"ผ่านทุกด่าน 🎉",

        text:"ไปเปิดหีบสมบัติกัน",

        confirmButtonColor:"#ff69b4",

        allowOutsideClick:false

    }).then(()=>{

        location.href="treasure.html";

    });

}

// =====================================================
// ปรับตำแหน่งตัวละครเมื่อย่อหน้าจอ
// =====================================================

window.addEventListener("resize",()=>{

    movePlayer(gameSave.stage);

});

// =====================================================
// เซฟเกมเมื่อออกจากหน้า
// =====================================================

window.addEventListener("beforeunload",()=>{

    saveGame();

});

// =====================================================
// โหลดครั้งแรก
// =====================================================

refreshHUD();

createMap();

movePlayer(gameSave.stage);
