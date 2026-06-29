const missionList = document.getElementById("missionList");

let missions = JSON.parse(localStorage.getItem("missions")) || [];


render();

// =======================
// แสดงรายการภารกิจ
// =======================
function render() {

    missionList.innerHTML = "";

    if (missions.length === 0) {

        missionList.innerHTML = `
            <h2 style="text-align:center;color:#666;">
                ยังไม่มีภารกิจ
            </h2>
        `;

        return;
    }

    missions.forEach((mission, index) => {

        missionList.innerHTML += `

        <div class="missionCard">

            <h2>${mission.missionName}</h2>

            <p>จำนวนคำถาม ${mission.questionCount} ข้อ</p>

            <div class="buttons">

                <button class="playBtn"
                    onclick="playMission(${index})">
                    ▶ เล่น
                </button>

                <button class="editBtn"
                    onclick="editMission(${index})">
                    ✏️ แก้ไข
                </button>

                <button class="deleteBtn"
                    onclick="deleteMission(${index})">
                    🗑️ ลบ
                </button>

            </div>

        </div>

        `;

    });

}

// =======================
// เล่นภารกิจ
// =======================
function playMission(index) {

    localStorage.setItem("currentMission", index);

    location.href = "character.html";

}

// =======================
// แก้ไขภารกิจ
// =======================
function editMission(index) {

    localStorage.setItem("editMission", index);

    location.href = "create.html";

}

// =======================
// ลบภารกิจ
// =======================
function deleteMission(index) {

    Swal.fire({

        title: "ลบภารกิจ ?",
        text: "เมื่อลบแล้วไม่สามารถกู้คืนได้",
        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#ff4da7",
        cancelButtonColor: "#999",

        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก"

    }).then((result) => {

        if (result.isConfirmed) {

            missions.splice(index, 1);

            localStorage.setItem(
                "missions",
                JSON.stringify(missions)
            );

            render();

            Swal.fire({

                icon: "success",
                title: "ลบเรียบร้อย",
                confirmButtonColor: "#ff69b4"

            });

        }

    });

}

// =======================
// กลับหน้าหลัก
// =======================
document.getElementById("backBtn").onclick = () => {

    location.href = "../index.html";

};