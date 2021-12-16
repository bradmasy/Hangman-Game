/**
 * Brad Masciotra Final Project JavaScript Code
 * 
 * December 4th 2021
 * @version 1.7
 */


// constants

const $hangman_image       = $("#main-game-img");
const min                  = 0;
const hintMin              = 1;
const hintMax              = 3;
const $numberButtons       = $("#number-buttons");
const $firstLetterButtons  = $("#first-letter-buttons");
const $secondLetterButtons = $("#second-letter-buttons");
const $second2LetterButtons = $("#second2-letter-buttons");
const $shiftToggle         = $("#upper-lower-toggle");
const $xButton             = $("#x-button");
const $hintsSection        = $("#hints");
const $popup               = $("#popup");
const $content             = $("#content")
const amountOfAttempts     = 6;
const $ruleButton          = $("#rules");
const $aboutButton         = $("#about");
const $newGame             = $("#new-game");
const $navButtons          = $(".nav-button");
const $shiftButton         = $("#shift");
const maxIncorrectGuesses  = 6;
const $popupHowTo          = $("#popup-section-how-to");
const $newGameButton       = $("#new-game-button");
const $playerCardButton    = $("#player-card-button");
const $playerCardSection   = $("#player-card");
const $cardInfo            = $("#card-info");
const $xButtonCard         = $("#x-button-card");
const $resetButtonSection  = $("#reset-button-section");
const $resetButton         = $("#reset-button");
const firstIndex           = 0;

// these signifiy the end of the animation frames
const phaseOneImageNumber   = 35;
const phaseTwoImageNumber   = 65;
const phaseThreeImageNumber = 85;
const phaseFourImageNumber  = 105;
const phaseFiveImageNumber  = 125;
const phaseSixImageNumber   = 145;

// global scope variables

let hangmanAnimationHandler;
let endHandler;
let endImageSrc;
let theChosenWord;
let letterTiles;
let mainSrc;
let $choiceButtons;
let letterCount;
let hangmanWordObjectInPlay;
let questionReferences         = [];
let playerAttempt              = 0;
let imageCounter               = 0;
let $wordDisplayed             = $("#choices");
let player                     = new Player();
let randomHintNumber           = generateRandomHintNum();
let listOfWordsIndexesDone     = [];
let gamesPlayed                = 0;
let playerCorrectGuesses       = 0;
let playerIncorrectGuesses     = 0;
let randomArrayOfQuestionOrder = [];
let indiceArray                = [];
let max                        = 0;

