#pragma strict



public var tutorial : UnityEngine.UI.Text;

//duplicate boxcolider Tutorial#, make if statement

function OnTriggerEnter(other: Collider){
	if (other.name == "Tutorial1"){
 		tutorial.text = "Use arrow keys to move";
 	}
 	if (other.name == "Tutorial2"){
 		tutorial.text = "Press 'Space' key to Jump, Double space to double jump";
 	}
 	if (other.name == "Tutorial3"){
 		tutorial.text = "Double jump & arrow down to ground pound";
 	}
 	if (other.name == "Tutorial4"){
 		tutorial.text = "Break destrucable objects to earn points";
 	}
 	if (other.name == "Tutorial5"){
 		tutorial.text = "Larger Objects earn greater points";
 	}
 	if (other.name == "Tutorial6"){
 		tutorial.text = "Click to attack, Earn points on each kill";
 	}
 	if (other.name == "Tutorial7"){
 		tutorial.text = "There are 3 stages of enemys. Higher the boss, greater the points";
 	}
 	if (other.name == "Tutorial8"){
 		tutorial.text = "stages";
 	}

}
 
function OnTriggerExit(other: Collider){

  	tutorial.text = "";

}