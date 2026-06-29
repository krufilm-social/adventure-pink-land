// =====================================================
// TREASURE GAME
// =====================================================

const missions = JSON.parse(localStorage.getItem("missions")) || [];
const currentMission = Number(localStorage.getItem("currentMission"));
const mission = missions[currentMission];
let gameSave = JSON.parse(localStorage.getItem("gameSave"));

const heartBox = document.getElementById("heartBox");
const keyBox = document.getElementById("keyBox");
const chestArea = document.getElementById("chestArea");
const collectLetters = document.getElementById("collectLetters");
const answerBtn = document.getElementById("answerBtn");
const popup = document.getElementById("letterPopup");
const popupLetter = document.getElementById("popupLetter");
const effectArea = document.getElementById("effectArea");

if(!mission || !gameSave){
    showChibiAlert({
        icon:"warning",
        title:"ยังไม่มีข้อมูลการผจญภัย",
        text:"กรุณาเลือกภารกิจและเล่นด่านคำถามก่อนเปิดหีบสมบัติ",
        allowOutsideClick:false
    }).then(()=>{
        location.href="../index.html";
    });
}else{
    startTreasureGame();
}

function startTreasureGame(){
    const letters = Array.isArray(mission.letters) && mission.letters.length
        ? [...mission.letters]
        : Array.from(String(mission.finalWord || "").replace(/\s/g,""));

    /*
       หีบต้องมากกว่ากุญแจ 1–2 ใบเสมอ และต้องมีพื้นที่พอสำหรับ
       ตัวอักษร + หีบเปล่าอย่างน้อย 1 + กับดักกุญแจ 2 + ระเบิด 1
    */
    const extraChestCount = Math.random() < .5 ? 1 : 2;
    const minimumChestCount = letters.length + 4;
    const minimumKeys = Math.max(0,minimumChestCount - extraChestCount);

    if(Number(gameSave.keys) < minimumKeys){
        gameSave.keys = minimumKeys;
        saveGame();
    }

    const totalChestCount = Number(gameSave.keys) + extraChestCount;
    const chestData = createChestData(letters,totalChestCount);
    const collected = [];
    let popupTimer = null;
    let isShowingReward = false;
    let gameEnded = false;

    refreshHUD();
    createLetterSlots(letters.length);
    createChests(chestData);
    updateAnswerButton();

    answerBtn.addEventListener("click",()=>{
        if(answerBtn.disabled || gameEnded){
            return;
        }

        localStorage.setItem("collectLetters",JSON.stringify(collected));
        localStorage.setItem("correctAnswer",mission.finalWord);
        location.href="answer.html";
    });

    function refreshHUD(){
        const life = Math.max(0,Number(gameSave.life) || 0);
        const keys = Math.max(0,Number(gameSave.keys) || 0);

        heartBox.textContent = "♥".repeat(life) || "0";
        keyBox.textContent = keys;
    }

    function createChestData(letterList,total){
        const fixedChests = [
            ...letterList.map(letter=>({
                type:"letter",
                value:letter,
                opened:false
            })),
            {type:"keyTrap",value:"",opened:false},
            {type:"keyTrap",value:"",opened:false},
            {type:"bomb",value:"",opened:false},
            {type:"empty",value:"",opened:false}
        ];

        while(fixedChests.length < total){
            fixedChests.push({
                type:"empty",
                value:"",
                opened:false
            });
        }

        for(let index=fixedChests.length-1;index>0;index--){
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [fixedChests[index],fixedChests[randomIndex]] =
                [fixedChests[randomIndex],fixedChests[index]];
        }

        return fixedChests;
    }

    function createLetterSlots(total){
        collectLetters.innerHTML = "";

        for(let index=0;index<total;index++){
            const slot = document.createElement("div");
            slot.className = "letterSlot";
            slot.dataset.slot = index;
            slot.textContent = "·";
            slot.setAttribute("aria-label",`ช่องตัวอักษรที่ ${index + 1}`);
            collectLetters.appendChild(slot);
        }
    }

    function createChests(data){
        chestArea.innerHTML = "";
        chestArea.classList.toggle("compact",data.length > 10);
        chestArea.classList.toggle("dense",data.length > 15);

        const maxPerRow = data.length <= 8
            ? 4
            : Math.min(6,Math.ceil(Math.sqrt(data.length)));
        let index = 0;

        while(index < data.length){
            const row = document.createElement("div");
            row.className = "chestRow";
            const count = Math.min(maxPerRow,data.length - index);

            for(let position=0;position<count;position++){
                const chestIndex = index;
                const chest = document.createElement("button");
                const image = document.createElement("img");

                chest.className = "chest";
                chest.type = "button";
                chest.setAttribute("aria-label",`เปิดหีบสมบัติใบที่ ${chestIndex + 1}`);
                chest.style.setProperty("--float-delay",`${-(chestIndex % 5) * .34}s`);
                chest.style.setProperty("--float-time",`${2.7 + (chestIndex % 4) * .23}s`);

                image.src = "../images/chest-close.png";
                image.alt = "";
                chest.appendChild(image);

                chest.addEventListener("click",()=>{
                    openChest(chestIndex,chest,image,data);
                });

                row.appendChild(chest);
                index++;
            }

            chestArea.appendChild(row);
        }
    }

    function openChest(index,chest,image,data){
        const chestItem = data[index];

        if(chestItem.opened || isShowingReward || gameEnded){
            return;
        }

        if(Number(gameSave.keys) <= 0){
            showChibiAlert({
                icon:"warning",
                title:"กุญแจหมดแล้ว",
                text:"ไม่มีกุญแจสำหรับเปิดหีบเพิ่มแล้ว"
            });
            return;
        }

        // ทุกหีบใช้กุญแจ 1 ดอกทันที
        gameSave.keys = Math.max(0,Number(gameSave.keys) - 1);
        saveGame();
        refreshHUD();
        window.GameAudio?.play("chest");

        chestItem.opened = true;
        chest.disabled = true;
        chest.classList.add("opening");
        image.src = "../images/chest-open.png";

        window.setTimeout(()=>{
            chest.classList.remove("opening");
            chest.classList.add("opened");
        },520);

        if(chestItem.type === "letter"){
            const slotIndex = collected.length;
            collected.push(chestItem.value);
            revealChestResult(chest,chestItem.value,"letter");
            window.GameAudio?.play("letter");
            showLetterReward(chestItem.value,slotIndex);
        }else if(chestItem.type === "keyTrap"){
            openKeyTrap(chest);
        }else if(chestItem.type === "bomb"){
            openBomb(chest);
        }else{
            revealChestResult(chest,"🫧","empty");
            showEmptyChest(chest);
        }

        updateAnswerButton();
    }

    function openKeyTrap(chest){
        const lostExtraKey = Number(gameSave.keys) > 0 ? 1 : 0;

        gameSave.keys = Math.max(0,Number(gameSave.keys) - lostExtraKey);
        saveGame();
        refreshHUD();
        revealChestResult(chest,"🔑−","trap");
        window.GameAudio?.play("trap");

        showChibiAlert({
            icon:"warning",
            title:"หีบกับดักกุญแจ!",
            text:lostExtraKey
                ? "กับดักดูดกุญแจเพิ่มไปอีก 1 ดอก"
                : "โชคดีที่ไม่มีกุญแจเหลือให้กับดักขโมยแล้ว"
        });
    }

    function openBomb(chest){
        const lostKeys = Math.min(3,Math.max(0,Number(gameSave.keys)));

        gameSave.keys = Math.max(0,Number(gameSave.keys) - 3);
        saveGame();
        refreshHUD();
        revealChestResult(chest,"💣","bomb");
        createExplosion(chest);
        window.GameAudio?.play("bomb");

        window.setTimeout(()=>{
            showChibiAlert({
                icon:"warning",
                title:"บึ้ม! กับดักระเบิด 💥",
                text:lostKeys > 0
                    ? `แรงระเบิดทำให้กุญแจหายเพิ่ม ${lostKeys} ดอก`
                    : "โชคดีที่ไม่มีกุญแจเหลือให้แรงระเบิดพัดหาย"
            });
        },620);
    }

    function revealChestResult(chest,symbol,type){
        const badge = document.createElement("span");
        badge.className = `chestResultBadge ${type}`;
        badge.textContent = symbol;
        chest.appendChild(badge);
        chest.classList.add(`result-${type}`);
    }

    function showLetterReward(letter,slotIndex){
        isShowingReward = true;
        window.clearTimeout(popupTimer);
        popupLetter.textContent = letter;
        popup.classList.add("show");

        window.setTimeout(()=>{
            flyLetterToSlot(letter,slotIndex);
        },650);

        popupTimer = window.setTimeout(()=>{
            popup.classList.remove("show");
            isShowingReward = false;
        },1120);
    }

    function flyLetterToSlot(letter,slotIndex){
        const target = collectLetters.querySelector(`[data-slot="${slotIndex}"]`);

        if(!target){
            return;
        }

        const startBox = popupLetter.getBoundingClientRect();
        const targetBox = target.getBoundingClientRect();
        const flying = document.createElement("div");

        flying.className = "flyingLetter";
        flying.textContent = letter;
        flying.style.left = `${startBox.left}px`;
        flying.style.top = `${startBox.top}px`;
        flying.style.width = `${startBox.width}px`;
        flying.style.height = `${startBox.height}px`;
        effectArea.appendChild(flying);

        requestAnimationFrame(()=>{
            flying.style.left = `${targetBox.left}px`;
            flying.style.top = `${targetBox.top}px`;
            flying.style.width = `${targetBox.width}px`;
            flying.style.height = `${targetBox.height}px`;
            flying.style.fontSize = getComputedStyle(target).fontSize;
            flying.style.transform = "rotate(360deg)";
        });

        window.setTimeout(()=>{
            target.textContent = letter;
            target.classList.add("found");
            flying.remove();
            updateAnswerButton();
        },740);
    }

    function showEmptyChest(chest){
        chest.animate(
            [
                {transform:"translateX(0)"},
                {transform:"translateX(-9px) rotate(-3deg)"},
                {transform:"translateX(9px) rotate(3deg)"},
                {transform:"translateX(0)"}
            ],
            {duration:430,easing:"ease-out"}
        );

        showChibiAlert({
            icon:"info",
            title:"หีบฟองอากาศ",
            text:"หีบใบนี้ว่างเปล่า ลองเสี่ยงโชคกับใบอื่นนะ",
            timer:1150,
            timerProgressBar:true,
            showConfirmButton:false
        });
        window.GameAudio?.play("empty");
    }

    function createExplosion(chest){
        const box = chest.getBoundingClientRect();
        const explosion = document.createElement("div");

        explosion.className = "bombExplosion";
        explosion.textContent = "💥";
        explosion.style.left = `${box.left + box.width / 2}px`;
        explosion.style.top = `${box.top + box.height / 2}px`;
        effectArea.appendChild(explosion);

        for(let index=0;index<12;index++){
            const spark = document.createElement("span");
            const angle = (Math.PI * 2 * index) / 12;
            const distance = 80 + (index % 3) * 28;

            spark.className = "bombSpark";
            spark.textContent = index % 2 ? "✨" : "💥";
            spark.style.left = `${box.left + box.width / 2}px`;
            spark.style.top = `${box.top + box.height / 2}px`;
            spark.style.setProperty("--spark-x",`${Math.cos(angle) * distance}px`);
            spark.style.setProperty("--spark-y",`${Math.sin(angle) * distance}px`);
            effectArea.appendChild(spark);
            window.setTimeout(()=>spark.remove(),900);
        }

        window.setTimeout(()=>explosion.remove(),900);
    }

    function updateAnswerButton(){
        const hasLetters = collected.length > 0;
        answerBtn.disabled = !hasLetters || gameEnded;
        answerBtn.title = hasLetters
            ? "นำตัวอักษรที่พบไปลองเรียงคำ"
            : "ค้นหาตัวอักษรอย่างน้อย 1 ชิ้นก่อน";
    }

    function saveGame(){
        localStorage.setItem("gameSave",JSON.stringify(gameSave));
    }
}

function showChibiAlert(options){
    return Swal.fire({
        confirmButtonColor:"#ff4f93",
        customClass:{popup:"chibiPopup"},
        ...options
    });
}