//alphabet string
const numbers   = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const alpha_one = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"];
const alpha_two = ["q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


/**
 * Creates the Letter Tiles for Hangman.
 * 
 * @param {} word the word from which we are creating the tiles. 
 */
function createLetterTiles(word) {
    let letterTile = null;

    for (let i = 0; i < word.length; i++) {

        letterTile = $("<p></p>");
        letterTile.addClass("letterTiles");
        $wordDisplayed.append(letterTile);
    }
    letterTiles = $(".letterTiles");
}

/**
 * Creates an array of indexes in order from the first data set to the last in the JSON file.
 * 
 * @returns an array of indexes.
 */
function createRandomArrayIndex() {
    var arr = [];

    for (let i = 0; i < max; i++) {
        arr.push(i);
    }
    
    return arr;
}

/**
 * Creates an array of random indexes between the first and last data set in the JSON file.
 * 
 * @param {*} array an array of indexes.
 */
function randomizeQuestionArray(array) {
    
    while (true) {
        let randomIndex = Math.floor(Math.random() * (max - min)) + min;
        let arrayVal    = array[randomIndex]
        if (randomArrayOfQuestionOrder.includes(arrayVal)) { // if the value is present in the array continue to loop.
            continue;
        }
        else {
            randomArrayOfQuestionOrder.push(arrayVal);

            if (randomArrayOfQuestionOrder.length == max) { // once we have every number break the loop.
                break;
            }
        }
    }
}

/**
 * Chooses the word from the array of HangmanWord objects.
 */
function chooseWord() {
    if (randomArrayOfQuestionOrder.length != 0) {
        let ChosenIndexVal = randomArrayOfQuestionOrder[firstIndex]; // choose the first index after its been radnomized
        let wordObject     = questionReferences[ChosenIndexVal];
        randomArrayOfQuestionOrder.shift(); // delete the index chosen from the list
        hangmanWordObjectInPlay = wordObject; // the chosen object is now the object in play

        listOfHintIndexesDone.push(randomHintNumber); // add the first random number to the hint array
        listOfWordsIndexesDone.push(ChosenIndexVal); 
        theChosenWord = wordObject.word; // the word in play for the match
        createLetterTiles(theChosenWord);
        letterCount = theChosenWord.length;
        $hintsSection.text(`Hint: "${wordObject.hints[randomHintNumber]}..."`);
    }
    else {

        //-------------------------------------------------------------------------initiate a full reset here-----------------------------------------
        // edit this screen more if no more words maybe a reset button.
        finalResults();
    }
}

function finalResults(){
    $hangman_image.fadeOut("slow");
    $firstLetterButtons.html(null);
    $numberButtons.html(null);
    $secondLetterButtons.html(null);
    $hintsSection.html(null);
    navHandlersOff();
    let $gamesPlayed   = $(`<div><b><u>Games Played:</u></b> ${player.gamesPlayed}</div>`)
    let $score         = $(`<div><b><u>Score:</u></b> ${player.score}</div>`)
    let $playerPercent = $(`<div><b><u>Winning Percentage:</u></b> ${((player.score / player.gamesPlayed) * 100).toFixed(2)}%</div>`)
    let $wordsDone     = $(`<div><b><u>Words Completed:</u></b>  ${player.displayWords()}</div>`)
    let $playAgainButton     =$(`<div id="again"><button id="play-again">Play Again?</button></div>`);
    $("#again").css("display","flex");
    $("#again").css("justify-content","center");

    setTimeout(function(e){
        $hangman_image.attr("src","../images/gifs/aesthetic-game-over.gif");
        $hangman_image.css("border-radius","50%");
        $hangman_image.fadeIn("slow");
        $hintsSection.append(`<h1>Player Statistics:</h1>`);
        $hintsSection.append($gamesPlayed);
        $hintsSection.append($score);
        $hintsSection.append($playerPercent);
        $hintsSection.append($wordsDone);
        $hintsSection.append(`<h1>Thanks For Playing Hangman!</h1>`)
        // delete if not working from here
        $hintsSection.append($playAgainButton);
        
    },1000)

    $playAgainButton.click(function(e){
       
        $hangman_image.attr("src", "../images/st-one/hangman-lg-0.png");
        listOfWordsIndexesDone     = [];
        questionReferences         = [];
        playerAttempt              = 0;
        gamesPlayed                = 0;
        randomArrayOfQuestionOrder = [];
        $wordDisplayed.html(null);
        player                     = new Player();
        

        fetchJSON();
        createLetterChoiceButtons(numbers, $numberButtons);
        createLetterChoiceButtons(alpha_one, $firstLetterButtons);
        createLetterChoiceButtons(alpha_two, $secondLetterButtons);
        createLetterChoiceButtons(alpha_two, $second2LetterButtons);
        $second2LetterButtons.css("display","none");

        playerCardHandlersOff();
        navHandlersOn();
        choiceHandlers();
        choiceClicks();
    })

}

/*
function fullReset()
{
    alert("working");
    //$hangman_image.attr("src", "../images/st-one/hangman-lg-0.png");
   
    listOfWordsIndexesDone     = [];
    questionReferences         = [];
    playerAttempt              = 0;
    gamesPlayed                = 0;
    randomArrayOfQuestionOrder = [];
    $wordDisplayed.html(null);
    player = new Player();
    reset();
    fetchJSON();

}
*/

/**
 * Fetches the Data from the JSON File.
 */
function fetchJSON() {
    fetch("./scripts/words-two.json")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function (data) {

            max = data.length; // assign the length of the data stream as the maximum number for looping in the next processes.
            for (i = 0; i < data.length; i++) {
                let hints    = [];
                let eachData = data[i];
               
                hints.push(eachData.hintOne);
                hints.push(eachData.hintTwo);
                hints.push(eachData.hintThree);
                let wordOb = new HangmanWord(eachData.word, hints); // creating a hangman word object

                questionReferences.push(wordOb);
            }

            let randomArrayQuestionIndex = createRandomArrayIndex();
            randomizeQuestionArray(randomArrayQuestionIndex);

            chooseWord();
        })
}

