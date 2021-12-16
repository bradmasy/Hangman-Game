/**
 * Brad Masciotra Final Project JavaScript Code
 * 
 * December 4th 2021
 * @version 1.9 
 */


/**
 * Represents a player in the game.
 */
class Player {

   /**
    * The constructor for a player object.
    */
    constructor() {
        this.attempts = 0;
        this.trys = 0;
        this.score = 0;
        this.wordsDone = [];
        this.gamesPlayed = 0;
    }

    /**
     * Increments the player score.
     */
    incrementScore() {
        this.score++;
    }

    /**
     * Increments the players attempt at each word.
     */
    incrementAttempts() {
        this.attempts++;
    }

    /**
     * Gets the number of attempts the player has had on the current word.
     * 
     * @returns the number of attempts the player has had on the current word.
     */
    getAttempts() {
        return this.attempts;
    }

    /**
     * Resets the players stats for the next round and increments the amount of games played.
     */
    reset() {
        
        this.attempts = 0;
        this.gamesPlayed++;
    }

    /**
     * Pushes the word to the players archive of completed words.
     * 
     * @param {*} word the word the player has guessed.
     */
    addWord(word) {
        this.wordsDone.push(word);
    }

    /**
     * Displays the words the player has guessed correct.
     * 
     * @returns the list of words the player has guessed as a formatted string.
     */
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

/**
 * Represents a hangman word object.
 */
class HangmanWord {

    /**
     * Constructor for a hangman word.
     * 
     * @param {*} word the word that the object is representing. 
     * @param {*} hints the hints for the word.
     */
    constructor(word, hints) {
        this.word = word;
        this.hints = [];

        hints.forEach(each => {
            this.hints.push(each);
        }) 
    }
}

