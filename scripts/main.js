/**
 * Brad Masciotra Final Project JavaScript Code
 * 
 * December 4th 2021
 * @version 1.0
 */

// constants
const $hangman_image = $("#main-game-img");
const max = 2;
const min = 0;
const hintMin = 1;
const hintMax = 3;
let $wordDisplayed = $("#choices");
let $numberButtons = $("#number-buttons");
const $firstLetterButtons = $("#first-letter-buttons");
const $secondLetterButtons = $("#second-letter-buttons");
const $shiftToggle = $("#upper-lower-toggle");
let $choiceButtons;
const $hintsSection = $("#hints");
const $popup = $("#popup");
const amountOfAttempts = 6;
const $ruleButton = $("#rules");
const $aboutButton = $("#about");
const $newGame = $("#new-game");

//these signifiy the end of the animation frames
const phaseOneImageNumber = 35;
const phaseTwoImageNumber = 65;
const phaseThreeImageNumber = 85;
const phaseFourImageNumber = 105;
const phaseFiveImageNumber = 125;
const phaseSixImageNumber = 145;


// global scope variables
let hangmanAnimationHandler;
let playerAttempt = 0;
let imageCounter = 0;
let endHandler;
let endImageSrc;
let theChosenWord;
let mainSrc;
let letterTiles;
let player = new Player();

//alphabet string
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const alpha_one = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"];
const alpha_two = ["q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


function createLetterTiles(word) {
    let eachLetter = null;
    let letterTile = null;

    for (i = 0; i < word.length; i++) {
        eachLetter = word[i];
        letterTile = document.createElement("p");
        letterTile.setAttribute("class", "letterTiles")
        $wordDisplayed.append(letterTile);
    }
    letterTiles = document.querySelectorAll(".letterTiles");
}

function fetchJSON(randomNumber) {
    let word = null;
    let hints = null;
   // let randomNumber = Math.floor(Math.random() * (max - min) + min);
    let randomHintNumber = Math.floor(Math.random() * (hintMax - hintMin) + hintMin);
    let thisData = null;

    fetch("/scripts/words.json")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function (data) {
            thisData = data[`${randomNumber}`];
            console.log(thisData)
            player.documentWordDone(randomNumber);
            word = thisData["word"];
            hints = thisData["hints"];
            theChosenWord = word;
            createLetterTiles(word);
            $hintsSection.text(`Hint: "${hints[randomHintNumber]}..."`);
        })
}



function createLetterChoiceButtons(theArray, section) {

    theArray.forEach(function (eachLetter) {
        let letterClicked    = false;
        let eachButton       = document.createElement("button");
        eachButton.innerHTML = eachLetter;
        console.log(eachLetter)
        eachButton.value     = `${eachLetter}`;
        eachButton.setAttribute("class", "choice-button");
        $choiceButtons  = $(".choice-button");
        section.append(eachButton);

        eachButton.addEventListener("click", function (e) {
            
            if(!letterClicked)
            {
                eachButton.style.opacity = "50%";
                let value = eachButton.value;
                round(value);
                letterClicked = true;
            }
        })
        
    })
}

/**
 * Draws the hangman character.
 */
function drawHangman() {
    if (player.attempts == 1) {
        $hangman_image.attr("src", phase(phaseOneImageNumber));
    }
    else if (player.attempts == 2) {
        $hangman_image.attr("src", phase(phaseTwoImageNumber));
    }
    else if (player.attempts == 3) {
        $hangman_image.attr("src", phase(phaseThreeImageNumber));
    }
    else if (player.attempts == 4) {
        $hangman_image.attr("src", phase(phaseFourImageNumber));
    }
    else if(player.attempts == 5)
    {
        $hangman_image.attr("src", phase(phaseFiveImageNumber));
    }
    else if(player.attempts == 6)
    {
        $hangman_image.attr("src", phase(phaseSixImageNumber));
    }
}

/**
 * Updates the source of the image while running an animation frame and cancels when the animation has finished this phase.
 *
 *  @returns the end image source 
 */
