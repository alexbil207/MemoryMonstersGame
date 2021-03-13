// Those are global variables, they stay alive and reflect the state of the game
let elPreviousCard = null;
let flippedCouplesCount = 0;
const TOTAL_COUPLES_COUNT = 8;
let isProcessing = true;
let isCounting = true;
let isInterval = true;



// ############### define cards on screen ####################
const elGame = document.querySelector("#game");
let cardArr = createCardArr();
// creating list between 1 - 8 for the cards .. everytime in different order
function createCardArr(){
    let reqNum = 8
    newCardArr = [];
    while (reqNum != 0) {
        let num = Math.floor((Math.random() * 8) + 1);
        if (!newCardArr.includes(num)){
            newCardArr.push(num);
            reqNum--;
        }
    }
    return newCardArr;
}

function defineCardsOnScreen(cardArr){
    for (let i = 0 ; i < 8 ; i++){
        const div = document.createElement('div');
        div.setAttribute("data-card",`${cardArr[i]}.png`);
        div.setAttribute("onclick",'cardClicked(this)');
        div.classList.add("card");
        const cardImg = document.createElement('img');
        cardImg.classList.add("cardImg");
        cardImg.setAttribute("src",`img/cards/${cardArr[i]}.png`);
        const backImg = document.createElement('img');
        backImg.classList.add("back");
        backImg.setAttribute("src",`img/cards/back.png`);
        div.appendChild(cardImg);
        div.appendChild(backImg);
        elGame.appendChild(div);
    };
}

function firstLineChangeCards(cardArr){
    for (let i = 0 ; i < 8 ; i++){
        const cardImg = document.querySelectorAll('.cardImg');
        const elDiv = document.querySelectorAll('.card');
        elDiv[i].setAttribute("data-card",`${cardArr[i]}.png`);
        cardImg[i].setAttribute("src",`img/cards/${cardArr[i]}.png`);
    }
};
function secondLineChangeCards(cardArr){
    let j = 0;
    for (let i = 8 ; i < 16 ; i++){
        const cardImg = document.querySelectorAll('.cardImg');
        const elDiv = document.querySelectorAll('.card');
        elDiv[i].setAttribute("data-card",`${cardArr[j]}.png`);
        cardImg[i].setAttribute("src",`img/cards/${cardArr[j]}.png`);
        j++;
    }
}
    
// }
// deploy 2 lines of cards
defineCardsOnScreen(cardArr); 
cardArr = createCardArr();
defineCardsOnScreen(cardArr);





// Creating retart button in section for later
let restartButton = document.createElement("button")
restartButton.classList.add("restartButton");
restartButton.innerHTML= "Play again!";


// Load an audio file 
var audioWin = new Audio('sound/win.mp3');
let audioWrong = new Audio('sound/wrong.mp3');
let audioRight = new Audio('sound/right.mp3');

// ####################Game###########################

// This function is called whenever the user click a card
function cardClicked(elCard) {
    startTimer();
    if (isProcessing == false) {
        return;
    }
    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }

    // Flip it
    elCard.classList.add('flipped');

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        let card1 = elPreviousCard.getAttribute("data-card");
        let card2 = elCard.getAttribute("data-card");

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2){
            audioWrong.play();
            isProcessing = false;
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                isProcessing = true;
            }, 1000)

        } else {
            // Yes! a match!
            audioRight.play();
            flippedCouplesCount++;
            elPreviousCard = null;

            // All cards flipped!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                audioWin.play();
                //stop clock
                stopCounting();
                //stop clock
                saveScore(seconds, tenthSeconds, minutes, tenthMinutes);
                //Appending restart button after winning
                elGame.appendChild(restartButton)
                let restart = document.querySelector(".restartButton");
                //event callback function
                restart.addEventListener("click", () =>{
                    let cards = document.querySelectorAll(".card");
                    for (let i = 0 ; i < cards.length ; i++){
                        cards[i].classList.remove('flipped');
                        elPreviousCard = null;
                        flippedCouplesCount = 0;
                    }
                    let cardArr = createCardArr(); // create new reorder list
                    firstLineChangeCards(cardArr);
                    cardArr = createCardArr();
                    secondLineChangeCards(cardArr);
                    // changeCards(cardArr);
                    elGame.removeChild(restartButton);//remove button
                    clockreset();// timer restart
                });
            }

        }

    }
}
// ###############################################


//#################### Timer define ################################
let seconds = 0;
let tenthSeconds = 0;
let minutes = 0;
let tenthMinutes = 0;
let houres = 0;
let tenthHoures = 0;

const timer = document.querySelector(".timer");
let multipleClickProtection = false;
let stopIntervalCounting = false;


function startTimer(){
    if (multipleClickProtection == true){
        return
    }
    multipleClickProtection = true;
    stopIntervalCounting = false;
    if (isInterval == true){
        setInterval(timerOn, 1000)
    }
    isInterval = false;
};
function timerOn(){
    if (stopIntervalCounting == true){
        return
    }
    seconds++;
    if (seconds === 10){
        tenthSeconds++;
        seconds = 0;
        if(tenthSeconds === 6){
            minutes++;
            tenthSeconds = 0;
            if(minutes === 10){
                minutes = 0;
                tenthMinutes++;
            }
        }
    }
    timer.innerHTML = `00:${tenthMinutes}${minutes}:${tenthSeconds}${seconds}`;

}
function clockreset(){
    seconds = 0;
    tenthSeconds = 0;
    minutes = 0;
    tenthMinutes = 0;
    houres = 0;
    tenthHoures = 0;
    timer.innerHTML = `00:${tenthMinutes}${minutes}:${tenthSeconds}${seconds}`;
    multipleClickProtection = false;
}

function stopCounting(){
    stopIntervalCounting = true;
}
// ###############################################


//#################### Score Storage ################################

function saveScore(seconds, tenthSeconds, minutes, tenthMinutes){
    let lastScore =  localStorage.getItem("Player Score:");
    let currentScoreInSeconds = (((tenthMinutes * 10) + minutes) * 60) + (tenthSeconds * 10) + seconds;
    if(lastScore > currentScoreInSeconds || lastScore == 0 ){
        localStorage.setItem("Player Score:",currentScoreInSeconds);
    }
    updateTableBest();

}
function updateTableBest(){
    let bestScore =  localStorage.getItem("Best Score:");
    let lastScore =  localStorage.getItem("Player Score:");
    let playerName = localStorage.getItem("Player Name:");
    if(bestScore > lastScore || bestScore == 0){
        localStorage.setItem("Best Score:",lastScore);
        localStorage.setItem("Best Player:",playerName);
    }
    bestScore =  localStorage.getItem("Best Score:");
    let userName = localStorage.getItem("Best Player:");
    let bestName = document.querySelector(".bestPlayer");
    let bestPlayerScore = document.querySelector(".bestScore");
    bestName.innerHTML = `Best Player: ${userName}`;
    bestPlayerScore.innerHTML = `Best Score: ${bestScore}s`;
    
}
// ###############################################
