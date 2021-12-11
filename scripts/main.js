/**
 * Brad Masciotra Final Project JavaScript Code
 * 
 * December 4th 2021
 * @version 1.0
 */



/**
 * Creates the Letter Tiles for Hangman.
 * 
 * @param {} word the word from which we are creating the tiles. 
 */
function createLetterTiles(word) {
    let eachLetter = null;
    let letterTile = null;

    for (i = 0; i < word.length; i++) {
        eachLetter = word[i];
        letterTile = $("<p></p>");//document.createElement("p");
        letterTile.addClass("letterTiles");//setAttribute("class", "letterTiles")
        $wordDisplayed.append(letterTile);
    }

    letterTiles = $(".letterTiles");
    console.log(letterTiles)
}

/**
 * Fetches the Data from the JSON File.
 */
function fetchJSON() {
    fetch("/scripts/words-two.json")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function (data) {
            for (i = 0; i < data.length; i++) {
                let hints = [];
                let eachData = data[i];

                hints.push(eachData.hintOne);
                hints.push(eachData.hintTwo);
                hints.push(eachData.hintThree);

                let wordOb = new HangmanWord(eachData.word, hints); // creating a hangman word object

                questionReferences.push(wordOb);
            }

            chooseWord();
        })
}

/**
 * Chooses the given word.
 */
function chooseWord() {
    let randomNumber = generateRandomNum();
    let wordObject = questionReferences[randomNumber];
    hangmanWordObjectInPlay = wordObject;

    if (firstWord) {
        firstWord = false;
        listOfWordsIndexesDone.push(randomNumber);
        listOfHintIndexesDone.push(randomHintNumber);
        theChosenWord = wordObject.word;
        createLetterTiles(theChosenWord);
        letterCount = theChosenWord.length;
        $hintsSection.text(`Hint: "${wordObject.hints[randomHintNumber]}..."`);
    }

    else {
        if (listOfWordsIndexesDone.length == questionReferences.length) {
            $hintsSection.text(`"THATS IT..."`);
        }
        else {
            if (listOfWordsIndexesDone.includes(randomNumber)) {
                chooseWord();
            }
            else {
                listOfWordsIndexesDone.push(randomNumber); // push the index to the list so we can check again next time the function is called.
                listOfHintIndexesDone.push(randomHintNumber);
                theChosenWord = wordObject.word; // the chosen word is reassigned.
                $(".choices").html(null);
                createLetterTiles(theChosenWord); // create the new letter tiles.
                $hintsSection.text(`Hint: "${wordObject.hints[randomHintNumber]}..."`);
            }
        }
    }
    player.wordsDone.push(theChosenWord);
}

/**
 * 
 * @param {*} theArray 
 * @param {*} section 
 */
