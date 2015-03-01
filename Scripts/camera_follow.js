#pragma strict

var target : Transform;
var distance = 13;
var height = 0;

var increaseView : float = 8;
private var smooth : float;

private var smoothier : float = 0.4;

private var stage : GameObject;
private var stageChangeCamera : boolean = false;

function Start(){
	stage = gameObject.Find("StageChange1");
	target = gameObject.Find("MainPlayer").transform;
}

function FixedUpdate () {




	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	var playerScript : player_controller = FindObjectOfType(player_controller);
	var wantedPosition = target.TransformPoint(0, height, -distance);

	if (GUIScript.stage == 2){
		Debug.Log("stage 2 camera");
		stage = gameObject.Find("StageChange2");
	}


	if(GUIScript.gameStart){
		
	/*-----------If double speed is on, add more to the camera offset------------*/

		if(Input.GetAxis("Horizontal") && playerScript.doubleSpeed){
			wantedPosition = target.TransformPoint(18, height, -distance);
		} else if(Input.GetAxis("Horizontal")) {
			wantedPosition = target.TransformPoint(8, height, -distance);
		}

	/*-----------character moves really fast------------*/	

		if(playerScript.rigidbody.velocity.x >= 25 || playerScript.rigidbody.velocity.x <= -25 || playerScript.rigidbody.velocity.y >= 25 || playerScript.rigidbody.velocity.y <= -25){
			var yVelocity : float = Mathf.Abs(playerScript.rigidbody.velocity.y) / 25;
			// Debug.Log(yVelocity);

			smooth = Mathf.Clamp(yVelocity, 0, 2.2);

			var position = Vector3(playerScript.transform.position.x, playerScript.transform.position.y - -height - 10, -distance - 10);

			transform.position = Vector3.Slerp(transform.position, position, Time.deltaTime * smooth);

		} else {
			smooth = 1;
			if(playerScript.CameraChangeLeft){
				wantedPosition = target.TransformPoint(5, 3, -20);
				transform.position = Vector3.Slerp(transform.position, wantedPosition, Time.deltaTime * smooth);
			}else {
				transform.position = Vector3.Lerp(transform.position, wantedPosition, Time.deltaTime * smooth);
			}
		}

	/*-----------If the charcter enters a camera area move the camera back------------*/

		
	}


/*-----------Stage change------------*/

	//will need to figure out a solution for the mulitple stages. possibly reseting the stage number or something

	if(GUIScript.stageChange){
		if (Mathf.Round(transform.position.x) == Mathf.Round(stage.transform.position.x)){
			GUIScript.stageChangeEnd = true;
		} else {
			transform.position = Vector3.Lerp(transform.position, stage.transform.position, Time.deltaTime * 0.7);
		}

	}
}