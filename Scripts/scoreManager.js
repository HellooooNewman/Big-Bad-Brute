#pragma strict

//Two Player or singlePlayer
	
	var twoPlayer : boolean;

//Selecting the playerScripts

	private var player1Script: player_controller;
	private var player2Script: player_controller;

//Player Hud

	var livesUI : UI.Text[];
	var scoreUI : UI.Text[];
	var killCountUI : UI.Text[];
	var HealthBar : RectTransform[];
	var characterFaces : GameObject[];
	var characterFacesArray : Sprite[];
	var progressBar : RectTransform;
	private var progressRemaining : float;
	private var progressPosition : float;

//Player Stats

	var incomingScore1 : float;
	var score1 : float;
	private var animatedScore1 : int = 0;
	var endScore1 : int = 0;

	private var lives1 : int;
	private var health1 : float;
	private var healthTotal1 : float;
	private var killCount1 : float;
	private var selected1CharacterTexture : int;

	var incomingScore2 : float;
	var score2 : float;
	private var animatedScore2 : int = 0;
	var endScore2 : int = 0;

	private var lives2 : int;
	private var health2 : float;
	private var healthTotal2 : float;
	private var killCount2 : float;
	private var selected2CharacterTexture : int;



//Timers

	var timerUI : UI.Text;
	var startTimerUI : UI.Text;
	var startTimerCanvas : Canvas;

	var startTimer : float = 5;
	var timer : float;
	var startTimerEnd : boolean;
	var gameStart : boolean = false;

//Game Over Screen

	var gameOverUI : UI.Text;
	var gameUI : Canvas;
	var gameOverScreen : Canvas;
	var gameoverScore : UI.Text;
	public var pauseToggle : boolean = true;
	private var gameOver : boolean = false;

//Pause Screen

	var PauseUI : Canvas;

//points mulitpliers
	var pointMultiplier : UI.Text;
	var pointMultiplierBg : UI.Image;
	var doublePtsOn : boolean = false; 
	var doublePtsTimer : float = 20;
	var triplePtsOn : boolean = false;
	var triplePtsTimer : float = 20;

//stages
	var StageUI : UI.Text;
	var stage : int;
	var stageChange : boolean;
	var stageChangeEnd : boolean = false;
	private var stageTotal : float = 300;
	public var stage1PointAmount : int = 300;
	public var stage2PointAmount : int = 600;
	public var stage3PointAmount : int = 1000;

//Enemies on the map
	var enemyTotal : int = 10;
	private var enemyCount : int;
	var Player : GameObject;
	var randomEnemy : GameObject[];
	var spawnTimer : float = 6.0;
	private var nextEnemySpawnTimer : float = 0.0;
	private var prefabRandom : int = 1;


function Start() {

	player1Script = GameObject.Find("MainPlayer1").GetComponent(player_controller);
	if(twoPlayer){
		player2Script = GameObject.Find("MainPlayer2").GetComponent(player_controller);
	}

	stageChange = false;
	stageChangeEnd = false;
	stage = 0;
}

var onetime = false;


