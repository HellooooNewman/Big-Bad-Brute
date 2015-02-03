#pragma strict

var target : Transform;
var distance = 13;
var height = 0;
var smooth :float = 1.5;
var increaseView : float = 8;


function FixedUpdate () {


	var GUIScript : scoreManager = FindObjectOfType(scoreManager);

	if(GUIScript.gameStart){
		var playerScript : player_controller = FindObjectOfType(player_controller);
		var wantedPosition = target.TransformPoint(0, height, -distance);

		/*-----------If double is on, add more to the camera offset------------*/


		if(Input.GetAxis("Horizontal") && playerScript.doubleSpeed){
			wantedPosition = target.TransformPoint(20, height, -distance);
		} else if(Input.GetAxis("Horizontal")) {
			wantedPosition = target.TransformPoint(10, height, -distance);
		}

		/*-----------If the charcter enters a camera area move the camera back------------*/

		if(playerScript.CameraChangeLeft){
			wantedPosition = target.TransformPoint(5, 3, -20);
			transform.position = Vector3.Slerp(transform.position, wantedPosition, Time.deltaTime * 2);
		}else {
			transform.position = Vector3.Slerp(transform.position, wantedPosition, Time.deltaTime * 0.9);
		}
	}
}