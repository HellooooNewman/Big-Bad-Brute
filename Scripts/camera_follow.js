#pragma strict

var target : Transform;
var distance = 13;
var height = 0;

var increaseView : float = 8;
private var smooth : float;

var stage : Transform;
private var stageChangeCamera : boolean = false;

var originPosition:Vector3;
var originRotation:Quaternion;
var shake_decay: float;
var shake_intensity: float;

function FixedUpdate () {

	if(shake_intensity > 0){
		transform.position = originPosition + Random.insideUnitSphere * shake_intensity;
		transform.rotation = Quaternion(
		originRotation.x + Random.Range(-shake_intensity,shake_intensity)*.2,
		originRotation.y + Random.Range(-shake_intensity,shake_intensity)*.2,
		originRotation.z + Random.Range(-shake_intensity,shake_intensity)*.2,
		originRotation.w + Random.Range(-shake_intensity,shake_intensity)*.2);
		shake_intensity -= shake_decay;
	}


	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	var playerScript : player_controller = FindObjectOfType(player_controller);
	var wantedPosition = target.TransformPoint(0, height, -distance);

	if(GUIScript.gameStart){
		

		/*-----------If double is on, add more to the camera offset------------*/


		if(Input.GetAxis("Horizontal") && playerScript.doubleSpeed){
			wantedPosition = target.TransformPoint(20, height, -distance);
		} else if(Input.GetAxis("Horizontal")) {
			wantedPosition = target.TransformPoint(10, height, -distance);
		}

		/*-----------If the charcter enters a camera area move the camera back------------*/

		if(playerScript.rigidbody.velocity.x >= 20 || playerScript.rigidbody.velocity.x <= -20){
			Debug.Log("slow down" + playerScript.rigidbody.velocity.x);
			smooth = 3.0;
		} else {
			smooth = 0.9;
		}

		

		if(playerScript.CameraChangeLeft){
			wantedPosition = target.TransformPoint(5, 3, -20);
			transform.position = Vector3.Slerp(transform.position, wantedPosition, Time.deltaTime * smooth);
		}else {
			transform.position = Vector3.Slerp(transform.position, wantedPosition, Time.deltaTime * smooth);
		}
	}

	/*-----------Stage change------------*/

	//will need to figure out a solution for the mulitple stages. possibly reseting the stage number or something

	if(GUIScript.stageChange){

		Debug.Log("stage is changing");
		if (Mathf.Round(transform.position.x) == Mathf.Round(stage.position.x)){
			GUIScript.stageChangeEnd = true;
			Debug.Log("stage is stop");
			Debug.Log(GUIScript.stageChangeEnd);
		} else {
			Debug.Log("going to cutscene");
			transform.position = Vector3.Slerp(transform.position, stage.position, Time.deltaTime * smooth);
		}

	}
}

function Shake(){
   originPosition = transform.position;
   originRotation = transform.rotation;
   shake_intensity = .3;
   shake_decay = 0.002;
}