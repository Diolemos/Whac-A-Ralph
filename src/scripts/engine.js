const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".ememy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        highScore: document.querySelector("#high-score")
    },
    values:{
        
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        highScore: 0 
    },
    actions: {
        timerId:setInterval(randomSquare, 1000),
        countdownTimerId: setInterval(countdown, 1000),
    }
};
function countdown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
    if(state.values.currentTime <= 0) {
        clearInterval(state.actions.countdownTimerId)
        clearInterval(state.actions.timerId)
    //check for highest score
     if (state.values.result > state.values.highScore) {
            state.values.highScore = state.values.result;
            localStorage.setItem("highScore", state.values.highScore);
        } 
       alert("Game ove! Your score: "+state.values.result);
    }
}
function playSound(audioName){
    let audio = new Audio(`./src/audio/${audioName}.m4a`)
    audio.volume = 0.2;
    audio.play();
}

function randomSquare(){
    state.view.squares.forEach((square)=>{
        square.classList.remove("enemy");
        square.classList.remove("flash");
    });
    let randomNumber = Math.floor(Math.random()*9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    randomSquare.classList.add("flash")
    // Force reflow to restart animation even if it's the same square
    void randomSquare.offsetWidth;
      setTimeout(() => {
        randomSquare.classList.remove("flash");
    }, 300);
    state.values.hitPosition = randomSquare.id;
}

// function moveEnemy(){
//     state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
// }

function addListenerHitbox(){
    state.view.squares.forEach((square)=>{
        square.addEventListener("mousedown",()=>{
            if(square.id=== state.values.hitPosition){
                state.values.result++
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            };
        })
    })
}
function loadHighScore() {
    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore) {
        state.values.highScore = parseInt(savedHighScore);
        state.view.highScore.textContent = state.values.highScore;
    }
}
function init(){
    loadHighScore();
    //moveEnemy();
    addListenerHitbox();
}

init();