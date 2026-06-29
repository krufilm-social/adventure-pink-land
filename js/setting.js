// ==========================================
// Adventure Pink Land
// Global Setting Menu
// ==========================================

// ไม่แสดงในหน้าแรก
const page = location.pathname.split("/").pop();

if (page !== "index.html") {

document.body.insertAdjacentHTML("beforeend",`

<div class="setting">

    <button id="settingBtn">⚙️</button>

    <div id="settingMenu" class="settingMenu">

        <button id="resumeBtn">▶ เล่นต่อ</button>

        <button id="guideBtn">📖 คู่มือ</button>

        <button id="soundBtn">🔊 เสียง: เปิด</button>

        <button id="homeBtn">🏠 หน้าหลัก</button>

        <button id="restartBtn">🔄 เริ่มใหม่</button>

    </div>

</div>

`);

const settingBtn = document.getElementById("settingBtn");
const settingMenu = document.getElementById("settingMenu");

// เปิด/ปิดเมนู
settingBtn.addEventListener("click",(e)=>{

    e.stopPropagation();

    settingMenu.classList.toggle("show");

});

// ปิดเมนูเมื่อคลิกที่อื่น
document.addEventListener("click",()=>{

    settingMenu.classList.remove("show");

});

// คลิกในเมนูไม่ให้ปิด
settingMenu.addEventListener("click",(e)=>{

    e.stopPropagation();

});

// เล่นต่อ
document.getElementById("resumeBtn").onclick=()=>{

    settingMenu.classList.remove("show");

};

// คู่มือ
document.getElementById("guideBtn").onclick=()=>{

    showGameGuide();

};

const soundBtn = document.getElementById("soundBtn");

function refreshSoundButton(){
    const soundOn = !window.GameAudio || window.GameAudio.isEnabled();
    soundBtn.textContent = soundOn ? "🔊 เสียง: เปิด" : "🔇 เสียง: ปิด";
}

soundBtn.onclick=()=>{
    if(window.GameAudio){
        window.GameAudio.toggle();
    }

    refreshSoundButton();
};

refreshSoundButton();

// หน้าหลัก
document.getElementById("homeBtn").onclick=()=>{

    Swal.fire({

        title:"กลับหน้าหลัก ?",

        icon:"question",

        showCancelButton:true,

        confirmButtonText:"ตกลง",

        cancelButtonText:"ยกเลิก",

        confirmButtonColor:"#ff69b4"

    }).then((result)=>{

        if(result.isConfirmed){

            localStorage.removeItem("gameSave");

            location.href="../index.html";

        }

    });

};

// เริ่มใหม่
document.getElementById("restartBtn").onclick=()=>{

    Swal.fire({

        title:"เริ่มเกมใหม่ ?",

        text:"ข้อมูลการเล่นปัจจุบันจะหาย",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"เริ่มใหม่",

        cancelButtonText:"ยกเลิก",

        confirmButtonColor:"#ff69b4"

    }).then((result)=>{

        if(result.isConfirmed){

            localStorage.removeItem("gameSave");

            location.reload();

        }

    });

};

}
