//TODO: make a visual feeback when hitting Ralph
//TODO: update gameVelocity, change it dynamically to make the game more fun
//TODO: Mobile version. with a drawer menu? 
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
        highScoreFinal: document.querySelector("#high-score-final"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: null,
        result: 0,
        currentTime: 10,
        highScore: 0,
        gameIsActive: false,
        isSoundOn: true,

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
state.view.highScoreFinal.textContent = state.values.highScore;

// Reset the animation 
document.body.classList.remove("hammer-cursor", "hammer-hit");
state.view.gameOverBox.style.display = "block";
state.view.gameOverBox.style.animation = "none";
void state.view.gameOverBox.offsetWidth; // Force reflow
state.view.gameOverBox.style.animation = "popBounce 0.5s ease forwards";
    state.view.backdrop.style.display = "block";
    state.view.playButton.style.display = "block";
    }
}
function playSound(audioName){
     if (!state.values.isSoundOn) return;
    let audio = new Audio(`./src/audio/${audioName}.mp3`)
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





function addListenerHitbox() {
  state.view.panel.addEventListener("mousedown", (event) => {
    if (!state.values.gameIsActive) return;

    const square = event.target;

    // Only handle clicks on squares
    if (!square.classList.contains("square")) return;

    if (square.id === state.values.hitPosition) {
      document.body.classList.add("hammer-hit");
      setTimeout(() => {
        document.body.classList.remove("hammer-hit");
      }, 100);

      state.values.result++;
      state.view.score.textContent = state.values.result;
      state.values.hitPosition = null;
      playSound("squeak");
    }
  });
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
    document.body.classList.add("hammer-cursor");
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
    //🔈
    document.querySelector("#sound-checkbox").addEventListener("change", (event) => {
    state.values.isSoundOn = event.target.checked;
    localStorage.setItem("sound", state.values.isSoundOn);
});
const savedSoundPref = localStorage.getItem("sound");
if (savedSoundPref !== null) {
    state.values.isSoundOn = savedSoundPref === "true";
    document.querySelector("#sound-checkbox").checked = state.values.isSoundOn;
}
    state.view.playButton.addEventListener("click", startGame);
}

init();