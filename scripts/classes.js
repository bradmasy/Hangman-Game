class Player
{
 
    constructor()
    {
        this.attempts = 0;
        this.score = 0;
        this.wordsDone = [];
        this.gamesPlayed = 0;
    }

    incrementScore()
    {
        this.score++;
    }

    incrementAttempts()
    {
        this.attempts++;
    }

    documentWordDone(wordNumber)
    {
        this.wordsDone.push(wordNumber);
    }

    getAttempts()
    {
        return this.attempts;
    }

    reset()
    {
        this.score = 0;
        this.attempts = 0;
        this.gamesPlayed++;
    }

    addWord(word)
    {
        this.wordsDone.push(word);
    }
}

class HangmanWord{
    constructor(word,hints)
    {
        this.word = word;
        this.hints = [];
        
        hints.forEach(each => {
            this.hints.push(each);
        })
    }
}
class Game
{
    constructor(player)
    {
        this.player = player;
    }

    displayAttempts() {
        $popup.text(`You have made ${this.player.attempts} bad attempt(s) out of
         ${amountOfAttempts}.${amountOfAttempts - this.player.attempts} wrong attempts left.`);
        // $popup.css("display","block");
    }
}