const collectedLetters = JSON.parse(localStorage.getItem("collectLetters")) || [];
const correctAnswer = localStorage.getItem("correctAnswer") || "";
const expectedLetters = correctAnswer.trim().split(/\s+/).filter(Boolean);
const answerMissions = JSON.parse(localStorage.getItem("missions")) || [];
const answerMission = answerMissions[Number(localStorage.getItem("currentMission"))];
const targetSlotCount = Array.isArray(answerMission?.letters) && answerMission.letters.length
    ? answerMission.letters.length
    : Math.max(expectedLetters.length,collectedLetters.length);

const answerSlots = document.getElementById("answerSlots");
const letterBank = document.getElementById("letterBank");
const resetBtn = document.getElementById("resetBtn");
const checkBtn = document.getElementById("checkBtn");
const answerCard = document.querySelector(".answerCard");
const guessInput = document.getElementById("guessInput");

let bankLetters = shuffle([...collectedLetters]);
let arrangedLetters = Array(targetSlotCount).fill(null);

if(!correctAnswer || bankLetters.length === 0){
    Swal.fire({
        icon:"warning",
        title:"ยังไม่มีตัวอักษรสำหรับเรียงคำ",
        text:"กลับไปเปิดหีบสมบัติเพื่อค้นหาตัวอักษรก่อนนะ",
        confirmButtonColor:"#ff4f93",
        allowOutsideClick:false
    }).then(()=>{
        location.href="treasure.html";
    });
}else{
    render();
}

resetBtn.addEventListener("click",()=>{
    bankLetters = shuffle([...collectedLetters]);
    arrangedLetters = Array(targetSlotCount).fill(null);
    guessInput.value = "";
    render();
});

checkBtn.addEventListener("click",()=>{
    const typedAnswer = normalizeAnswer(guessInput.value);
    const playerAnswer = typedAnswer || normalizeAnswer(arrangedLetters.join(""));
    const expectedAnswer = normalizeAnswer(correctAnswer);

    if(playerAnswer === expectedAnswer){
        window.GameAudio?.play("success");
        Swal.fire({
            icon:"success",
            title:"เรียงคำสำเร็จ! 🎉",
            text:`คำตอบคือ “${correctAnswer}”`,
            confirmButtonText:"กลับหน้าแรก",
            confirmButtonColor:"#ff4f93",
            allowOutsideClick:false
        }).then(()=>{
            localStorage.removeItem("collectLetters");
            localStorage.removeItem("correctAnswer");
            location.href="../index.html";
        });
        return;
    }

    answerCard.classList.remove("shake");
    void answerCard.offsetWidth;
    answerCard.classList.add("shake");
    window.GameAudio?.play("wrong");

    Swal.fire({
        icon:"error",
        title:"ยังไม่ใช่คำตอบนี้",
        text:"ลองสลับตำแหน่งตัวอักษรอีกครั้งนะ",
        confirmButtonText:"ลองใหม่",
        confirmButtonColor:"#ff4f93"
    });
});

guessInput.addEventListener("input",()=>{
    renderSlots();
    checkBtn.disabled = normalizeAnswer(guessInput.value) === "" &&
        arrangedLetters.some(letter=>letter === null);
});

guessInput.addEventListener("keydown",event=>{
    if(event.key === "Enter" && !checkBtn.disabled){
        checkBtn.click();
    }
});

function render(){
    renderSlots();
    renderBank();
    checkBtn.disabled = normalizeAnswer(guessInput.value) === "" &&
        arrangedLetters.some(letter=>letter === null);
}

function renderSlots(){
    answerSlots.innerHTML = "";
    const typedLetters = splitTypedLetters(guessInput.value);

    arrangedLetters.forEach((letter,index)=>{
        const typedLetter = typedLetters[index] || null;
        const visibleLetter = typedLetter || letter;
        const slot = document.createElement("button");
        slot.type = "button";
        slot.className = `answerSlot${visibleLetter === null ? "" : " filled"}${typedLetter ? " typed" : ""}`;
        slot.textContent = visibleLetter || "";
        slot.setAttribute("aria-label",typedLetter
            ? `ตัวอักษรที่พิมพ์ ${typedLetter} ในช่องที่ ${index + 1}`
            : letter
            ? `นำตัวอักษร ${letter} ออกจากช่องที่ ${index + 1}`
            : `ช่องคำตอบที่ ${index + 1}`);
        slot.disabled = typedLetter !== null || letter === null;

        slot.addEventListener("click",()=>{
            if(typedLetter){
                return;
            }

            bankLetters.push(letter);
            arrangedLetters[index] = null;
            render();
        });

        answerSlots.appendChild(slot);
    });
}

function renderBank(){
    letterBank.innerHTML = "";

    bankLetters.forEach((letter,index)=>{
        const button = document.createElement("button");
        button.type = "button";
        button.className = "bankLetter";
        button.textContent = letter;
        button.setAttribute("aria-label",`วางตัวอักษร ${letter} ลงในคำตอบ`);

        button.addEventListener("click",()=>{
            window.GameAudio?.play("ui");
            const emptyIndex = arrangedLetters.findIndex(item=>item === null);

            if(emptyIndex === -1){
                return;
            }

            arrangedLetters[emptyIndex] = letter;
            bankLetters.splice(index,1);
            render();
        });

        letterBank.appendChild(button);
    });
}

function shuffle(items){
    for(let index=items.length-1;index>0;index--){
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [items[index],items[randomIndex]] = [items[randomIndex],items[index]];
    }

    return items;
}

function normalizeAnswer(value){
    return String(value || "")
        .replace(/\s/g,"")
        .toLocaleLowerCase("th");
}

function splitTypedLetters(value){
    const cleanValue = String(value || "").replace(/\s/g,"");

    if(typeof Intl !== "undefined" && Intl.Segmenter){
        const segmenter = new Intl.Segmenter("th",{granularity:"grapheme"});
        return Array.from(segmenter.segment(cleanValue),item=>item.segment);
    }

    return Array.from(cleanValue);
}
