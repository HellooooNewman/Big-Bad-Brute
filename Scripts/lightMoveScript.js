#pragma strict

public var smooth : float;
public var mylight : GameObject;
public var adrian : GameObject;
public var cranko : GameObject;
public var mafia : GameObject;
public var convict : GameObject;
public var lightPosition : int;

function FixedUpdate(){

    if(lightPosition == 0){
    	var adrianPosition = adrian.transform.position;
	    var adrianRotation = adrian.transform.rotation;
	    mylight.transform.position = Vector3.Slerp(mylight.transform.position, adrianPosition, smooth * Time.deltaTime); //with lerp
	    mylight.transform.rotation = Quaternion.Slerp (mylight.transform.rotation, adrianRotation, smooth * Time.deltaTime); //with lerp
	}

    if(lightPosition == 1){
    	var crankoPosition = cranko.transform.position;
		var crankoRotation = cranko.transform.rotation;
		mylight.transform.position = Vector3.Slerp(mylight.transform.position, crankoPosition, smooth * Time.deltaTime); //with lerp
		mylight.transform.rotation = Quaternion.Slerp (mylight.transform.rotation, crankoRotation, smooth * Time.deltaTime); //with lerp
	}

    if(lightPosition == 2){
    	var mafiaPosition = mafia.transform.position;
		var mafiaRotation = mafia.transform.rotation;
		mylight.transform.position = Vector3.Slerp(mylight.transform.position, mafiaPosition, smooth * Time.deltaTime); //with lerp
		mylight.transform.rotation = Quaternion.Slerp (mylight.transform.rotation, mafiaRotation, smooth * Time.deltaTime); //with lerp
	}

    if(lightPosition == 3){
    	var convictPosition = convict.transform.position;
		var convictRotation = convict.transform.rotation;
		mylight.transform.position = Vector3.Slerp(mylight.transform.position, convictPosition, smooth * Time.deltaTime); //with lerp
		mylight.transform.rotation = Quaternion.Slerp (mylight.transform.rotation, convictRotation, smooth * Time.deltaTime); //with lerp
	}

	Debug.Log(lightPosition + ' lightPosition');
}