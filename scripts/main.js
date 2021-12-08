/**
 * Brad Masciotra Final Project JavaScript Code
 * 
 * December 4th 2021
 * @version 1.0
 */

// constants
const $testButton = $("#button");
const $endButton = $("#end");
const $hangman_image = $("#main-game-img");
const max = 2;
const min = 0;
const hintMin = 1;
const hintMax = 3;
const $wordDisplayed = $("#choices");
const $numberButtons = $("#number-buttons");
const $firstLetterButtons = $("#first-letter-buttons");
const $secondLetterButtons = $("#second-letter-buttons");
const $shiftToggle = $("#upper-lower-toggle");
const $choiceButtons = $(".choice-buttons");
const $hintsSection = $("#hints");
const $popup = $("#popup");
const amountOfAttempts = 6;

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
    console.log(letterTiles)
}

function fetchJSON() {
    let word = null;
    let hints = null;
    let randomNumber = Math.floor(Math.random() * (max - min) + min);
    let randomHintNumber = Math.floor(Math.random() * (hintMax - hintMin) + hintMin);
    let thisData = null;

    fetch("/scripts/words.json")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function (data) {
            thisData = data[`${randomNumber}`];
            word = thisData["word"];
            hints = thisData["hints"];
            theChosenWord = word;
            createLetterTiles(word);
            $hintsSection.text(`Hint: "${hints[randomHintNumber]}..."`);

        })
}

fetchJSON();

function createLetterChoiceButtons(theArray, section) {

    theArray.forEach(function (eachLetter) {
        let eachButton = document.createElement("button");
        eachButton.innerHTML = eachLetter;
        eachButton.value = `${eachLetter}`;
        eachButton.setAttribute("class", "choice-buttons");
        eachButton.addEventListener("click", function (e) {
            let value = eachButton.value;
            round(value);
        })
        section.append(eachButton);
    })
}

createLetterChoiceButtons(numbers, $numberButtons);
createLetterChoiceButtons(alpha_one, $firstLetterButtons);
createLetterChoiceButtons(alpha_two, $secondLetterButtons);



/**
 * Draws the hangman character.
 */
function drawHangman() {
    if (playerAttempt == 1) {
        $hangman_image.attr("src", phase(phaseOneImageNumber));
    }
    else if (playerAttempt == 2) {
        $hangman_image.attr("src", phase(phaseTwoImageNumber));
    }
    else if (playerAttempt == 3) {
        $hangman_image.attr("src", phase(phaseThreeImageNumber));
    }
    else if (playerAttempt == 4) {
        $hangman_image.attr("src", phase(phaseFourImageNumber));
    }
    else if(playerAttempt == 5)
    {
        $hangman_image.attr("src", phase(phaseFiveImageNumber));
    }
    else if(playerAttempt == 6)
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
    if (playerAttempt == 0) {
        phase(phaseOneImageNumber);
    }
    else if (playerAttempt == 1) {
        phase(phaseTwoImageNumber);
    }
    else if (playerAttempt == 2) {
        phase(phaseThreeImageNumber);
    }
    else if (playerAttempt == 3) {
        phase(phaseFourImageNumber);
    }
    else if (playerAttempt == 4) {
        phase(phaseFiveImageNumber);
    }
    else if (playerAttempt == 5) {
        phase(phaseSixImageNumber);
    }
  
  

    playerAttempt++;
}


function displayAttempts() {
    $popup.text(`You have made ${playerAttempt} bad attempt(s) out of ${amountOfAttempts}.${amountOfAttempts - playerAttempt} wrong attempts left.`);
    // $popup.css("display","block");
}

function round(letterClicked) {
    let match;

    for (i = 0; i < theChosenWord.length; i++) {
        let eachLetter = theChosenWord[i];

        if (letterClicked == eachLetter.toLowerCase()) {
            let tileToChange = letterTiles[i];
            tileToChange.innerHTML = eachLetter;
            match = true;
            break;
        }
        else {
            match = false;
        }
    }

    if (!match) {
        hangmanPhases();

        setTimeout(displayAttempts, 3000);
    }

}