function createLetterChoiceButtons(theArray, section) {
    theArray.forEach(function (eachLetter) {
        let $eachButton = $("<button></button>");
        $eachButton.html(eachLetter.toUpperCase());
        $eachButton.val(eachLetter.toUpperCase());
        $eachButton.addClass("choice-button")
        $choiceButtons = $(".choice-button");

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
 * Hides the pop up and resets its value to null(for future messages).
 */
function hidePrompt() {
    $choiceButtons.prop("disabled", false);
    $popup.css("display", "none");
    $content.html(null);
}



//-----------------------------------------------------------pop-up-menus----------------------------------------------------------------------------------


/**
 * Displays the about menu.
 */
function displayAbout() {
    $(".choice-button").prop("disabled", true);
    $navButtons.off("click")
}
//-----------------------------------------------------------------------------------------

let hintCount = 0;

function generateNewHint() {

    let indexOfCurrentHint = randomHintNumber;

    if (hintCount < hangmanWordObjectInPlay.hints.length) {
        for (i = 0; i < hangmanWordObjectInPlay.hints.length; i++) {
            let eachHint = hangmanWordObjectInPlay.hints[i];

            if (listOfHintIndexesDone.length == hangmanWordObjectInPlay.hints.length) {
                $hintsSection.text(`Thats It!`);
                $hintButton.off("click");
                $hintButton.css("background-color", "lightcoral");
                $hintButton.off("mouseleave");
                $hintButton.off("mouseenter");
                randomHintNumber = 0;
                break;
            }

            if (listOfHintIndexesDone.includes(indexOfCurrentHint)) {
                randomHintNumber = generateRandomHintNum()
                generateNewHint();
                break;
            }
            else {
                listOfHintIndexesDone.push(indexOfCurrentHint)
                randomHintNumber = i;
                eachHint = hangmanWordObjectInPlay.hints[indexOfCurrentHint];
                hintCount++;

                if (hintCount == hangmanWordObjectInPlay.hints.length - 1) {
                    $hintsSection.text(`This is Your Last Hint: "${eachHint}..."`);
                }
                else {
                    $hintsSection.text(`Hint: "${eachHint}..."`);
                }
                break;
            }
        }
    }
}




function reset() {
    imageCounter = 0;
    playerCorrectGuesses = 0;
    hintCount = 0;
    theChosenWord = null;
    $("#choices").html(null);
    $numberButtons.html(null);
    $hintButton.css("background-color", "rgb(76, 183, 226)");
    $firstLetterButtons.html(null);
    $secondLetterButtons.html(null);
    $navButtons.css("opacity","100%");
    $wordDisplayed.html(null);
    listOfHintIndexesDone = [];
    player.reset();
    //generateNewHint();
    main()
    letterCount = theChosenWord.length;

    $choiceButtons.mouseenter(function (e) {
        $(this).css("opacity", "50%");
    })
    $choiceButtons.mouseleave(function (e) {
        $(this).css("opacity", "100%");
    })

    $navButtons.mouseenter(function (e) {
        $(this).css("opacity", "50%");
    })
    $navButtons.mouseleave(function (e) {
        $(this).css("opacity", "100%");
    })

    $(".choice-button").prop("disabled", false);
    $hangman_image.attr("src", "../images/st-one/hangman-lg-0.png");
}

/**
 * Appends the message to the pop up and calls the new game function when the button is clicked, if X is clicked the operation is abandoned.
 */
function newGame() {
    
    $navButtons.prop("disabled", true);
    $navButtons.off("click")
    $navButtons.off("mouseleave")
    $navButtons.off("mouseenter")
    $navButtons.css("opacity", "100%");
    //$newGameButton.click(reset);
    $(".choice-button").prop("disabled", true);
}



function getOccurencesOfMatchingLetter(letterClicked) {
    let countAmountOfTimesInWord = 0;

    for (y = 0; y < theChosenWord.length; y++) {
        if (letterClicked == theChosenWord[y]) {
            countAmountOfTimesInWord++;
        }
    }
    return countAmountOfTimesInWord;
}

function changeEachLetterTile(eachLetter, countOfIndices) {
    let indexes = [];
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
        wordToLoop = wordToLoop.slice(newLoopLocation, wordToLoop.length);
        oldLetterCount = theChosenWord.length - wordToLoop.length;
    }
    return indexes;
}


/**
 * Changes the letter tiles to the chosen letters if they are in the chosen word.
 * @param {*} indices an array on the indices of the letter chosen.
 * @param {*} eachLetter the given letter.
 */
function changeTiles(indices, eachLetter) {
    for (i = 0; i < indices.length; i++) {
        let indexToChange = indices[i];
        let tileToChange = letterTiles[indexToChange]
        tileToChange.innerHTML = eachLetter;
    }
}

function playerWin(playerCorrectGuesses, letterCount) {
    console.log("player correct guesses: " + playerCorrectGuesses);
    console.log("letter count: " + letterCount);
    if (playerCorrectGuesses == letterCount) {
        winRound();
    }
    else {
        console.log("not yet")
    }
}

function noMatches(match, playerIncorrectGuesses) {
    if (!match) // calls these functions when no match is detected in the loop
    {
        hangmanPhases();
        if (playerIncorrectGuesses != maxIncorrectGuesses) {
            displayResults(false);
            setTimeout(Game.displayAttempts, 3000);
        }
    }
}

function incorrectGuesses(playerIncorrectGuesses) {
    playerIncorrectGuesses += 1;
    console.log(playerIncorrectGuesses)
    if (playerIncorrectGuesses == maxIncorrectGuesses) {
        $choiceButtons.css("opacity", "100%")
        $choiceButtons.prop("disabled", true);
        setTimeout(function () {
            $hangman_image.fadeOut("slow");
        }, 1000)

        $popup.css("display", "none");
        $hintsSection.html(null);
        $numberButtons.html(null);
        $secondLetterButtons.html(null);
        $firstLetterButtons.html(null);
        $wordDisplayed.html(null);
        setTimeout(function () {
            $hangman_image.attr("src", "../images/executioner-0.png");
            $hangman_image.fadeIn("slow");
            $hintsSection.append("<p> Sorry but you have failed, the executioner will have your head...</p>")
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
    console.log(letterClicked);

    if (theChosenWord.includes(letterClicked)) {
        let countAmountOfTimesInWord = getOccurencesOfMatchingLetter(letterClicked);
        indexesToChange = changeEachLetterTile(letterClicked, countAmountOfTimesInWord)
        changeTiles(indexesToChange, letterClicked);

        playerCorrectGuesses += indexesToChange.length;

        match = true;

        if(playerCorrectGuesses == letterCount)
        {
            playerWin(playerCorrectGuesses, letterCount);
        }
        else
        {
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
    //$popup.css("bottom", "50%");
    if (correct) {
        $content.append(`<div><h1>You Guessed A Correct Letter! Great Work!</h1></div>`)
        $popup.css("background-color", "skyblue")
        $popup.fadeIn("slow")
    }

    else {
        $content.append(`<div><p>You have made ${player.attempts} bad attempt(s) out of ${amountOfAttempts}.<BR>${amountOfAttempts - player.attempts} wrong attempts left.</p></div>`);
        $popup.css("background-color", "lightcoral")
        setTimeout(function (e) {
            $popup.fadeIn("slow")
        }
            , 2500);
    }

    $xButton.click(hidePrompt);
    $choiceButtons.prop("disabled", true);
}

function winRound() {
    console.log("you won")
    $hangman_image.fadeOut("slow");
    $popup.fadeOut("slow");
    $hintsSection.html(null)
    $wordDisplayed.html(null);
    $popup.css("display", "none");
    $firstLetterButtons.html(null);
    $secondLetterButtons.html(null);
    $numberButtons.html(null)
    setTimeout(function () {
        $hangman_image.attr("src", "../images/gifs/celebration.gif");
        $hangman_image.fadeIn("slow");
        $hintsSection.append("Congratulations! You have guessed the Word! To Play Again Press The \"New Game\" Menu Bar Button.")
    }, 2000);

}

function lessOpacity() {
    $(this).css("opacity", "50%");
}

/**
 * Organizes and runs the page
 */
function main() {
    createLetterChoiceButtons(numbers, $numberButtons);
    createLetterChoiceButtons(alpha_one, $firstLetterButtons);
    createLetterChoiceButtons(alpha_two, $secondLetterButtons);
    fetchJSON();



    $choiceButtons.click(function (e) {
        let letterClicked = false;

        if (!letterClicked) {
            let value;
            $(this).css("opacity", "50%");
            $(this).off("mouseleave");
            value = $(this).val();
            $(this).prop("disabled", true);
            round(value);
            letterClicked = true;
        }

    })
   
   

    navHandlersOn();
    choiceHandlers();
    ruleHandlersOn();
    aboutHandlersOn();
    newGameHandlers();
    hintHandlers();
}

// calling main
main();

//--------------------------------------Choice-Button-Handlers---------------------------------------------------
function choiceHandlers()
{
    $choiceButtons.mouseenter(function (e) {
        $(this).css("opacity", "50%");
    })
    $choiceButtons.mouseleave(function (e) {
        $(this).css("opacity", "100%");
    })
}

//---------------------------------------Nav-Handlers-----------------------------------------------------------
function navHandlersOn()
{
    $navButtons.mouseenter(function (e) {
        $(this).css("opacity", "50%");
    })
    $navButtons.mouseleave(function (e) {
        $(this).css("opacity", "100%");
    })
}

function navHandlersOff()
{
    $navButtons.off("mouseenter")
    $navButtons.off("click");
}

//--------------------------------------Rule-Button-Handlers----------------------------------------------------------------

function ruleHandlersOn()
{
    $ruleButton.click(function(e){
        $popupHowTo.css("display","flex");
        $choiceButtons.prop("disabled",true);
        navHandlersOff()
    });

    $ruleButton.click(function(e){
        $popupHowTo.css("display","flex");
    });

    $("#x-button-how").click(function(e){
        $popupHowTo.css("display","none"); 
        $choiceButtons.prop("disabled",false);
        newGameHandlers();
        navHandlersOn();
        ruleHandlersOn(); // recurse the function
        aboutHandlersOn();
    });
}

//------------------------------------------About-Handlers-------------------------------------------------------------------------

function aboutHandlersOn()
{
    $aboutButton.click(function(e){
        $("#popup-section-about").css("display","flex");
        $choiceButtons.prop("disabled",true);
        navHandlersOff();
    });

    $("#x-button-about").click(function(e){
        $("#popup-section-about").css("display","none");
        $choiceButtons.prop("disabled",false);
        newGameHandlers();
        navHandlersOn();
        aboutHandlersOn();
        ruleHandlersOn();
    })
}

//-----------------------------------------New-Game-Handlers------------------------------------------------------------------------


function newGameHandlers()
{
    $newGame.click(function(e){
        $("#popup-section-new-game").css("display","flex");
        navHandlersOff();
        $choiceButtons.prop("disabled",true);
    });

    $("#x-button-game").click(function(e){
        $("#popup-section-new-game").css("display","none");
        $choiceButtons.prop("disabled",false);
        newGameHandlers();
        navHandlersOn();
        ruleHandlersOn();
        aboutHandlersOn();
        hintHandlers();
    });

    $newGameButton.click(function(e){
        $("#popup-section-new-game").css("display","none");
        reset();
        newGameHandlers();
        navHandlersOn();
        ruleHandlersOn();
        aboutHandlersOn();
        hintHandlers();
    });
}

//-------------------------------------Hint-Handlers-----------------------------------------------------------


function hintHandlers()
{
    $hintButton.click(function(e){
        generateNewHint();
    });
}






