// =====================================================
// QUIZ + CHARACTER SKILLS
// =====================================================

const missions = JSON.parse(localStorage.getItem("missions")) || [];
const missionIndex = Number(localStorage.getItem("currentMission"));
const mission = missions[missionIndex];
const stage = Number(localStorage.getItem("currentStage"));
const player = JSON.parse(localStorage.getItem("player"));
let gameSave = JSON.parse(localStorage.getItem("gameSave"));

if(!mission || !gameSave || !player){
    location.href="map.html";
}else{
    startQuiz();
}

function startQuiz(){
    if(!Array.isArray(gameSave.complete)){
        gameSave.complete = [];
    }

    if(!Array.isArray(gameSave.wrongStages)){
        gameSave.wrongStages = [];
    }

    gameSave.keys = Number(gameSave.keys) || 0;
    gameSave.life = Number(gameSave.life) || 3;
    gameSave.skillUses = gameSave.skillUses || {};

    const question = mission.questions[stage - 1];
    const choiceButtons = Array.from(document.querySelectorAll(".choiceBtn"));
    const skillButton = document.getElementById("skillBtn");
    const skillCharacter = document.getElementById("skillCharacter");
    const effectCharacter = document.getElementById("effectCharacter");
    const skillEffect = document.getElementById("skillEffect");
    const skillConfig = getSkillConfig(player.id);
    const skillLimit = Number(mission.questionCount) >= 15 ? 2 : 1;
    let answered = false;
    let shieldActive = false;

    if(!question){
        location.href="map.html";
        return;
    }

    document.getElementById("questionNumber").textContent = `ข้อที่ ${stage}`;
    document.getElementById("questionText").textContent = question.question;

    const choiceTexts = [question.a,question.b,question.c,question.d];
    choiceButtons.forEach((button,index)=>{
        button.textContent = `${button.dataset.choice}. ${choiceTexts[index]}`;
        button.addEventListener("click",()=>{
            if(answered){
                return;
            }

            answered = true;
            checkAnswer(button.dataset.choice);
        });
    });

    skillCharacter.src = player.image;
    skillCharacter.alt = player.name;
    effectCharacter.src = player.image;
    document.getElementById("skillName").textContent = skillConfig.name;
    document.getElementById("skillDescription").textContent = skillConfig.description;
    document.getElementById("skillIcon").textContent = skillConfig.icon;
    document.getElementById("skillButtonText").textContent = "ใช้สกิล";

    refreshHUD();
    refreshSkillButton();

    skillButton.addEventListener("click",()=>{
        if(answered || remainingUses() <= 0){
            return;
        }

        useSkill();
    });

    function refreshHUD(){
        document.getElementById("heartBox").textContent = "♥".repeat(gameSave.life) || "0";
        document.getElementById("keyBox").textContent = `${gameSave.keys} / ${mission.questionCount}`;
    }

    function remainingUses(){
        const used = Number(gameSave.skillUses[player.id]) || 0;
        return Math.max(0,skillLimit - used);
    }

    function refreshSkillButton(){
        const remaining = remainingUses();
        document.getElementById("skillCount").textContent = `${remaining}/${skillLimit}`;
        skillButton.disabled = remaining <= 0 || answered;
        skillButton.title = remaining > 0 ? skillConfig.description : "ใช้สกิลครบแล้ว";
    }

    function consumeSkill(){
        gameSave.skillUses[player.id] = (Number(gameSave.skillUses[player.id]) || 0) + 1;
        saveGame();
        refreshSkillButton();
    }

    function useSkill(){
        consumeSkill();
        window.GameAudio?.play("skill");
        playSkillEffect(skillConfig.icon,skillConfig.castText);

        if(player.id === "monk"){
            eliminateWrongChoices(2);
            return;
        }

        if(player.id === "wizard"){
            answered = true;
            disableChoices();
            skillButton.disabled = true;

            window.setTimeout(()=>{
                completeStage(true);
                Swal.fire({
                    icon:"success",
                    title:"ข้ามด่านสำเร็จ! ✨",
                    text:"เวทมนตร์พาเจ้าผ่านคำถามนี้ พร้อมรับกุญแจ 1 ดอก",
                    confirmButtonColor:"#ff4f93"
                }).then(goAfterStage);
            },850);
            return;
        }

        if(player.id === "warrior"){
            shieldActive = true;
            document.getElementById("skillDescription").textContent = "โล่พร้อมแล้ว! ป้องกันการเสียหัวใจครั้งนี้";
            return;
        }

        if(player.id === "king"){
            gameSave.keys++;
            saveGame();
            refreshHUD();
            document.getElementById("skillDescription").textContent = "ได้รับกุญแจพระราชทานเพิ่ม 1 ดอก";
            return;
        }

        if(player.id === "musician"){
            showHint();
        }
    }

    function eliminateWrongChoices(amount){
        const wrongButtons = choiceButtons
            .filter(button=>button.dataset.choice !== String(question.answer).toUpperCase())
            .sort(()=>Math.random() - .5)
            .slice(0,amount);

        wrongButtons.forEach((button,index)=>{
            window.setTimeout(()=>{
                button.classList.add("eliminated");
                button.disabled = true;
            },300 + index * 180);
        });
    }

    function showHint(){
        const correctButton = choiceButtons.find(
            button=>button.dataset.choice === String(question.answer).toUpperCase()
        );

        if(!correctButton){
            return;
        }

        correctButton.classList.add("hintGlow");
        window.setTimeout(()=>{
            correctButton.classList.remove("hintGlow");
        },1800);
    }

    function checkAnswer(choice){
        disableChoices();
        skillButton.disabled = true;

        if(choice === String(question.answer).toUpperCase()){
            window.GameAudio?.play("correct");
            completeStage(true);
            localStorage.setItem("quizResult","correct");

            Swal.fire({
                icon:"success",
                title:"ตอบถูก! 🎉",
                text:"ได้รับกุญแจ 1 ดอก",
                confirmButtonColor:"#ff4f93"
            }).then(goAfterStage);
            return;
        }

        if(shieldActive){
            shieldActive = false;
            completeStage(false);
            localStorage.setItem("quizResult","wrong");
            playSkillEffect("🛡️","โล่ช่วยป้องกันหัวใจไว้!");
            window.GameAudio?.play("skill");

            Swal.fire({
                icon:"info",
                title:"โล่นักรบปกป้องไว้! 🛡️",
                text:"ตอบผิดครั้งนี้แต่หัวใจไม่ลด",
                confirmButtonColor:"#ff4f93"
            }).then(goAfterStage);
            return;
        }

        gameSave.life--;
        window.GameAudio?.play("wrong");
        completeStage(false);
        localStorage.setItem("quizResult","wrong");

        if(gameSave.life <= 0){
            Swal.fire({
                icon:"error",
                title:"เกมจบแล้ว",
                text:"หัวใจหมดแล้ว",
                confirmButtonColor:"#ff4f93"
            }).then(()=>{
                localStorage.removeItem("gameSave");
                localStorage.removeItem("currentStage");
                localStorage.removeItem("quizResult");
                location.href="../index.html";
            });
            return;
        }

        Swal.fire({
            icon:"error",
            title:"ตอบผิด",
            text:`เสียหัวใจ 1 ดวง เหลือ ${gameSave.life} ดวง และข้ามไปข้อถัดไป`,
            confirmButtonColor:"#ff4f93"
        }).then(goAfterStage);
    }

    function completeStage(awardKey){
        if(!gameSave.complete.includes(stage)){
            gameSave.complete.push(stage);

            if(awardKey){
                gameSave.keys++;
            }else if(!gameSave.wrongStages.includes(stage)){
                gameSave.wrongStages.push(stage);
            }
        }

        gameSave.stage = Math.max(Number(gameSave.stage) || 1,stage + 1);
        saveGame();
        refreshHUD();
    }

    function goAfterStage(){
        if(gameSave.complete.length >= mission.questionCount){
            location.href="treasure.html";
        }else{
            location.href="map.html";
        }
    }

    function disableChoices(){
        choiceButtons.forEach(button=>{
            button.disabled = true;
        });
    }

    function saveGame(){
        localStorage.setItem("gameSave",JSON.stringify(gameSave));
    }

    function playSkillEffect(icon,text){
        document.getElementById("effectIcon").textContent = icon;
        document.getElementById("effectText").textContent = text;

        const particleArea = skillEffect.querySelector(".skillParticles");
        particleArea.innerHTML = "";

        for(let index=0;index<14;index++){
            const particle = document.createElement("span");
            const angle = (Math.PI * 2 * index) / 14;
            const distance = 120 + (index % 3) * 28;

            particle.className = "particle";
            particle.textContent = index % 2 ? "✨" : icon;
            particle.style.setProperty("--x",`${Math.cos(angle) * distance}px`);
            particle.style.setProperty("--y",`${Math.sin(angle) * distance}px`);
            particleArea.appendChild(particle);
        }

        skillEffect.classList.add("show");
        window.setTimeout(()=>{
            skillEffect.classList.remove("show");
        },950);
    }
}

