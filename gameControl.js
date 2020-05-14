function roll(){
    var rollElement = document.getElementById("Roll");
    var rollNum = Math.floor(Math.random() * 6 + 1);
    rollElement.innerHTML = rollNum;

    if (rollNum == 1){
        document.getElementById("turnScore").innerHTML = 0;
        document.getElementById("RollHistory").innerHTML = "-"
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

    var c1 = Math.floor(Math.random() * 256 + 1);
    var c2 = Math.floor(Math.random() * 256 + 1);
    var c3 = Math.floor(Math.random() * 256 + 1);
    var color = "rgb(" + c1 + "," + c2 + "," + c3 + ")";

    document.getElementById("Roll").style.color = color;
}

function hold(){
    var ptsWon = parseInt(document.getElementById("turnScore").innerHTML);

    var player = document.getElementById("playerScore");
    var currentScore = parseInt(player.innerHTML);

    player.innerHTML = currentScore + ptsWon;
    document.getElementById("turnScore").innerHTML = 0;
    document.getElementById("RollHistory").innerHTML = "-"

}