function Update(){

	var cameraScript = GameObject.Find("Camera");

	if (Input.GetButtonDown("Pause")) {
		pauseToggle = !pauseToggle;
	}

//-------------Pause Game-------------//
	if(!gameOver && startTimerEnd){
		if(pauseToggle){
			Time.timeScale = 1;
			gameUI.enabled = true;
			gameOverScreen.enabled = false;
			PauseUI.enabled = false;
			gameStart = true;
		} else {
			Time.timeScale = 0;
			gameUI.enabled = false;
			gameOverScreen.enabled = false;
			PauseUI.enabled = true;
			gameOverUI.text = "Pause";
			gameStart = false;
		}
	}
//-------------Pause Game-------------//

	if (animatedScore1 < score1){
		animatedScore1++;
	}

	if (animatedScore2 < score2){
		animatedScore2++;
	}

	scoreUI[0].text = "Score: " + animatedScore1;
	
	if(twoPlayer){
   	 	scoreUI[1].text = "Score: " + animatedScore2;
	}

//-------------Stages-------------//


	
	if(score1 >= stage1PointAmount && score1 <= stage2PointAmount || score2 >= stage1PointAmount && score2 <= stage2PointAmount){
		stage = 1;
		stageTotal = 300;

		if(!stageChangeEnd){
			stageChange = true;
	    } else {
			stageChange = false;
	    }
	    

	    if(stageChange){
			gameStart = false;
			var stage1 = GameObject.Find("stage1").animation.Play();
			
		} else {
			gameStart = true;
		}

    } else if (score1 >= stage2PointAmount && score1 <= stage3PointAmount || score2 >= stage2PointAmount && score2 <= stage3PointAmount){
    	if (!onetime) {
    		Activate();
    		onetime = true;
    	}



		stage = 2;
		stageTotal = 600;

      	if(!stageChangeEnd){
			stageChange = true;
			Debug.Log("new stage has started");
	    } 

	    if(stageChangeEnd){
			Debug.Log("stage change end");
			stageChange = false;
	    }
	    

	    if(stageChange){
			gameStart = false;
			var stage2 = GameObject.Find("stage2").animation.Play();
		} else {
			gameStart = true;
		}

    } else if(score1 > stage3PointAmount || score2 > stage3PointAmount){

		stage = 3;
		stageTotal = 1000;

    }

//-------------Start Timer Countdown-------------//
	

	//Wait til the start timer runs out
	if(startTimer>0){
		gameUI.enabled = false;
		//cameraScript.audio.Pause();
		startTimer -= Time.deltaTime;
		startTimerUI.color = Color.white;
		startTimerUI.fontSize = 35;
		startTimerUI.text = startTimer.ToString("0");
    
		timerUI.enabled = false;
		gameOverScreen.enabled = false;
		startTimerEnd = false;
		pointMultiplier.gameObject.SetActive(false);

		// Show the character face

		selected1CharacterTexture = player1Script.selectedCharacter;
		characterFaces[0].GetComponent(UnityEngine.UI.Image).sprite = characterFacesArray[selected1CharacterTexture];

		if (twoPlayer){
			selected2CharacterTexture = player2Script.selectedCharacter;
			characterFaces[1].GetComponent(UnityEngine.UI.Image).sprite = characterFacesArray[selected2CharacterTexture];
		}
	}

	//5 seconds before the game starts to give the player some time

	if(startTimer<=0 && !startTimerEnd){
		startTimerEnd = true;
		gameUI.enabled = true;
		gameStart = true;
		startTimerCanvas.enabled = false;
	}

//-------------Game Starts Here----------------//

	if(gameStart){

    //----Start timer Fix ------//
	startTimerEnd = true;

//-------------Score - Points Mulitpliers -------------//


	if (triplePtsOn){
		pointMultiplier.gameObject.SetActive(true);
		pointMultiplier.text = "3x";
		pointMultiplierBg.fillAmount = triplePtsTimer/ 20;
		doublePtsOn = false;
		triplePtsTimer -= Time.deltaTime * 2;

		score1 = score1 + (incomingScore1 * 3);
		incomingScore1 = 0;

		score2 = score2 + (incomingScore2 * 3);
		incomingScore2 = 0;
    
		if (triplePtsTimer<=0){
			
			triplePtsOn = false;
			triplePtsTimer = 20.0;

			Debug.Log('triple points off');
		}
	} else if(doublePtsOn){
		pointMultiplier.gameObject.SetActive(true);
		pointMultiplier.text = "2x";
		pointMultiplierBg.fillAmount = doublePtsTimer/20;
    	doublePtsTimer -= Time.deltaTime * 2;

		score1 = score1 + (incomingScore1 * 2);
		incomingScore1 = 0;

		score2 = score2 + (incomingScore2 * 2);
		incomingScore2 = 0;

	    if (doublePtsTimer<=0){
	    	
			doublePtsOn = false;
			doublePtsTimer = 20.0;
			Debug.Log('double points off');
	    } 
	} else {
		score1 += incomingScore1;
		score2 += incomingScore2;
		
		incomingScore1 = 0;
		incomingScore2 = 0;
		pointMultiplier.gameObject.SetActive(false);
	}

//-------------Game Timer Countdown-------------//

	timerUI.fontSize = 24;
	timerUI.enabled = true;

	timer -= Time.deltaTime;
	var minutes : int = timer / 60;
	var seconds : int = timer % 60;
	var gameTimer = String.Format ("{0:00}:{1:00}", minutes, seconds);
	timerUI.color = Color.white;

		//1 minute warning

	if(timer<=60 && timer>=58){
		timerUI.color = Color(242.0/255.0,77.0/255.0,53.0/255.0,1);
	}

		//no time left

	if(timer<=0){
		timerUI.text = "Game Over";
	}

		//standard 

	if (timer>0){
		timerUI.text = "Time: " + gameTimer;
	}

//-------------Stages-------------//

	var realStageNumber : int = stage + 1;
	StageUI.text = "Stage : " + realStageNumber;

//-------------Kill Count-------------//

	killCount1 = player1Script.playerKills;
	killCountUI[0].text = "Kills: " + killCount1;

	if(twoPlayer){
		killCount2 = player2Script.playerKills;
		killCountUI[1].text = "Kills: " + killCount2;
	}

//-------------Health-------------//

	health1 = player1Script.playerHealth;
	healthTotal1 = player1Script.totalHealth;
	var healthRemaining1 = (health1 - healthTotal1);
	var healthPercent1 = (healthRemaining1/healthTotal1);
	var healthPosition1 = (healthPercent1 * 2500.0);
	HealthBar[0].localPosition = new Vector3(healthPosition1, 0, 0);

	

	if(twoPlayer){
		health2 = player2Script.playerHealth;
		healthTotal2 = player2Script.totalHealth;
		var healthRemaining2 = (health2 - healthTotal2);
		var healthPercent2 = (healthRemaining2/healthTotal2);
		var healthPosition2 = (healthPercent2 * 2500.0);
		HealthBar[1].localPosition = new Vector3(healthPosition2, 0, 0);
	}

//-------------Lives-------------//

	lives1 = player1Script.playerLives;
	livesUI[0].text = "Lives: " + lives1;

	if(twoPlayer){
		lives2 = player2Script.playerLives;
		livesUI[1].text = "Lives: " + lives2;
	}

//-------------game stop--------------//


	} else {
		timer = timer;
		if(player1Script != null){
			player1Script.rigidbody.velocity.x = 0;
		}
		if(twoPlayer){
			//player2Script.rigidbody.velocity.x = 0;
		}
	}

//---------------Progress Bar-----------------//

 
	var score = score1 + score2;
	var progressTotal = stageTotal;
	progressRemaining = score / progressTotal;
	progressPosition = (progressRemaining * 800);
	progressBar.localPosition = new Vector3(progressPosition, -223, 0);



	if (twoPlayer){

		if(player1Script.playerLives <= 0 && player2Script.playerLives <= 0 || timer<=0){
			EndGame();
		}
	} else {
		if (player1Script.playerLives <= 0 || timer<=0){
			EndGame();
		}
	}

}
private var once : boolean = true;