/**
 * Creates the letter choice buttons for the game.
 * 
 * @param {*} theArray an array of data.
 * @param {*} section the section we are appending to.
 */
function createLetterChoiceButtons(theArray, section) {
    theArray.forEach(function (eachLetter) {
       
        let $eachButton = $("<button></button>");
        $eachButton.addClass("choice-button")
        $choiceButtons = $(".choice-button");
        $eachButton.html(eachLetter.toUpperCase());
        $eachButton.val(eachLetter.toUpperCase());
        section.append($eachButton);
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
    else if (player.attempts == 5) {
        $hangman_image.attr("src", phase(phaseFiveImageNumber));
    }
    else if (player.attempts == 6) {
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
    let newSrc     = null;

    if (imageCounter == endOfPhase) {
        cancelAnimationFrame(hangmanAnimationHandler);
        clearTimeout(endHandler);
        endImageSrc = hangmanSrc;
    }
    else {
        newSrc     = hangmanSrc.replace(`${imageCounter}`, `${imageCounter + 1}`);
        mainSrc    = newSrc;
        hangmanSrc = newSrc;
        $hangman_image.attr("src", newSrc);
        endHandler  = slowDownImage();
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
}

/**
 * Hides the pop up and resets its value to null(for future messages).
 */
function hidePrompt() {
    $choiceButtons.prop("disabled", false);
    $popup.css("display", "none");
    $content.html(null);
    navHandlersOn();
    ruleHandlersOn();
    aboutHandlersOn();
    playerCardHandlers();
    newGameHandlersOn();
}

/**
 * Resets the game, sets all values to the same as the beginning with the player continuing on.
 */
function reset() {
    imageCounter           = 0;
    playerCorrectGuesses   = 0;
    playerIncorrectGuesses = 0;
    theChosenWord          = null;

    $numberButtons.html(null);
    $firstLetterButtons.html(null);
    $secondLetterButtons.html(null);
    $navButtons.css("opacity", "100%");
    $wordDisplayed.html(null);
    player.reset();

    createLetterChoiceButtons(numbers, $numberButtons);
    createLetterChoiceButtons(alpha_one, $firstLetterButtons);
    createLetterChoiceButtons(alpha_two, $secondLetterButtons);
    createLetterChoiceButtons(alpha_two, $second2LetterButtons);
    $second2LetterButtons.css("display","none");

    chooseWord();
    navHandlersOn();
    choiceHandlers();
    newGameHandlersOn();
    aboutHandlersOn();
    ruleHandlersOn();
    choiceClicks();
    playerCardHandlers();
    $(".choice-button").prop("disabled", false);
    $hangman_image.attr("src", "../images/st-one/hangman-lg-0.png");
}

/**
 * Coounts the amount of times the letter is in the chosen word.
 * 
 * @param {} letterClicked the letter clicked by the user.
 *  
 * @returns the amount of times the letter is in the chosen word.
 */
function getOccurencesOfMatchingLetter(letterClicked) {
    let countAmountOfTimesInWord = 0;

    for (y = 0; y < theChosenWord.length; y++) {
        if (letterClicked == theChosenWord[y]) {
            countAmountOfTimesInWord++;
        }
    }
    return countAmountOfTimesInWord;
}

/**
 * Changes the letter tiles to that of the chosen letter when the correct one has been clicked.
 * 
 * @param {*} eachLetter the letter to change.
 * @param {*} countOfIndices the indices of the letters we are changing.
 * @returns the indexes of the letter.
 */
function changeEachLetterTile(eachLetter, countOfIndices) {
    let indexes         = [];
    let wordToLoop      = theChosenWord;
    let newLoopLocation = 0;
    let oldLetterCount  = 0;

    for (i = newLoopLocation; i < theChosenWord.length; i++) {
        if (indexes.length == countOfIndices) {
            break;
        }

        let index = wordToLoop.indexOf(eachLetter) + oldLetterCount;

        indexes.push(index);
        newLoopLocation = index + 1;
        wordToLoop      = wordToLoop.slice(newLoopLocation, wordToLoop.length);
        oldLetterCount  = theChosenWord.length - wordToLoop.length;
    }
    return indexes;
}


/**
 * Changes the letter tiles to the chosen letters if they are in the chosen word.
 * 
 * @param {*} indices an array on the indices of the letter chosen.
 * @param {*} eachLetter the given letter.
 */
function changeTiles(indices, eachLetter) {
    for (i = 0; i < indices.length; i++) {
        let indexToChange      = indices[i];
        let tileToChange       = letterTiles[indexToChange]
        tileToChange.innerHTML = eachLetter;
    }
}

/**
 * Calls the winRound function when the players correct guess count equals the amount of letters in the chosen word.
 * 
 * @param {} playerCorrectGuesses the amount of correct guesses the player has made. 
 * @param {*} letterCount the letter count of the chosen word.
 */
function playerWin(playerCorrectGuesses, letterCount) {
    if (playerCorrectGuesses == letterCount) {
        winRound();
    }
    else {
        console.log("not yet")
    }
}

/**
 * Calls the hangmanPhases function when there are no matches to the players guess.
 * 
 * @param {*} match boolean representing if there was a match made.
 * @param {*} playerIncorrectGuesses the amount of incorrect guesses the player has made.
 */
function noMatches(match, playerIncorrectGuesses) {
    if (!match) // calls these functions when no match is detected in the loop
    {
        hangmanPhases();
        if (playerIncorrectGuesses != maxIncorrectGuesses) {
            
            setTimeout(displayResults(false), 3000);
        }
    }
}

/**
 * Sets the display for when a player has mad the maximum amount of incorrect guesses and loses the game.
 * @param {*} playerIncorrectGuesses 
 * @returns 
 */
function incorrectGuesses(playerIncorrectGuesses) {
    playerIncorrectGuesses += 1;
    if (playerIncorrectGuesses == maxIncorrectGuesses) {
        setTimeout(function () {
            $hangman_image.fadeOut("slow");
        }, 1000)

        $popup.css("display", "none");
        $hintsSection.html(null);
        $numberButtons.html(null);
        $secondLetterButtons.html(null);
        $firstLetterButtons.html(null);
        navHandlersOff();
        newGameHandlerAfterWin();
        newGameButtonHandlerAfterWin();
        $wordDisplayed.html(null);
        setTimeout(function () {
            $hangman_image.attr("src", "../images/executioner-0.png");
            $hangman_image.fadeIn("slow");
            $hintsSection.append(`<p id="loser"> Sorry but you have failed, the executioner will have your head...Please Click the \"New Game\" button to play again.</p>`);
        }, 3000);
    }
    return playerIncorrectGuesses;
}

/**
 * Simulates each round of hangman (when a tile has been clicked).
 * 
 * @param {} letterClicked the letter tile value that was clicked by the user.
 */
function round(letterClicked) {

    let match;
    let indexesToChange = []

    if (theChosenWord.includes(letterClicked)) {
        let countAmountOfTimesInWord = getOccurencesOfMatchingLetter(letterClicked);
        indexesToChange              = changeEachLetterTile(letterClicked, countAmountOfTimesInWord)
        changeTiles(indexesToChange, letterClicked);

        playerCorrectGuesses += indexesToChange.length;

        match = true;

        if (playerCorrectGuesses == letterCount) {
            playerWin(playerCorrectGuesses, letterCount);
        }
        else {
            
            displayResults(true);
        }
    }
    else {
        match = false;
        playerIncorrectGuesses = incorrectGuesses(playerIncorrectGuesses);

        noMatches(match, playerIncorrectGuesses);
        if (playerIncorrectGuesses == maxIncorrectGuesses) {
            incorrectGuesses(playerIncorrectGuesses)
        }
    }
}

/**
 * Displays the results based on the players decision.
 * 
 * @param {*} correct represents if the player made the correct or incorrect choice. 
 */
function displayResults(correct) {
    
    if (correct) {
        $content.append(`<div><h1>You Guessed A Correct Letter! Great Work!</h1></div>`)
        $popup.css("background-color", "skyblue")
        $popup.fadeIn("slow")
    }

    else {
        $content.append(`<div id="congrats-message"><p>You have made ${player.attempts} bad attempt(s) out of ${amountOfAttempts}.<BR>${amountOfAttempts - player.attempts} wrong attempts left.</p></div>`);
        $popup.css("background-color", "lightcoral")
        setTimeout(function (e) {
            $popup.fadeIn("slow")
        }
            , 2000);
    }

    $xButton.click(hidePrompt);
    $choiceButtons.prop("disabled", true);
    navHandlersOff();
}

/**
 * Sets the display for when a player wins the round.
 */
function winRound() {
    navHandlersOff();
    newGameHandlerAfterWin();
    newGameButtonHandlerAfterWin();
    $hangman_image.fadeOut("slow");
    player.incrementScore();
    player.addWord(theChosenWord);
    $popup.fadeOut("slow");
    $hintsSection.html(null)
    $wordDisplayed.html(null);
    $popup.css("display", "none");
    $firstLetterButtons.html(null);
    $secondLetterButtons.html(null);
    $numberButtons.html(null)
    setTimeout(function () {
        $hangman_image.css("border-radius", "50%");
        $hangman_image.attr("src", "../images/gifs/celebration.gif");
        $hangman_image.fadeIn("slow");
        $hintsSection.append(`<p id="winner">Congratulations! You have guessed the Word! To Play Again Press The \"New Game\" Menu Bar Button.</p>`)
    }, 1500);

}

/**
 * Displays the player stats to the player card.
 */
 function displayPlayerStats() {

    let $gamesPlayed = $(`<div><u>Games Played:</u> ${player.gamesPlayed}</div>`)
    let $rounds      = $(`<div><u> Current Attempts:</u> ${player.attempts}</div>`)
    let $score       = $(`<div><u>Score:</u> ${player.score}</div>`)
    let $wordsDone   = $(`<div><u>Words Completed:</u>  ${player.displayWords()}</div>`)

    $cardInfo.append($gamesPlayed);
    $cardInfo.append($rounds);
    $cardInfo.append($score);
    $cardInfo.append($wordsDone);
}

//--------------------------------------Choice-Button-Handlers---------------------------------------------------

/**
 * Turns the choice handlers on.
 */
function choiceHandlers() {
    $choiceButtons.mouseenter(function (e) {
        $(this).css("opacity", "50%");
    })
    $choiceButtons.mouseleave(function (e) {
        $(this).css("opacity", "100%");
    })
}

/**
 * Turns the click handlers on for the choice buttons.
 */
function choiceClicks() {
    
    $choiceButtons.click(function (e) {
       
        
            let value;
            $(this).css("opacity", "50%");
            $(this).off("mouseleave");
            value = $(this).val();
            $(this).prop("disabled", true);
            $(this).off("click"); // turn off the button.
            round(value); // once clicked run the round.
         //   letterClicked = true; // basically disable the button once clicked.
    })
}

//---------------------------------------Nav-Handlers-----------------------------------------------------------

/**
 * Turns the navigation handlers on.
 */
function navHandlersOn() {
    $navButtons.mouseenter(function (e) {
        $(this).css("opacity", "50%");
    })
    $navButtons.mouseleave(function (e) {
        $(this).css("opacity", "100%");
    })
}

/**
 * Turns the navigation handlers off.
 */
function navHandlersOff() {
    $navButtons.off("mouseenter")
    $navButtons.off("click");
}

//--------------------------------------Rule-Button-Handlers----------------------------------------------------------------

/**
 * Turns the rule handlers on.
 */
function ruleHandlersOn() {
    $ruleButton.click(function (e) {
        $popupHowTo.css("display", "flex");
        $choiceButtons.prop("disabled", true);
        navHandlersOff();
       
    });
}

/**
 * Turns the rule handlers off.
 */
function ruleHandlersOff() {
    $("#x-button-how").click(function (e) {
        $popupHowTo.css("display", "none");
        $choiceButtons.prop("disabled", false);
        newGameHandlersOn();
        navHandlersOn();
        ruleHandlersOn();
        aboutHandlersOn();
        playerCardHandlers()
       
    });
}
//------------------------------------------About-Handlers-------------------------------------------------------------------------

/**
 * Turns the about handlers on.
 */
function aboutHandlersOn() {
    $aboutButton.click(function (e) {
        $("#popup-section-about").css("display", "flex");
        $choiceButtons.prop("disabled", true);
        navHandlersOff();
    });
}

/**
 * Turns the about handlers off.
 */
function aboutHandlersOff() {
    $("#x-button-about").click(function (e) {
        $("#popup-section-about").css("display", "none");
        $choiceButtons.prop("disabled", false);
        newGameHandlersOn();
        navHandlersOn();
        playerCardHandlers();
        aboutHandlersOn();
        ruleHandlersOn();
    })
}

//-----------------------------------------New-Game-Handlers------------------------------------------------------------------------


/**
 * Turns the new game handlers on.
 */
function newGameHandlersOn() {
    $newGame.click(function (e) {
        $("#popup-section-new-game").css("display", "flex");
        navHandlersOff();
        newGameHandlersOff()
        $choiceButtons.prop("disabled", true);
    });
}

/**
 * Turns the specific handlers on when a player has won a game.
 */
function newGameHandlerAfterWin()
{
    $("#x-button-game").off("click");
    newGameButtonHandlerAfterWin();
    $newGame.mouseenter(function(e)
    {
        $newGame.css("opacity","50%");
    })

    $newGame.mouseleave(function(e)
    {
        $newGame.css("opacity","100%");
    })
    $newGame.click(function (e) {
        $("#popup-section-new-game").css("display", "flex");
        navHandlersOff();
        
        $choiceButtons.prop("disabled", true);
    });
}

function newGameButtonHandlerAfterWin()
{
$("#x-button-game").click(function (e){
    newGameHandlerAfterWin();
    $("#popup-section-new-game").css("display", "none");
    })
}

/**
 * Turns the new game handlers off.
 */
function newGameHandlersOff() {
    $("#x-button-game").click(function (e) {
        $("#popup-section-new-game").css("display", "none");
        $choiceButtons.prop("disabled", false);
        newGameHandlersOn();
        navHandlersOn();
        ruleHandlersOn();
        playerCardHandlers();
        aboutHandlersOn();
    });
}

/**
 * Turns the new game button handlers on.
 */
function newGameButtonHandler() {
    $newGameButton.click(function (e) {
        console.log(questionReferences);
        $("#popup-section-new-game").css("display", "none");
        reset();
    });
}

//-------------------------------------Player-Card-Handlers-----------------------------------------------------------

/**
 * Turns the player card handlers on.
 */
function playerCardHandlers() {
    
    $playerCardButton.click(function (e) {
        $cardInfo.html(null);
        $playerCardSection.css("display", "flex");
        displayPlayerStats();
        newGameHandlersOff();
        navHandlersOff();
        $choiceButtons.prop("disabled", true);
    })
}

/**
 * Turns the player card handlers off.
 */
function playerCardHandlersOff() {
    $xButtonCard.click(function (e) {
        $playerCardSection.css("display", "none");
        navHandlersOn();
        ruleHandlersOn();
        aboutHandlersOn();
        newGameHandlersOn();
        playerCardHandlers();
        $cardInfo.html(null);
        $choiceButtons.prop("disabled", false);
    })
}
//-------------------------------------Win-Handlers-----------------------------------------------------------

function turnOffHandlersExceptNewGame()
{
    navHandlersOff();
    newGameHandlersOn();
}

//----------------------------------startup---------------------------------

/**
 * Organizes and runs the page
 */
function startUp() {

    createLetterChoiceButtons(numbers, $numberButtons);
    createLetterChoiceButtons(alpha_one, $firstLetterButtons);
    createLetterChoiceButtons(alpha_two, $secondLetterButtons);
    /*
    the hack to get the button to work
    */
    createLetterChoiceButtons(alpha_two, $second2LetterButtons);
    $second2LetterButtons.css("display","none");
    fetchJSON();
    playerCardHandlersOff();
    navHandlersOn();
    choiceHandlers();
    ruleHandlersOn();
    ruleHandlersOff();
    aboutHandlersOn();
    newGameHandlersOn();
    aboutHandlersOff();
    choiceClicks();
    newGameButtonHandler();
    playerCardHandlers();
  
}

// calling start up to begin the game.

startUp();