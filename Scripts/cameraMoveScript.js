#pragma strict

public var smooth : float;
public var camera : GameObject;
public var charView : GameObject;
public var mainView : GameObject;
public var levelView : GameObject;
public var camPosition : int;


function FixedUpdate(){

    if(camPosition == 1){
    	var charPosition = charView.transform.position;
	    var charRotation = charView.transform.rotation;
	    // Camera.main.transform.position = charPosition; //no lerm
	    Camera.main.transform.position = Vector3.Slerp(Camera.main.transform.position, charPosition, smooth * Time.deltaTime); //with lerp
	    // Camera.main.transform.rotation = charRotation; //no lerp
	    Camera.main.transform.rotation = Quaternion.Slerp (Camera.main.transform.rotation, charRotation, smooth * Time.deltaTime); //with lerp
	}

    if(camPosition == 2){
    	var mainPosition = mainView.transform.position;
		var mainRotation = mainView.transform.rotation;
		// Camera.main.transform.position = mainPosition; // no lerp
		Camera.main.transform.position = Vector3.Slerp(Camera.main.transform.position, mainPosition, smooth * Time.deltaTime); //with lerp
		// Camera.main.transform.rotation = mainRotation; // no lerp
		Camera.main.transform.rotation = Quaternion.Slerp (Camera.main.transform.rotation, mainRotation, smooth * Time.deltaTime); //with lerp
	}

    if(camPosition == 3){
    	var levelPosition = levelView.transform.position;
		var levelRotation = levelView.transform.rotation;
		// Camera.main.transform.position = mainPosition; // no lerp
		Camera.main.transform.position = Vector3.Slerp(Camera.main.transform.position, levelPosition, smooth * Time.deltaTime); //with lerp
		// Camera.main.transform.rotation = mainRotation; // no lerp
		Camera.main.transform.rotation = Quaternion.Slerp (Camera.main.transform.rotation, levelRotation, smooth * Time.deltaTime); //with lerp
	}

	Debug.Log(camPosition + 'camPosition');
}