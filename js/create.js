// =====================================================
// CREATE.JS
// ตอนที่ 1/2
// Adventure Pink Land
// =====================================================

// -----------------------------------------------------
// ตัวแปร
// -----------------------------------------------------

let totalQuestions = 5;

const questionArea =
document.getElementById("questionArea");

const generateBtn =
document.getElementById("generateBtn");

const splitBtn =
document.getElementById("splitBtn");

const pieceArea =
document.getElementById("pieceArea");

// =====================================================
// สร้างคำถาม
// =====================================================

generateBtn.addEventListener("click",()=>{

    totalQuestions =
    Number(

        document.getElementById("questionTotal").value

    );

    if(

        isNaN(totalQuestions) ||

        totalQuestions<5

    ){

        Swal.fire({

            icon:"warning",

            title:"จำนวนคำถามไม่ถูกต้อง",

            text:"จำนวนคำถามต้องไม่น้อยกว่า 5 ข้อ",

            confirmButtonColor:"#ff69b4"

        });

        return;

    }

    createQuestions();

});

// =====================================================
// แยกตัวอักษร
// =====================================================

splitBtn.addEventListener("click",()=>{

    const word =
    document.getElementById("finalWord")
    .value
    .trim();

    if(word===""){

        Swal.fire({

            icon:"warning",

            title:"ยังไม่ได้กำหนดคำ",

            text:"กรุณาพิมพ์คำที่ต้องเรียง",

            confirmButtonColor:"#ff69b4"

        });

        return;

    }

    createPieces(word);

});

// =====================================================
// สร้างคำถาม
// =====================================================

function createQuestions(){

    questionArea.innerHTML="";

    for(

        let i=1;

        i<=totalQuestions;

        i++

    ){

        const card=

        document.createElement("div");

        card.className="questionCard";

        card.innerHTML=`

        <h2>ข้อที่ ${i}</h2>

        <input
        class="question"
        placeholder="พิมพ์คำถาม">

        <input
        class="choice"
        placeholder="ตัวเลือก A">

        <input
        class="choice"
        placeholder="ตัวเลือก B">

        <input
        class="choice"
        placeholder="ตัวเลือก C">

        <input
        class="choice"
        placeholder="ตัวเลือก D">

        <select class="answer">

            <option value="A">

                เฉลย A

            </option>

            <option value="B">

                เฉลย B

            </option>

            <option value="C">

                เฉลย C

            </option>

            <option value="D">

                เฉลย D

            </option>

        </select>

        `;

        questionArea.appendChild(card);

    }

}

// =====================================================
// แยกตัวอักษร
// =====================================================

function createPieces(word){

    pieceArea.innerHTML="";

    const letters=

    word

    .trim()

    .split(/\s+/)

    .filter(Boolean);

    letters.forEach(letter=>{

        const input=

        document.createElement("input");

        input.className="piece";

        input.value=letter;

        input.readOnly=true;

        pieceArea.appendChild(input);

    });

}

// =====================================================
// ปุ่มกลับ
// =====================================================

document.getElementById("backBtn")

.addEventListener("click",()=>{

    localStorage.removeItem(

        "editMission"

    );

    location.href="system.html";

});

// =====================================================
// โหลดข้อมูลเดิม
// =====================================================

window.addEventListener("load",()=>{

    const editIndex=

    localStorage.getItem(

        "editMission"

    );

    if(editIndex===null){

        return;

    }

    const missions=

    JSON.parse(

        localStorage.getItem("missions")

    ) || [];

    const mission=

    missions[editIndex];

    if(!mission){

        return;

    }

    document.getElementById("missionName").value=

    mission.missionName;

    document.getElementById("questionTotal").value=

    mission.questionCount;

    document.getElementById("finalWord").value=

    Array.isArray(mission.letters) && mission.letters.length

    ? mission.letters.join(" ")

    : mission.finalWord;

    totalQuestions=

    mission.questionCount;

    createQuestions();

    createPieces(

        document.getElementById("finalWord").value

    );

    const cards=

    document.querySelectorAll(

        ".questionCard"

    );

    mission.questions.forEach((q,index)=>{

        const inputs=

        cards[index]

        .querySelectorAll("input");

        inputs[0].value=q.question;

        inputs[1].value=q.a;

        inputs[2].value=q.b;

        inputs[3].value=q.c;

        inputs[4].value=q.d;

        cards[index]

        .querySelector("select")

        .value=q.answer;

    });

});

// =====================================================
// ปุ่มบันทึกภารกิจ
// =====================================================

document.getElementById("saveBtn")

.addEventListener("click",()=>{

    const missionName=

    document.getElementById("missionName")

    .value.trim();

    const finalWord=

    document.getElementById("finalWord")

    .value.trim();

    // -------------------------
    // ตรวจสอบข้อมูล
    // -------------------------

    if(missionName===""){

        Swal.fire({

            icon:"warning",

            title:"ยังไม่ได้ตั้งชื่อภารกิจ",

            text:"กรุณากรอกชื่อภารกิจก่อน",

            confirmButtonColor:"#ff69b4"

        });

        return;

    }

    if(finalWord===""){

        Swal.fire({

            icon:"warning",

            title:"ยังไม่ได้กำหนดคำ",

            text:"กรุณาพิมพ์คำที่ต้องเรียง",

            confirmButtonColor:"#ff69b4"

        });

        return;

    }

    if(document.querySelectorAll(".questionCard").length===0){

        Swal.fire({

            icon:"warning",

            title:"ยังไม่ได้สร้างคำถาม",

            text:"กรุณากดปุ่มสร้างคำถามก่อน",

            confirmButtonColor:"#ff69b4"

        });

        return;

    }

    // -------------------------
    // คำถาม
    // -------------------------

    const questions=[];

    document

    .querySelectorAll(".questionCard")

    .forEach(card=>{

        const inputs=

        card.querySelectorAll("input");

        questions.push({

            question:inputs[0].value.trim(),

            a:inputs[1].value.trim(),

            b:inputs[2].value.trim(),

            c:inputs[3].value.trim(),

            d:inputs[4].value.trim(),

            answer:

            card.querySelector("select").value

        });

    });

    // -------------------------
    // ตัวอักษร
    // -------------------------

    const letters=

    finalWord

    .split(/\s+/)

    .filter(Boolean);

    // -------------------------
    // สร้าง Mission
    // -------------------------

    const mission={

        missionName,

        questionCount:totalQuestions,

        finalWord,

        letters,

        questions

    };

    // -------------------------
    // โหลดข้อมูลเดิม
    // -------------------------

    let missions=

    JSON.parse(

        localStorage.getItem("missions")

    ) || [];

    const editIndex=

    localStorage.getItem(

        "editMission"

    );

    // -------------------------
    // เพิ่ม / แก้ไข
    // -------------------------

    if(editIndex===null){

        missions.push(mission);

    }

    else{

        missions[Number(editIndex)]=mission;

        localStorage.removeItem(

            "editMission"

        );

    }

    // -------------------------
    // บันทึก
    // -------------------------

    localStorage.setItem(

        "missions",

        JSON.stringify(missions)

    );

    const currentIndex=

    editIndex===null

    ? missions.length-1

    : Number(editIndex);

    localStorage.setItem(

        "currentMission",

        currentIndex

    );

    // -------------------------
    // เสร็จสิ้น
    // -------------------------

    Swal.fire({

        icon:"success",

        title:"บันทึกสำเร็จ 🎉",

        text:"บันทึกภารกิจเรียบร้อยแล้ว",

        confirmButtonColor:"#ff69b4"

    }).then(()=>{

        location.href="load.html";

    });

});
