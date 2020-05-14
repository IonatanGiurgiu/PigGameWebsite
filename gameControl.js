var winner = 0;

function roll(){
    // If it is the computer's turn, do not do anything
    if (turn == -1 || winner != 0){
        return;
    }
    if (document.getElementById("turnScore").innerHTML == 0){
        document.getElementById("RollHistory").innerHTML = "-"
    }
    increaseDice();
}

function increaseDice(){
    var rollElement = document.getElementById("Roll");
    var rollNum = Math.floor(Math.random() * 6 + 1);
    rollElement.innerHTML = rollNum;

    if (rollNum == 1){
        document.getElementById("turnScore").innerHTML = 0;
        document.getElementById("RollHistory").innerHTML = "-";
        turn *= -1;
        if (turn == -1){
            computerPlay();
        } else {
            document.getElementById("progInfo").innerHTML = "Your turn!";
            document.getElementById("progInfo").style.color = "green";
        }
    } else {
        var score = parseInt(document.getElementById("turnScore").innerHTML);
        score += rollNum;
        document.getElementById("turnScore").innerHTML = score;

        var history = document.getElementById("RollHistory");
        if (history.innerHTML === "-"){
            history.innerHTML = rollNum;
        } else{
            history.innerHTML += ", " + rollNum.toString();
        }
    }

    // Change color of roll
    var c1 = Math.floor(Math.random() * 256 + 1);
    var c2 = Math.floor(Math.random() * 256 + 1);
    var c3 = Math.floor(Math.random() * 256 + 1);
    var color = "rgb(" + c1 + "," + c2 + "," + c3 + ")";
    document.getElementById("Roll").style.color = color;


}


function hold(){
    // If it is the computer's turn, do not do anything
    if (turn == -1 || winner != 0){
        return;
    }
    increaseScore();
}

function increaseScore(){
    var ptsWon = parseInt(document.getElementById("turnScore").innerHTML);
    if (turn == 1){
        var player = document.getElementById("playerScore");
    } else {
        var player = document.getElementById("compScore");
    }
    
    var currentScore = parseInt(player.innerHTML);
    var newScore = currentScore + ptsWon;
    player.innerHTML = newScore;

    if (newScore >= 100){
        winner = turn;
        turn = 0;
        if (winner == -1){
            document.getElementById("progInfo").innerHTML = "Computer won!";
            document.getElementById("progInfo").style.color = "red";
        } else {
            document.getElementById("progInfo").innerHTML = "You won!!";
            document.getElementById("progInfo").style.color = "lightgreen";
        }
        return;
        
    }

    document.getElementById("turnScore").innerHTML = 0;
    document.getElementById("Roll").innerHTML = 0;
    if (turn == 1){
        document.getElementById("RollHistory").innerHTML = "-"
    }

    turn *= -1
    if (turn == -1){
        computerPlay();
    } else {
        document.getElementById("progInfo").innerHTML = "Your turn!";
        document.getElementById("progInfo").style.color = "green";
    }

}

// 1 = Player, -1 = Computer
var turn = 1;
function newGame(){
    document.getElementById("turnScore").innerHTML = 0;
    document.getElementById("playerScore").innerHTML = 0;
    document.getElementById("compScore").innerHTML = 0;
    document.getElementById("Roll").innerHTML = 0;
    document.getElementById("RollHistory").innerHTML = "-";

    // Select who goes first randomly
    if (Math.random() < 0.5){
        turn *= -1;
    }
    turn = 1;
    if (turn == -1){
        computerPlay();
    } else {
        document.getElementById("progInfo").innerHTML = "Your turn!";
        document.getElementById("progInfo").style.color = "green";
    }

    
}

// This function is called to make the computer play his turn
function computerPlay(){
    if (turn != -1){
        return;
    }

    document.getElementById("progInfo").innerHTML = "Computer's turn...";
    document.getElementById("progInfo").style.color = "black";


    // Decide to roll or not
    // The returned value is an array: [Roll win %, Hold win %]
    var decisionsArray = getProbabilities()
    var roll = decisionsArray[0] > decisionsArray[1];
    
    setTimeout(function () {
        if (roll){
            increaseDice();
        } else {
            increaseScore();
        }
        computerPlay();
    }, 500);
}

function getProbabilities(){
    // Find out the game state
    var compScore = document.getElementById("compScore").innerHTML;
    var playerScore = document.getElementById("playerScore").innerHTML;
    var turnScore = document.getElementById("turnScore").innerHTML;

    // FIXME: Use the actual pig database

    if (turnScore < 20){
        return [1,0];
    } else {
        return [0,1];
    }
}