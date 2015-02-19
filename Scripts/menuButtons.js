#pragma strict

public var camPosition : int;
public var lightPosition : int;
public var smooth : int;
public var MainCamera : GameObject;
public var Light : GameObject;

function CharacterView(){
	var whichButton: cameraMoveScript = MainCamera.GetComponent(cameraMoveScript);
	camPosition = 1;
	smooth = 2;
	whichButton.camPosition = camPosition;
	whichButton.smooth = smooth;
}

function MainView(){
	var whichButton: cameraMoveScript = MainCamera.GetComponent(cameraMoveScript);
	camPosition = 2;
	smooth = 2;
	whichButton.camPosition = camPosition;
	whichButton.smooth = smooth;
}

function LevelView(){
	var whichButton: cameraMoveScript = MainCamera.GetComponent(cameraMoveScript);
	camPosition = 3;
	smooth = 1;
	whichButton.camPosition = camPosition;
	whichButton.smooth = smooth;
}

function Play(){
	Application.LoadLevel('mainScene');
}

function Adrian(){
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	whichCharacter.lightPosition = 1;
}

function Cranko(){
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	whichCharacter.lightPosition = 2;
}

function Mafia(){
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	whichCharacter.lightPosition = 3;
}

function Convict(){
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	whichCharacter.lightPosition = 4;
}