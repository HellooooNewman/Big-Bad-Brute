#pragma strict

var gui : scoreManager;

function MainMenu () {
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	GUIScript.pauseToggle = false;
	Application.LoadLevel("Menu");
}

function Restart () {
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	GUIScript.pauseToggle = false;
	Application.LoadLevel(Application.loadedLevel);
}

function Resume () {
	gui.pauseToggle = true;
}

function pauseAudio(){
	Debug.Log("pause Audio");
	var cameraScript = GameObject.FindGameObjectWithTag ("MainCamera");
	if (!cameraScript.audio.isPlaying){
		cameraScript.audio.Play();
	} else {
		cameraScript.audio.Pause();
	}
}