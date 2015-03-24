#pragma strict

var highScore : UI.Text;
var player1 : UI.Text;
var player2 : UI.Text;

var stringToEdit : String = "";

function Start(){
	PlayerPrefs.SetString("PlayerName", "AAA");
	PlayerPrefs.SetString("Score", "4000");
}

function OnGUI(){
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);

	stringToEdit = GUI.TextField (Rect (10, 10, 200, 20), stringToEdit, 25);

	if(GUI.Button(Rect(240,140,160,40), "Back to Menu")){
		Application.LoadLevel("MainMenu");
	}

	if(GUI.Button(Rect(240,190,160,40), "Clear Scores")){
		PlayerPrefs.DeleteAll();
	}

	var playerHighScore = PlayerPrefs.GetString("PlayerName") + " : " + PlayerPrefs.GetInt("Score") + "pts";

	Debug.Log(PlayerPrefs.GetString("PlayerName"));

	// var data;

	// for (var curInt = 0; curInt < 10; curInt++) {
	//     data[0] = PlayerPrefs.GetInt("PlayerName " + curInt);
	// }

	

	highScore.text =  "Score : " + playerHighScore;
	player1.text =  "BOB 4000 pts";
	player2.text =  "ASA 3400 pts";
	
}