function phase(endOfPhase) {
    let hangmanSrc = $hangman_image.attr("src");
    let newSrc = null;

    if (imageCounter == endOfPhase) {
        cancelAnimationFrame(hangmanAnimationHandler);
        clearTimeout(endHandler);
        endImageSrc = hangmanSrc;
    }
    else {
        newSrc = hangmanSrc.replace(`${imageCounter}`, `${imageCounter + 1}`);
        mainSrc = newSrc;
        hangmanSrc = newSrc;
        $hangman_image.attr("src", newSrc);
        endHandler = slowDownImage();
        endImageSrc = newSrc;
        imageCounter++;
    }
    return endImageSrc;
}

/**
 * Calls setTimeout on the animation frame to slow the speed for visual effect.
 * 
 * @returns the event handler for the animation. 
 */
function slowDownImage() {
    let eventHandler = setTimeout(function (e) {
        hangmanAnimationHandler = requestAnimationFrame(drawHangman);
    }, 50)
    return eventHandler;
}

/**
 * Runs the hangman Images when a player makes an incorrect attempt
 */
function hangmanPhases() {
    if (player.attempts == 0) {
        phase(phaseOneImageNumber);
    }
    else if (player.attempts == 1) {
        phase(phaseTwoImageNumber);
    }
    else if (player.attempts == 2) {
        phase(phaseThreeImageNumber);
    }
    else if (player.attempts == 3) {
        phase(phaseFourImageNumber);
    }
    else if (player.attempts == 4) {
        phase(phaseFiveImageNumber);
    }
    else if (player.attempts == 5) {
        phase(phaseSixImageNumber);
    }
    
    player.incrementAttempts();

//    playerAttempt++;// increasing the attempts by one
}

/**
 * Displays to the user their current attempts in the game in a pop-up.
 */
function displayAttempts(player) {
 
    $popup.append(`<div id="x-button"><button>X</button></div>`);
    $popup.append(`<div><p>You have made ${player.attempts} bad attempt(s) out of ${amountOfAttempts}.${amountOfAttempts - player.attempts} wrong attempts left.</p></div>`)
    //$popup.text(`You have made ${player.attempts} bad attempt(s) out of ${amountOfAttempts}.${amountOfAttempts - player.attempts} wrong attempts left.`);
    $popup.css("display","flex");
    let $xButton = $("#x-button");
    $xButton.click(hidePrompt);
    $popup.html(null);
    
}

function displayAbout()
{
    $popup.append(`<div id="x-button"><button>X</button></div>`);
    $popup.append(`<h1>About Hangman:</h1>
                   <p id="rule-para"> <b>Welcome to Hangman!</b>
                   <br> Hangman at the core is a guessing game<br>
                   designed to have the user guess the given word<br>
                   In this game you have 6 attempts to guess the chosen<br>
                   word before you have lost.<br>
                   With each failed attempt your character will continue to <br>
                   draw itself until fully completed<br>
                   <b>Good Luck!</b>`);
    $popup.append(`<br> <p><b>Author:</b> Bradley Masciotra <br>
                    <b>Version:</b> 1.0<br>
                    <br>
                    &copy; <italic>Rogue Developers Unlmtd</italic></p>`)
    $popup.css("display","flex");
    let $xButton = $("#x-button");
    $xButton.click(hidePrompt);
    $(".choice-button").prop("disabled",true);
}

function displayHowToPlay()
{
    $popup.append(`<div id="x-button"><button>X</button></div>`);

    $popup.append(`<h1>How To Play Hangman:</h1><br>
                   <p><b>1: Choose A Letter</b> <br> Choose a letter that you think might be in the chosen word.<br>
                   When a letter is chosen it is either in the sequence of characters or not.<br> If the letter is in the sequence, the chosen
                   letter will pop up in the field where it occurs in the word.<br> If not the hangman image will animate the first of 6 sequences before you have lost.<br>
                   <br><b>2: If your stuck, click the hint button to generate a new hint.</b><br> Your score will be effected for each hint generated! So be careful!.<br>
                   <br><b>3: If you would like to play a new game and start over with a different word, click the new game button!</b><br> There are many words to choose from so enjoy the ride!<br>
                   <br><b>4: Have fun and try to figure the game out before clicking on hints!</b><br> Enjoy testing your knowledge! </p>`);
                   $popup.append(`<br> <p><b>Author:</b> Bradley Masciotra <br>
                   <b>Version:</b> 1.0<br>
                   <br>
                   &copy; <italic>Rogue Developers Unlmtd</italic></p>`);
                   $popup.css("display","flex");
    let $xButton = $("#x-button");
    $xButton.click(hidePrompt);
    $(".choice-button").prop("disabled",true);
}