function getSkillConfig(characterId){
    const skills = {
        monk:{
            name:"สมาธิแห่งปัญญา",
            description:"ตัดตัวเลือกที่ผิดออก 2 ตัว",
            icon:"🪷",
            castText:"จิตนิ่ง มองเห็นคำตอบ",
            limit:1
        },
        wizard:{
            name:"เวทข้ามด่าน",
            description:"ข้ามคำถามพร้อมรับกุญแจ",
            icon:"🔮",
            castText:"เปิดประตูเวทมนตร์!",
            limit:1
        },
        warrior:{
            name:"โล่พิทักษ์หัวใจ",
            description:"ป้องกันการเสียหัวใจ 1 ครั้ง",
            icon:"🛡️",
            castText:"โล่หัวใจทำงาน!",
            limit:1
        },
        king:{
            name:"กุญแจพระราชทาน",
            description:"รับกุญแจโบนัสเพิ่ม 1 ดอก",
            icon:"👑",
            castText:"รับกุญแจจากพระราชา",
            limit:1
        },
        musician:{
            name:"ทำนองแห่งคำใบ้",
            description:"ส่องประกายคำตอบที่ถูกชั่วครู่",
            icon:"🎵",
            castText:"ฟังทำนองแห่งคำตอบ",
            limit:2
        }
    };

    return skills[characterId] || skills.monk;
}
