//camera distance is based off of distance between player 1 and player 2

private var Player1 : Transform;
private var Player2 : Transform;

private var distance = 13;
private var target : Vector3;
private var SinglePlayerTarget : Transform;

function Start(){
	Player1 = gameObject.Find('MainPlayer1').transform;
	Player2 = gameObject.Find('MainPlayer2').transform;
}

function Update(){

	
	if (Player2 == null || Player1 == null){
		var playerScript : player_controller = FindObjectOfType(player_controller);
		if (Player2 == null){
			SinglePlayerTarget = Player1;
		} else {
			SinglePlayerTarget = Player2;
		}
		

		var wantedPosition = SinglePlayerTarget.TransformPoint(0, 1, -10);

		if(playerScript.CameraChangeLeft){
			wantedPosition = SinglePlayerTarget.TransformPoint(5, 3, -20);
			transform.position = Vector3.Slerp(transform.position, wantedPosition, Time.deltaTime * 2);
		}else {
			transform.position = Vector3.Lerp(transform.position, wantedPosition, Time.deltaTime * 2);
		}

	} else {
		
		var dist = Vector3.Distance(Player1.position, Player2.position);
		var cameraX = (Player1.position.x - Player2.position.x);
	
		var player1X = Player1.position.x / 2;
		var player2X = Player2.position.x / 2;
	
		var player1Y = Player1.position.y / 2;
		var player2Y = Player2.position.y / 2;
	
		var playerMiddleX : float = player1X + player2X;
		var playerMiddleY : float = player1Y + player2Y;
		dist = Mathf.Clamp(dist, 10f, 500f);

	
		target = Vector3(playerMiddleX, playerMiddleY,-dist - 8);
		transform.position = Vector3.Slerp(transform.position, target, Time.deltaTime * 3);
	}


	

}