// ======================================================
// GAME.JS
// ศูนย์กลางข้อมูลของเกม
// ======================================================

const Game = {

    // ----------------------------
    // PLAYER
    // ----------------------------

    getPlayer(){

        return JSON.parse(
            localStorage.getItem("player")
        );

    },

    setPlayer(player){

        localStorage.setItem(

            "player",

            JSON.stringify(player)

        );

    },

    // ----------------------------
    // MISSION
    // ----------------------------

    getMission(){

        const missions =
        JSON.parse(localStorage.getItem("missions")) || [];

        const index =
        Number(localStorage.getItem("currentMission"));

        return missions[index];

    },

    // ----------------------------
    // SAVE
    // ----------------------------

    getSave(){

        return JSON.parse(
            localStorage.getItem("gameSave")
        );

    },

    save(save){

        localStorage.setItem(

            "gameSave",

            JSON.stringify(save)

        );

    },

    // ----------------------------
    // STAGE
    // ----------------------------

    getStage(){

        return Number(
            localStorage.getItem("currentStage")
        );

    },

    setStage(stage){

        localStorage.setItem(

            "currentStage",

            stage

        );

    },

    // ----------------------------
    // Quiz Result
    // ----------------------------

    getQuizResult(){

        return localStorage.getItem(
            "quizResult"
        );

    },

    setQuizResult(result){

        localStorage.setItem(

            "quizResult",

            result

        );

    },

    clearQuizResult(){

        localStorage.removeItem(
            "quizResult"
        );

    },

    // ----------------------------
    // Reset Game
    // ----------------------------

    reset(){

        localStorage.removeItem("gameSave");

        localStorage.removeItem("currentStage");

        localStorage.removeItem("quizResult");

    }

};