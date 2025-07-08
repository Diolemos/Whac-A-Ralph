const state = {
    view: {
        panel: document.querySelector(".panel"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        highScore: document.querySelector("#high-score"),
        playButton: document.querySelector("#play-btn"),
        squares: [],
        backdrop: document.querySelector("#backdrop"),
        gameOverBox: document.querySelector("#game-over-box"),
        finalScore: document.querySelector("#final-score"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: null,
        result: 0,
        currentTime: 10,
        highScore: 0,
        gameIsActive: false

    },
    actions: {
        timerId: null,
        countdownTimerId: null
    }
};

function countdown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
    if(state.values.currentTime <= 0) {
  
        clearInterval(state.actions.countdownTimerId)
        clearInterval(state.actions.timerId)
         state.values.gameIsActive = false; 
               state.view.squares.forEach(square => {
    square.classList.remove("enemy");
    square.classList.add("disabled");
    state.view.backdrop.style.display = "block";
});
    //check for highest score
     if (state.values.result > state.values.highScore) {
            state.values.highScore = state.values.result;
            localStorage.setItem("highScore", state.values.highScore);
        } 
      // Show the final score in the box
    state.view.finalScore.textContent = state.values.result;
    state.view.gameOverBox.style.display = "block";
    state.view.backdrop.style.display = "block";
    state.view.playButton.style.display = "block";
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
            if (!state.values.gameIsActive) return;
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

function createSquares() {
    state.view.panel.innerHTML = ""; // Clear previous squares
    for (let i = 1; i <= 9; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.id = i;
        state.view.panel.appendChild(square);
    }
    state.view.squares = document.querySelectorAll(".square");
}


function resetGameState() {
    state.values.result = 0;
    state.values.currentTime = 10;
    state.values.hitPosition = null;
    state.view.score.textContent = 0;
    state.view.timeLeft.textContent = 60;
}


function startGame() {
    state.view.backdrop.style.display = "none";
    state.view.gameOverBox.style.display = "none";
    resetGameState();
    createSquares();
    addListenerHitbox();

    state.values.gameIsActive = true; 
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countdownTimerId = setInterval(countdown, 1000);

    state.view.playButton.style.display = "none";
}

function init(){
    loadHighScore();
      state.view.backdrop.style.display = "block";
    //moveEnemy();
      state.view.playButton.addEventListener("click", startGame);
}

init();