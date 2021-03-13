//Local Storage check on load
let userName = localStorage.getItem("Player Name:");
let userNameH2 =  document.querySelector("h2");
localStorage.setItem("Best Score:", 0);
localStorage.setItem("Best Player:","null");
if (userName == null) {
    userName = prompt("Hey, Enter Your Name:")
    localStorage.setItem("Player Name:",userName)
    userNameH2.innerText = `Player Name: ${userName}`;
    updateScore();

} else { // if user exist loads his info 
    userName = localStorage.getItem("Player Name:");
    userNameH2.innerText = `Player Name: ${userName}`;
    
}
//user-change button
let userChangeButton =  document.querySelector(".userChange")
userChangeButton.addEventListener("click", ()=>{
    userName = prompt("Hey, Enter Your Name:")
    localStorage.setItem("Player Name:",userName)
    userNameH2.innerText = `Player Name: ${userName}`;
    updateScore();
});
// change the best time to defoult = 0
function updateScore(score = 0){
    localStorage.setItem("Player Score:",score);
    

};