/**
 * Generates a random number between the max and the min.
 * 
 * @returns a random number between max and min.
 */
function generateRandomNum()
{
    let randomNum = Math.floor(Math.random() * (max - min) + min);
    return randomNum;
}

function reset()
{
    hidePrompt();
    let randomNum = generateRandomNum();
    $("#choices").html(null);
    
    player.wordsDone.forEach(each =>{
        if(each != randomNum)
        {
          
            //fetchJSON(randomNum);
            createLetterChoiceButtons(numbers, $numberButtons);
            createLetterChoiceButtons(alpha_one, $firstLetterButtons);
            createLetterChoiceButtons(alpha_two, $secondLetterButtons);
            fetchJSON(generateRandomNum());
            setButtons();
        }
        else
        {
            reset();
            console.log("here");
        }
    })
   
   // 
}

/**
 * Appends the message to the pop up and calls the new game function when the button is clicked, if X is clicked the operation is abandoned.
 */
function newGame()
{
    $popup.append(`<div id="x-button"><button>X</button></div>`);
    $popup.append(`<p> Are you sure you would like to start a new game?<br>`);
    $popup.append(`<div id="new-button"><button id="new-game-button">Start New Game</button></div>`);
    $popup.css("display","flex");
    let $xButton = $("#x-button");
    let $newGameButton = $("#new-game-button");
    $newGameButton.click(reset);
    $xButton.click(hidePrompt);
    $(".choice-button").prop("disabled",true);
}


/**
 * Sets the mouse enter and mouse leave functions for the letter tiles.
 */
function setButtons()
{
    let choices = document.querySelectorAll(".choice-button");

    choices.forEach(function(each){
        each.addEventListener("mouseenter", e => {
            each.style.opacity = "50%";
        })
    })

    choices.forEach(function(each){
        each.addEventListener("mouseleave", e => {
            each.style.opacity = "100%";
        })
    })
}

/**
 * Hides the pop up and resets its value to null(for future messages).
 */
function hidePrompt()
{
    $popup.css("display","none");
    $popup.html(null);
    
    $(".choice-button").prop("disabled",false);
  //  $choiceButtons.css("opacity","100%");
}


/**
 * Simulates each round of hangman (when a tile has been clicked).
 * 
 * @param {} letterClicked the letter tile value that was clicked by the user.
 */
function round(letterClicked) {
    let match;

    for (i = 0; i < theChosenWord.length; i++) {
        let eachLetter = theChosenWord[i];

        if (letterClicked == eachLetter.toLowerCase()){
            let tileToChange = letterTiles[i];
            tileToChange.innerHTML = eachLetter;
            match = true;
            break; // break the loop in there is a match
        }
        else {
            match = false;
        }
    }

    if (!match) // calls these functions when no match is detected in the loop
    {
        hangmanPhases();
        setTimeout(displayAttempts, 3000);
    }
}

// event handlers

$ruleButton.click(displayHowToPlay);

$aboutButton.click(displayAbout);

$newGame.click(newGame);














/**
 * Organizes and runs the page
 */
function main()
{
    
   
    createLetterChoiceButtons(numbers, $numberButtons);
    createLetterChoiceButtons(alpha_one, $firstLetterButtons);
    createLetterChoiceButtons(alpha_two, $secondLetterButtons);
    fetchJSON(generateRandomNum());
    setButtons();
}

function playAgain()
{
  main();   
}

// calling main
main();