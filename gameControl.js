var winner = 0;

var alltxt = [];
var solObj = {};

function readFile(file)
{
    var f = new XMLHttpRequest();
    f.open("GET", file, false);
    f.onreadystatechange = function ()
    {
        if(f.readyState === 4)
        {
            if(f.status === 200 || f.status == 0)
            {
                alltxt = f.responseText.split("\n");
            }
        }
    }
    f.send(null);
}

function roll(){
    // If it is the computer's turn, do not do anything
    if (turn == -1 || winner != 0){
        return;
    }
    document.getElementById("myRollWin").innerHTML = "";
    document.getElementById("myHoldWin").innerHTML = "";

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
    document.getElementById("compWinProb").innerHTML = getCompProbability();

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
    document.getElementById("myRollWin").innerHTML = "";
    document.getElementById("myHoldWin").innerHTML = "";
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
    
    turn = 1;
    winner = 0;
    // Select who goes first randomly
    if (Math.random() < 0.5){
        turn *= -1;
    }
    if (turn == -1){
        computerPlay();
    } else {
        document.getElementById("progInfo").innerHTML = "Your turn!";
        document.getElementById("progInfo").style.color = "green";
        document.getElementById("compWinProb").innerHTML = getCompProbability();
    }

    
}

// This function is called to make the computer play his turn
function computerPlay(){
    if (turn != -1){
        return;
    }

    document.getElementById("progInfo").innerHTML = "Computer's turn...";
    document.getElementById("progInfo").style.color = "black";
    document.getElementById("compWinProb").innerHTML = getCompProbability();


    // Decide to roll or not
    // The returned value is an array: [Roll win %, Hold win %]
    var decisionsArray = getProbabilities();
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
    var compScore = parseInt(document.getElementById("compScore").innerHTML);
    var playerScore = parseInt(document.getElementById("playerScore").innerHTML);
    var turnScore = parseInt(document.getElementById("turnScore").innerHTML);

    if (compScore + turnScore >= 100){
        return [0.0,1.0];
    } else {
        return solObj[[compScore, playerScore, turnScore]];
    }

}

function pageLoad(){
    // Load the probabilities file, then call newGame()

    
    readFile('PigProbabilities.txt', document.getElementById('test'));

    // Parse the text and save it into an object
    for(i = 0; i < alltxt.length; i++){
        els = alltxt[i].split(",");
        solObj[[parseInt(els[0]), parseInt(els[1]), parseInt(els[2])]] = [parseFloat(els[3]).toFixed(5), parseFloat(els[4]).toFixed(5)];
    }

    newGame();
}

function getCompProbability(){
    var compScore = parseInt(document.getElementById("compScore").innerHTML);
    var playerScore = parseInt(document.getElementById("playerScore").innerHTML);
    var turnScore = parseInt(document.getElementById("turnScore").innerHTML);
    
    
    
    
    if (turn == -1){
        if (compScore + turnScore >= 100){
            return 1.0;
        }
        probs = solObj[[compScore, playerScore, turnScore]];
        if (probs[0] > probs[1]){
            return parseFloat(probs[0]).toFixed(5);
        } else {
            return parseFloat(probs[1]).toFixed(5);
        }
    } else {
        if (playerScore + turnScore >= 100){
            return 0.0;
        }

        probs = solObj[[playerScore, compScore, turnScore]];
        if (probs[0] > probs[1]){
            return parseFloat(1-probs[0]).toFixed(5);
        } else {
            return parseFloat(1-probs[1]).toFixed(5);
        }
    }

}

function showHint(){
    if (turn != 1){
        return;
    }
    var compScore = parseInt(document.getElementById("compScore").innerHTML);
    var playerScore = parseInt(document.getElementById("playerScore").innerHTML);
    var turnScore = parseInt(document.getElementById("turnScore").innerHTML);

    var rollProb = 0;
    var holdProb = 0;

    if (playerScore + turnScore >= 100){
        rollProb = "?";
        holdProb = 1.0;
    } else {
        p = solObj[[playerScore, compScore, turnScore]];
        rollProb = p[0];
        holdProb = p[1];
    }

    document.getElementById("myRollWin").innerHTML = rollProb;
    document.getElementById("myHoldWin").innerHTML = holdProb;

    if (rollProb > holdProb){
        document.getElementById("myRollWin").style.color = "green";
        document.getElementById("myHoldWin").style.color = "red";
    } else {
        document.getElementById("myHoldWin").style.color = "green";
        document.getElementById("myRollWin").style.color = "red";
    }

}