#pragma strict

var gui : scoreManager;

function MainMenu () {
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	Debug.Log("pause");
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
	var cameraScript = GameObject.Find("Camera");
	if (!cameraScript.audio.isPlaying){
		cameraScript.audio.Play();
	} else {
		cameraScript.audio.Pause();
	}
}