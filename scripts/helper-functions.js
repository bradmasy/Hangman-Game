/**
 * Generates a random number between the max and the min.
 * 
 * @returns a random number between max and min.
 */
 function generateRandomNum() {
    let randomNum = Math.floor(Math.random() * (max - min) + min);
    return randomNum;
}

function generateRandomHintNum() {
    let randomNum = Math.floor(Math.random() * (hintMax - hintMin) + hintMin);
    return randomNum;
}