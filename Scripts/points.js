#pragma strict

var pointAmount : int = 10;

function OnTriggerEnter(other : Collider){

	if(other.tag == "Player"){
		var playerScript = other.gameObject.GetComponent(player_controller);
		var GUIScript : scoreManager = FindObjectOfType(scoreManager);
		
		var playerNumber : int = playerScript.playerNumber;

		if(playerNumber == 1){
			GUIScript.incomingScore1 = pointAmount;
		} else {
			GUIScript.incomingScore2 = pointAmount;
		}

		var PointsClone : GameObject;
		PointsClone = Instantiate(Resources.Load('Prefabs/PopUps/10pts'), Vector3(transform.position.x, transform.position.y + 3, transform.position.z - 3), Quaternion.Euler(0,0,0));

		//add the right amount of points
		var pointsTotal = gameObject.Find("PointsText").GetComponent(UI.Text);
	    pointsTotal.text = " " + pointAmount + "pts";
	    pointsTotal.fontSize = 14;


		Destroy(gameObject);
	}

	Destroy(gameObject, 20);
}