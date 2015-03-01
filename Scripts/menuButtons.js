#pragma strict

public var camPosition : int;
public var lightPosition : int;
public var smooth : int;
public var MainCamera : GameObject;
public var Light : GameObject;

function Start(){
	camPosition = 1;
	Time.timeScale = 1;
}

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

function CreditsView(){
	var whichButton: cameraMoveScript = MainCamera.GetComponent(cameraMoveScript);
	camPosition = 4;
	smooth = 3;
	whichButton.camPosition = camPosition;
	whichButton.smooth = smooth;
}

function Bar(){
	Application.LoadLevel('barScene');
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	PlayerPrefs.SetInt("whichCharacter", (whichCharacter.lightPosition));
}

function Alley(){
	Application.LoadLevel('alleyScene');
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	PlayerPrefs.SetInt("whichCharacter", (whichCharacter.lightPosition));
}

function City(){
	Application.LoadLevel('cityScene');
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	PlayerPrefs.SetInt("whichCharacter", (whichCharacter.lightPosition));
}

function Park(){
	Application.LoadLevel('subwayScene');
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	PlayerPrefs.SetInt("whichCharacter", (whichCharacter.lightPosition));
}

function Multiplayer(){
	Application.LoadLevel('twoplayerSingleCamera');
}

function Adrian(){
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	whichCharacter.lightPosition = 0;
}

function Cranko(){
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	whichCharacter.lightPosition = 1;
}

function Mafia(){
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	whichCharacter.lightPosition = 2;
}

function Convict(){
	var characterLight = GameObject.FindWithTag("Light");
	var whichCharacter = characterLight.GetComponent(lightMoveScript);
	whichCharacter.lightPosition = 3;
}