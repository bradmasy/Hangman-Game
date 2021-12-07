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
const $hintsSection       = $("#hints");
const phaseOneImageNumber = 35;
const $popup = $("#popup"); 
const amountOfAttempts = 6;

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

// button handlers
$testButton.click(function (e) {
    hangmanAnimationHandler = requestAnimationFrame(drawHangman);
});

$endButton.click(function (e) {
    cancelAnimationFrame(hangmanAnimationHandler);
});

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
    let word             = null;
    let hints            = null;
    let randomNumber     = Math.floor(Math.random() * (max - min) + min);
    let randomHintNumber = Math.floor(Math.random() * (hintMax - hintMin) + hintMin);
    let thisData         = null;

    fetch("/scripts/words.json")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function (data) {
            thisData      = data[`${randomNumber}`];
            word          = thisData["word"];
            hints         = thisData["hints"];
            theChosenWord = word;
            createLetterTiles(word);
            $hintsSection.text(`Hint: "${hints[randomHintNumber]}..."`);

        })
}

fetchJSON();

function createLetterChoiceButtons(theArray, section) {

    theArray.forEach(function (eachLetter) {
        let eachButton       = document.createElement("button");
        eachButton.innerHTML = eachLetter;
        eachButton.value     = `${eachLetter}`;
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
function drawHangman(phase) {
    $hangman_image.attr("src", phase());

}




function phaseOne() {
    hangmanSrc = $hangman_image.attr("src");
    let newSrc = null;

    if (imageCounter == phaseOneImageNumber) {
        newSrc = hangmanSrc.replace(`${imageCounter}`, `${0}`);
        $hangman_image.attr("src", newSrc);
        mainSrc = newSrc;
        imageCounter == 0;
        cancelAnimationFrame(hangmanAnimationHandler);
        clearTimeout(endHandler);
        endImageSrc = hangmanSrc;
    }
    else {
        newSrc = hangmanSrc.replace(`${imageCounter}`, `${imageCounter + 1}`);
        mainSrc = newSrc
        $hangman_image.attr("src", newSrc);
        imageCounter++;
        endHandler = slowDownImage();
    }

    return endImageSrc;
}


function slowDownImage() {
    let eventHandler = setTimeout(function (e) {
        hangmanAnimationHandler = requestAnimationFrame(drawHangman(phaseOne));

    }, 50)
    return eventHandler;
}


/**
 * Runs the hangman Images when a player makes an incorrect attempt
 */
function hangmanPhases() {
    if (playerAttempt == 0) {
        phaseOne();
    }
}


function displayAttempts()
{
   $popup.text(`You have made ${playerAttempt} bad attempt(s) out of ${amountOfAttempts}.${amountOfAttempts - playerAttempt} wrong attempts left.`);
    $popup.css("display","block");
}

function round(letterClicked) {
    let match;

    for (i = 0; i < theChosenWord.length; i++) {
        let eachLetter = theChosenWord[i];

        if (letterClicked == eachLetter.toLowerCase()) {
            let tileToChange       = letterTiles[i];
            tileToChange.innerHTML = eachLetter;
            match                  = true;
            break;
        }
        else
        {
            match = false;
        }
    }

    if (!match) {
        hangmanPhases();
        playerAttempt++;
        setTimeout(displayAttempts,3000);
    }

}


