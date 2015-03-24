#pragma strict

private var Player1 : Transform;
private var Player2 : Transform;

private var target1 : Vector3;
private var target2 : Transform;
private var SinglePlayerTarget : Transform;
var distance = 13;
var height : float = 0.0;

var increaseView : float = 8;
private var smooth : float;

private var stage : GameObject;
private var stageChangeCamera : boolean = false;

function Start(){

	Player1 = gameObject.Find('MainPlayer1').transform;
	
	stage = gameObject.Find("StageChange1");
	

	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	if (GUIScript.twoPlayer){
		Player1 = gameObject.Find('MainPlayer1').transform;
		Player2 = gameObject.Find('MainPlayer2').transform;
	} else {
		target1 = gameObject.Find("MainPlayer1").transform.position;
	}
}

function FixedUpdate () {


	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	

	if (GUIScript.stage == 2){
		Debug.Log("stage 2 camera");
		stage = gameObject.Find("StageChange2");
	}
	


	if(GUIScript.gameStart){

	/*-----------If the charcter enters a camera area move the camera back------------*/

		if(Player2 == null || Player1 == null){
			if (Player2 == null){
				target2 = Player1;
			} else {
				target2 = Player2;
			}
			smooth = 1;
			var playerScript : player_controller = FindObjectOfType(player_controller);
			var wantedPosition = target2.TransformPoint(0, height, -distance);

			var xPosition = playerScript.rigidbody.velocity.x;
			var yPosition = playerScript.rigidbody.velocity.y / 2;
			
			if(playerScript.CameraChangeLeft){
				wantedPosition = target2.TransformPoint(5, 3, -15);
				transform.position = Vector3.Slerp(transform.position, wantedPosition, Time.deltaTime * smooth);
				Debug.Log("change");
			} else {



				if ( Mathf.Round(yPosition) == 0){
					height = 0;
				} else if(yPosition > 0) {
					height = height + yPosition;
					height = Mathf.Clamp(height, -15.0, 5.0);
				} else if(yPosition < 0){
					height = yPosition;
					height = Mathf.Clamp(height, -15.0, 5.0);
				}

				if(playerScript.movingRight){
					xPosition = Mathf.Clamp(xPosition, -14.0, 14.0);
				} else {
					xPosition = Mathf.Clamp(-xPosition, -14.0, 14.0);
				}
				if(Input.GetAxis("Horizontal1") && playerScript.doubleSpeed){
					wantedPosition = target2.TransformPoint(18, height, -distance);
				} else if(Input.GetAxis("Horizontal1")) {
					wantedPosition = target2.TransformPoint(xPosition, height, -distance);
				}
				transform.position = Vector3.Lerp(transform.position, wantedPosition, Time.deltaTime * smooth);
			}

			if(playerScript.playerLives <=0 || GUIScript.timer <= 0){

				var Rotation = Quaternion.Euler(Vector3(340,0,0));
				transform.rotation = Quaternion.Slerp (transform.rotation, Rotation, 0.2 * Time.deltaTime); //with lerp

				wantedPosition = target2.TransformPoint(0, -0.5, -3);
				transform.position = Vector3.Slerp(transform.position, wantedPosition, Time.deltaTime * 0.4);
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

			target1 = Vector3(playerMiddleX, playerMiddleY,-dist - 8);
			transform.position = Vector3.Slerp(transform.position, target1, Time.deltaTime * 3);
		}
	}





/*-----------Stage change------------*/

	if(GUIScript.stageChange){
		if (Mathf.Round(transform.position.x) == Mathf.Round(stage.transform.position.x)){
			GUIScript.stageChangeEnd = true;
		} else {
			transform.position = Vector3.Lerp(transform.position, stage.transform.position, Time.deltaTime * 0.7);
		}

	}
}