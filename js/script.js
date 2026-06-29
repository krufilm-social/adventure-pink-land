// ==========================================
// หน้าแรก (index.html)
// ==========================================

// เริ่มผจญภัย
document.getElementById("startBtn").addEventListener("click", () => {

    const missions = JSON.parse(localStorage.getItem("missions")) || [];

    if (missions.length === 0) {

        Swal.fire({

            icon: "warning",

            title: "ยังไม่มีภารกิจ",

            text: "กรุณาสร้างภารกิจในเมนู 'จัดการระบบ' ก่อน",

            confirmButtonColor: "#ff69b4"

        });

        return;

    }

    // ใช้ภารกิจล่าสุด
    localStorage.setItem("currentMission", missions.length - 1);

    location.href = "pages/character.html";

});

// ==========================================
// จัดการระบบ
// ==========================================

document.getElementById("systemBtn").addEventListener("click", () => {

    location.href = "pages/system.html";

});

// ==========================================
// คู่มือ
// ==========================================

document.getElementById("guideBtn").addEventListener("click", () => {

    showGameGuide();

});

// ==========================================
// ออกจากเกม
// ==========================================

document.getElementById("exitBtn").addEventListener("click", () => {

    Swal.fire({

        title: "ออกจากเกม ?",

        icon: "question",

        showCancelButton: true,

        confirmButtonText: "ออก",

        cancelButtonText: "ยกเลิก",

        confirmButtonColor: "#ff69b4"

    }).then((result) => {

        if (result.isConfirmed) {

            window.close();

        }

    });

});
