(() => {
    let audioContext = null;
    let enabled = localStorage.getItem("gameSound") !== "off";

    const soundPatterns = {
        ui:[
            {frequency:520,duration:.055,type:"sine",volume:.045},
            {frequency:680,duration:.07,type:"sine",volume:.04,delay:.04}
        ],
        correct:[
            {frequency:523,duration:.1,type:"triangle",volume:.065},
            {frequency:659,duration:.1,type:"triangle",volume:.065,delay:.09},
            {frequency:784,duration:.16,type:"triangle",volume:.07,delay:.18}
        ],
        wrong:[
            {frequency:260,duration:.13,type:"sawtooth",volume:.04},
            {frequency:190,duration:.2,type:"sawtooth",volume:.035,delay:.1}
        ],
        skill:[
            {frequency:440,duration:.09,type:"sine",volume:.05},
            {frequency:660,duration:.14,type:"sine",volume:.055,delay:.07},
            {frequency:880,duration:.2,type:"sine",volume:.05,delay:.15}
        ],
        chest:[
            {frequency:180,duration:.08,type:"square",volume:.025},
            {frequency:320,duration:.11,type:"triangle",volume:.05,delay:.06}
        ],
        letter:[
            {frequency:660,duration:.09,type:"sine",volume:.06},
            {frequency:880,duration:.16,type:"sine",volume:.055,delay:.08}
        ],
        empty:[
            {frequency:360,duration:.08,type:"sine",volume:.035},
            {frequency:280,duration:.12,type:"sine",volume:.03,delay:.07}
        ],
        trap:[
            {frequency:310,duration:.08,type:"square",volume:.035},
            {frequency:210,duration:.15,type:"square",volume:.03,delay:.07}
        ],
        bomb:[
            {frequency:130,duration:.25,type:"sawtooth",volume:.07},
            {frequency:75,duration:.42,type:"square",volume:.05,delay:.08}
        ],
        success:[
            {frequency:523,duration:.11,type:"triangle",volume:.06},
            {frequency:659,duration:.11,type:"triangle",volume:.06,delay:.1},
            {frequency:784,duration:.11,type:"triangle",volume:.065,delay:.2},
            {frequency:1047,duration:.28,type:"sine",volume:.07,delay:.3}
        ]
    };

    function getContext(){
        if(!audioContext){
            const Context = window.AudioContext || window.webkitAudioContext;

            if(!Context){
                return null;
            }

            audioContext = new Context();
        }

        if(audioContext.state === "suspended"){
            audioContext.resume();
        }

        return audioContext;
    }

    function playTone(context,tone){
        const start = context.currentTime + (tone.delay || 0);
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = tone.type || "sine";
        oscillator.frequency.setValueAtTime(tone.frequency,start);
        gain.gain.setValueAtTime(.0001,start);
        gain.gain.exponentialRampToValueAtTime(tone.volume || .04,start + .012);
        gain.gain.exponentialRampToValueAtTime(.0001,start + tone.duration);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + tone.duration + .03);
    }

    function play(name){
        if(!enabled){
            return;
        }

        const context = getContext();
        const pattern = soundPatterns[name] || soundPatterns.ui;

        if(!context){
            return;
        }

        pattern.forEach(tone=>playTone(context,tone));
    }

    function toggle(){
        enabled = !enabled;
        localStorage.setItem("gameSound",enabled ? "on" : "off");

        if(enabled){
            play("correct");
        }

        return enabled;
    }

    window.GameAudio = {
        play,
        toggle,
        isEnabled:()=>enabled
    };

    document.addEventListener("click",event=>{
        const button = event.target.closest("button");

        if(!button ||
            button.classList.contains("choiceBtn") ||
            button.classList.contains("chest") ||
            button.id === "skillBtn"){
            return;
        }

        play("ui");
    });
})();
