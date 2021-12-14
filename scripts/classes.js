/**
 * Brad Masciotra Final Project JavaScript Code
 * 
 * December 4th 2021
 * @version 1.7
 */


// constants
/*
const $hangman_image = $("#main-game-img");
const max = 7;
const min = 0;
const hintMin = 1;
const hintMax = 3;
const $numberButtons = $("#number-buttons");
const $firstLetterButtons = $("#first-letter-buttons");
const $secondLetterButtons = $("#second-letter-buttons");
const $shiftToggle = $("#upper-lower-toggle");
const $xButton = $("#x-button");
const $hintsSection = $("#hints");
const $popup = $("#popup");
const $content = $("#content")
const amountOfAttempts = 6;
const $ruleButton = $("#rules");
const $aboutButton = $("#about");
const $newGame = $("#new-game");
const $navButtons = $(".nav-button");
const $hintButton = $("#hint");
const $shiftButton = $("#shift");
const maxIncorrectGuesses = 6;
const $popupHowTo = $("#popup-section-how-to");
const $newGameButton = $("#new-game-button");
const $playerCardButton = $("#player-card-button");
const $playerCardSection = $("#player-card");
const $cardInfo = $("#card-info");
const $xButtonCard = $("#x-button-card");

//these signifiy the end of the animation frames
const phaseOneImageNumber = 35;
const phaseTwoImageNumber = 65;
const phaseThreeImageNumber = 85;
const phaseFourImageNumber = 105;
const phaseFiveImageNumber = 125;
const phaseSixImageNumber = 145;
let questionReferences = [];

// global scope variables
let hangmanAnimationHandler;
let $wordDisplayed = $("#choices");
let endHandler;
let endImageSrc;
let theChosenWord;
let letterTiles;
let mainSrc;
let $choiceButtons;
let letterCount;
let hangmanWordObjectInPlay;
let playerAttempt = 0;
let imageCounter = 0;
//let player = new Player();
//let game = new Game(player);
let randomHintNumber = generateRandomHintNum();
let listOfWordsIndexesDone = [];
let listOfHintIndexesDone = [];
let gamesPlayed = 0;
let playerCorrectGuesses = 0;
let playerIncorrectGuesses = 0;
let hintCount = 0;
let firstWord = true;
let randomArrayOfQuestionOrder = [];
let indiceArray = [];

//alphabet string
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const alpha_one = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"];
const alpha_two = ["q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


*/
class Player {

   
    constructor() {
        this.attempts = 0;
        this.trys = 0;
        this.score = 0;
        this.wordsDone = [];
        this.gamesPlayed = 0;
    }

    incrementScore() {
        this.score++;
    }

    incrementAttempts() {
        this.attempts++;
    }

    documentWordDone(wordNumber) {
        this.wordsDone.push(wordNumber);
    }

    getAttempts() {
        return this.attempts;
    }

    reset() {
        
        this.attempts = 0;
        this.gamesPlayed++;
    }

    addWord(word) {
        this.wordsDone.push(word);
    }

    displayWords()
    {
        let finishedString = null;
       
        if(this.wordsDone.length == 0)
        {
            finishedString = "no words have been completed.";
        }
        else
        {
            if(this.wordsDone.length == 1)
            {
               finishedString = this.wordsDone[0] + "."; 
                
            }
            else
            {
                finishedString = "";
                for(i = 0; i < this.wordsDone.length; i++)
                {
                    if(i == this.wordsDone.length - 1)
                    {
                        finishedString += this.wordsDone[i] + ".";
                    }
                    else{
                        finishedString += this.wordsDone[i] + ", ";
                    }
                }
            }
        }
     
        return finishedString;
    }
}

class HangmanWord {
    constructor(word, hints) {
        this.word = word;
        this.hints = [];

        hints.forEach(each => {
            this.hints.push(each);
        })
    }
}
class Game {
    // static constants for the class
   

    constructor(player) {
        this.player = player;
    }

    createLetterTiles(word) {
        for (i = 0; i < word.length; i++) {
            let eachLetter = word[i];
            letterTile = $("<p></p>");
            letterTile.addClass("letterTiles");
            $wordDisplayed.append(letterTile);
        }

        letterTiles = $(".letterTiles");
    }

    createRandomArrayIndex() {
        var arr = [];
    
        for (i = 0; i < max; i++) {
    
            arr.push(i);
        }
        console.log(arr);
        return arr;
    }
    
    randomizeQuestionArray(array) {

        i = 0
        while (true) {
            //let min = 0;
            //let max = 4;
            let randomIndex = Math.floor(Math.random() * (max - min)) + min;
            let arrayVal = array[randomIndex]
            if (randomArrayOfQuestionOrder.includes(arrayVal)) {
                continue;
            }
            else {
                randomArrayOfQuestionOrder.push(arrayVal);
    
                if (randomArrayOfQuestionOrder.length == 4) {
                    break;
                }
            }
        }
    }

    chooseWord() {

        if (randomArrayOfQuestionOrder != 0) {
            let ChosenIndexVal = randomArrayOfQuestionOrder[0]; // choose the first index after its been radnomized
            let wordObject = questionReferences[ChosenIndexVal];
            randomArrayOfQuestionOrder.shift(); // delete the index chosen from the list
            hangmanWordObjectInPlay = wordObject; // the chosen object is now the object in play

            listOfHintIndexesDone.push(randomHintNumber);
            listOfWordsIndexesDone.push(ChosenIndexVal);
            theChosenWord = wordObject.word;
            createLetterTiles(theChosenWord);
            letterCount = theChosenWord.length;
            $hintsSection.text(`Hint: "${wordObject.hints[randomHintNumber]}..."`);
        }
        else {
            // edit this screen more if no more words maybe a reset button.
            $hintsSection.text("No More Words Left.");
        }
    }

    fetchJSON() {
        console.log(randomArrayOfQuestionOrder);
        let randomArrayQuestionIndex = null;
        fetch("./scripts/words-two.json")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                let hints = [];
                let eachData = data[i];

                hints.push(eachData.hintOne);
                hints.push(eachData.hintTwo);
                hints.push(eachData.hintThree);
                let wordOb = new HangmanWord(eachData.word, hints); // creating a hangman word object

                questionReferences.push(wordOb);
            }

            randomArrayQuestionIndex = createRandomArrayIndex();
            randomizeQuestionArray(randomArrayQuestionIndex);

            chooseWord();
        })

    }

    createLetterChoiceButtons(theArray, section) {
        theArray.forEach(function (eachLetter) {
            let $eachButton = $("<button></button>");
            $eachButton.html(eachLetter.toUpperCase());
            $eachButton.val(eachLetter.toUpperCase());
            $eachButton.addClass("choice-button")
            $choiceButtons = $(".choice-button");
    
            section.append($eachButton);
        })
    }
    
    displayAttempts() {
        $popup.text(`You have made ${player.attempts} bad attempt(s) out of
         ${amountOfAttempts}.${amountOfAttempts - player.attempts} wrong attempts left.`);
        // $popup.css("display","block");
    }
}