function EndGame(){
	gameOver = true;
	gameOverUI.text = "Game Over";
	gameStart = false;
	gameUI.enabled = false;
	gameOverScreen.enabled = true;
	gameoverScore.text = "" + score1;
	if(once){
		
		getScores();
		
	}
}

function Activate(){
	stageChangeEnd = false;
}

function Score(PlayerNumber : int, incomingScore : int){
	if (PlayerNumber == 1){
		incomingScore1 = incomingScore1;
	} else {
		incomingScore2 = incomingScore2;
	}
}

var highscoreUrl : String ="http://kevinnewman.ca/bbb/highscores.php";    


private var secretKey : String = "123456"; // Edit this value and make sure it's the same as the one stored on the server
var addScoreUrl : String ="http://kevinnewman.ca/bbb/addscore.php?"; //be sure to add a ? to your url

function postScore(name : String) {
    //This connects to a server side php script that will add the name and score to a MySQL DB.
    // Supply it with a string representing the players name and the players score.
    var hash = Md5Sum(name + score1 + secretKey); 
 
    var highscore_url = addScoreUrl + "score_name=" + WWW.EscapeURL(name) + "&score_highscore=" + score1 + "&hash=" + hash;
 
    // Post the URL to the site and create a download object to get the result.
    var hs_post : WWW = WWW(highscore_url);
    yield hs_post; // Wait until the download is done
    if(hs_post.error) {
        print("There was an error posting the high score: " + hs_post.error);
    } else {
    	Debug.Log(highscore_url);
    }
}
var loadingHighscore : UI.Text;

