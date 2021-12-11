/**
 * Brad Masciotra Final Project JavaScript Code
 * 
 * December 4th 2021
 * @version 1.0
 */


// constants
const $hangman_image       = $("#main-game-img");
const max                  = 4;
const min                  = 0;
const hintMin              = 1;
const hintMax              = 3;
let $wordDisplayed         = $("#choices");
let $numberButtons         = $("#number-buttons");
const $firstLetterButtons  = $("#first-letter-buttons");
const $secondLetterButtons = $("#second-letter-buttons");
const $shiftToggle         = $("#upper-lower-toggle");
const $xButton             = $("#x-button");
const $hintsSection        = $("#hints");
const $popup               = $("#popup");
let $content               = $("#content")
const amountOfAttempts     = 6;
const $ruleButton          = $("#rules");
const $aboutButton         = $("#about");
const $newGame             = $("#new-game");
const $navButtons          = $(".nav-button");
const $hintButton          = $("#hint");
const $shiftButton         = $("#shift");
const maxIncorrectGuesses  = 6;
const $popupHowTo          = $("#popup-section-how-to");
const $newGameButton       = $("#new-game-button");

//these signifiy the end of the animation frames
const phaseOneImageNumber   = 35;
const phaseTwoImageNumber   = 65;
const phaseThreeImageNumber = 85;
const phaseFourImageNumber  = 105;
const phaseFiveImageNumber  = 125;
const phaseSixImageNumber   = 145;
let questionReferences      = [];

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
let playerAttempt          = 0;
let imageCounter           = 0;
let player                 = new Player();
let game                   = new Game(player);
let randomHintNumber       = generateRandomHintNum();
let listOfWordsIndexesDone = [];
let listOfHintIndexesDone  = [];
let gamesPlayed            = 0;
let playerCorrectGuesses   = 0;
let playerIncorrectGuesses = 0;

let firstWord = true;

//alphabet string
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const alpha_one = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"];
const alpha_two = ["q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];