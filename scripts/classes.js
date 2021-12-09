class Player
{
 
    constructor()
    {
        this.attempts = 0;
        this.score = 0;
        this.wordsDone = [];
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
}


class Game{
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