function getScores() {
	loadingHighscore.text = "Loading Scores";
    var hs_get : WWW = WWW(highscoreUrl);
    yield hs_get;
 
    if(hs_get.error) {
    	print("There was an error getting the high score: " + hs_get.error);
    } else {
        loadingHighscore.text = hs_get.text; // this is a GUIText that will display the scores in game.
        once = false;
    }
}

function Md5Sum(strToEncrypt: String){
	var encoding = System.Text.UTF8Encoding();
	var bytes = encoding.GetBytes(strToEncrypt);
 
	// encrypt bytes
	var md5 = System.Security.Cryptography.MD5CryptoServiceProvider();
	var hashBytes:byte[] = md5.ComputeHash(bytes);
 
	// Convert the encrypted bytes back to a string (base 16)
	var hashString = "";
 
	for (var i = 0; i < hashBytes.Length; i++)
	{
		hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
	}
 
	return hashString.PadLeft(32, "0"[0]);
}














// function FindClosestSpawn () : GameObject {
//   // Find all game objects with tag Enemy
//   var spawns : GameObject[];
//   spawns = GameObject.FindGameObjectsWithTag("spawn");

//   var Player : GameObject = GameObject.Find("MainPlayer");
//   //Debug.Log(spawns = GameObject.FindGameObjectsWithTag("spawn").length;);

//   var closest : GameObject; 
//   var distance = Mathf.Infinity; 
//   var position = Player.transform.position;   // Iterate through them and find the closest one
//   for (var spawn : GameObject in spawns)  { 
//     var diff = (spawn.transform.position - position);
//     var curDistance = diff.sqrMagnitude; 
//     if (curDistance < distance) { 
//       closest = spawn; 
//       distance = curDistance; 
//     } 
//   } 
//   return closest;
// }

// function WantedStars(stars){
//   for (var i = 0; i<wantedLevels; i++){
//     var wantedStarClone : GameObject = Instantiate(Resources.Load('Prefabs/Gui/WantedStar'), transform.position, transform.rotation);
//     var Gui  = GameObject.Find("WantedLevels");
//     wantedStarClone.transform.SetParent(Gui.transform, false);
//     wantedStarClone.transform.localPosition = Vector3(wantedLevels * 1.4 ,0,0);
//     wantedStarClone.transform.localScale = Vector3(0.0116076,0.0116076,0.0116076);
//   }
// }

//-------------Fade In----------------//

	

	//myImage.color = new Color(0.0f, 0.0f, 0.0f, Mathf.Lerp(myImage.color.a, 0.0f, Time.deltaTime));
	

//-------------Enemies Respawning-------------//

	// enemyCount = GameObject.FindGameObjectsWithTag("enemy").length;
	
	// 	if (enemyCount<enemyTotal){
	// 		nextEnemySpawnTimer += Time.deltaTime * 2;
	// 		if (nextEnemySpawnTimer>=spawnTimer){
	// 			FindClosestSpawn();
	// 			var spawnItem : GameObject;
	// 			var spawnPosition : Vector3 = FindClosestSpawn().transform.position;
	// 			prefabRandom = Random.Range(0,stage);
	// 			var safeName : String = randomEnemy[prefabRandom].name.ToString();
	// 			spawnItem = Instantiate(Resources.Load('Prefabs/Enemies/'+safeName), spawnPosition, transform.rotation);
	// 			nextEnemySpawnTimer = 0;
	// 		}   
	// 	}