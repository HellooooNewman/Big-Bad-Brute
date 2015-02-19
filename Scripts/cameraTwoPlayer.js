//camera distance is based off of distance between player 1 and player 2

var Player1 : Transform;
var Player2 : Transform;

function FixedUpdate(){


	var dist = Vector3.Distance(Player1.position, Player2.position);
	var cameraX = (Player1.position.x - Player2.position.x);

	var player1X = Player1.position.x / 2;
	var player2X = Player2.position.x / 2;

	var player1Y = Player1.position.y / 2;
	var player2Y = Player2.position.y / 2;

	var playerMiddleX : float = player1X + player2X;
	var playerMiddleY : float = player1Y + player2Y;
	dist = Mathf.Clamp(dist, 10f, 500f);


	
	//var cameraRelativeX2 = Player2.TransformPoint(Player2.position);

	//var cameraDivideX = cameraRelativeX.transform.position.x;
	
	//Debug.Log(cameraRelativeX.position.x);
	//Debug.Log(cameraRelativeX2);

	var target = Vector3(playerMiddleX, playerMiddleY,-dist - 8);

	//Debug.Log(Player1.position);
	//Debug.Log(Player2.position);
	//Debug.Log(dist);

	transform.position = Vector3.Slerp(transform.position, target, Time.deltaTime * 3);

}