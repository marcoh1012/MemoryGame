const gameContainer = document.getElementById("game");
const buttons = document.querySelector("#buttons");
const scoreContainer = document.querySelector("#score");
const highScoreContainer = document.querySelector("#highScore");

let clickCount = 0;
let firstCard;
let secondCard;
let gameState = false;
let score = 0;
let highScore = localStorage.getItem("highScore");
let matches = 0;

//if its their first game highscore is null so it will be set to 0
if (!highScore) {
  highScore = 0;
}

//show the current score and highscore
highScoreContainer.innerText = " " + highScore;
scoreContainer.innerText = "  " + score;

//changed to the names of the images in the file. named as 1.png 2.png ect. so i can use the same shuffle function on the array
const COLORS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    //created two more elements to add the flipping affect
    const frontCard = document.createElement("div");
    const backCard = document.createElement("div");

    frontCard.classList = "card frontCard";
    backCard.classList = "card backCard";
    // frontCard.id = "card";
    // backCard.id = "card";

    // added them to the one div that will represent the card
    newDiv.append(frontCard);
    newDiv.append(backCard);

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    newDiv.setAttribute("id", "card");
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked

  //used to check if they pressed the start button
  if (gameState) {
    //keep count of clicks
    clickCount++;

    //make sure only two clicks are done at a time
    if (clickCount < 3) {
      //used to flip the card over by toggling the class flipped
      event.target.parentElement.classList.toggle("flipped");

      event.target.parentElement.childNodes[1].style.backgroundImage = `url(pics/${event.target.parentElement.classList[0]}.png)`;

      //console.log("you just clicked", event.target.parentElement);
      if (clickCount === 1) {
        //first click will be saved as the first card
        firstCard = event.target.parentElement;
      } else {
        secondCard = event.target.parentElement;

        //save second card check make sure the same card was not clicked
        if (firstCard === secondCard) {
          // if its the same card remove one click and wait for the next card clicked
          clickCount--;
        } else {
          //if its two different cards add to number of moves/score abd print it to the page
          score++;
          scoreContainer.innerText = "  " + score;

          //run function to check if they match
          compareCards();
        }
      }
    }
    // else {
    //   console.log("two card clicked");
    // }
  } else {
    //if theu click a card but havent started a game then alert them to press start
    alert("Press Start Game");
  }

  //function to check if card matched using the class name added from the array.
  //if they are the same  remove the event listener so they cannot flip it back,
  //reset the click count as well as varibles storing the selected cards so they can select two more.
  // increase the number of matches and check that is is not equal to the max amount needed to end the game.
  function compareCards() {
    console.log("comparing");
    if (firstCard.classList[0] === secondCard.classList[0]) {
      firstCard.removeEventListener("click", handleCardClick);
      secondCard.removeEventListener("click", handleCardClick);

      firstCard = "";
      secondCard = "";
      clickCount = 0;

      matches++;
      if (matches === shuffledColors.length / 2) {
        endGame();
      }
    }
    //if they do not match flip them back after 1 second and reset the click counter
    else {
      setTimeout(function () {
        console.log("no match");
        firstCard.classList.toggle("flipped");
        secondCard.classList.toggle("flipped");
        clickCount = 0;
      }, 1000);
    }
  }
}
// when the DOM loads
createDivsForColors(shuffledColors);

//added the start button and reset button.
//start button turns green when game is running and sets gameState to true so the other functions will work.
//reset button click will reset all all variables and erase everything in the container
//then it fills if with new cards randomized as well
let startButton;
buttons.addEventListener("click", function (e) {
  if (e.target.name === "startGame") {
    startButton = e.target;
    e.target.style.backgroundColor = "rgb(100,247,89)";
    gameState = true;
  } else if (e.target.name === "resetGame") {
    gameContainer.innerHTML = "";
    matches = 0;
    score = 0;
    scoreContainer.innerText = "  " + score;
    firstCard = "";
    secondCard = "";
    createDivsForColors(shuffle(COLORS));
  }
});

//when all matched are complete update the score if needed and save it to local storage if needed
//resets start button color and number of matches
function endGame() {
  console.log("END");
  startButton.style.backgroundColor = "";
  matches = 0;
  gameState = false;
  if (score < highScore || highScore === 0) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreContainer.innerText = " " + highScore;
  }
}
