#pragma strict
//UI elements
var timerUI : UI.Text;
var startTimerUI : UI.Text;
var livesUI : UI.Text;
var scoreUI : UI.Text;
var gameOverUI : UI.Text;
var killCountUI : UI.Text;

//Health
var health : float;
var healthTotal : float;
var HealthBar : RectTransform;
var healthScript : Canvas;

var gameUI : Canvas;
var gameOverScreen : Canvas;
private var resume : RectTransform;
public var pauseToggle : boolean = true;

//Health
var lives : int;

//points mulitpliers
var doublePtsOn : boolean = false; 
var doublePtsTimer : float = 10;
var triplePtsOn : boolean = false;
var triplePtsTimer : float = 10;

//start countdown and game countdown timer
var startTimer : float = 5;
var timer : float;
var startTimerEnd : boolean;
var gameStart : boolean = false;

//score from points coming in and the total score
var incomingScore : float;
var score : float;

//Kill Count
var killCount : int;

//stages
private var stage : int;
var stageChange : boolean;
var stageChangeEnd : boolean = false;

//Enemies on the map
var enemyTotal : int = 10;
private var enemyCount : int;
var Player : GameObject;
var randomEnemy : GameObject[];
var spawnTimer : float = 6.0;
private var nextEnemySpawnTimer : float = 0.0;
private var prefabRandom : int = 1;


function Start() {
  stageChange = false;
  stageChangeEnd = false;
  stage = 0;
  healthScript = GameObject.Find("Health").GetComponent(Canvas);
  resume = GameObject.Find("Resume").GetComponent(RectTransform);
}

function Update(){
  
  var cameraScript = GameObject.FindGameObjectWithTag ("MainCamera");
  var playerScript : player_controller = FindObjectOfType(player_controller);


  if (Input.GetKeyDown(KeyCode.Escape)) {
    pauseToggle = !pauseToggle;
  }

  //-------------Pause Game-------------//

  if(pauseToggle){
    Time.timeScale = 1;
    gameUI.enabled = true;
    gameOverScreen.enabled = false;
  } else {
    resume.anchoredPosition3D = Vector3(13,-100,0);
    Time.timeScale = 0;
    gameUI.enabled = false;
    gameOverScreen.enabled = true;
    gameOverUI.text = "Pause";
    killCountUI.enabled = false;
  }

  //-------------Score-------------//

  //points mulitpliers 
  if (triplePtsOn){
    doublePtsOn = false;
    //triple points timer
    triplePtsTimer -= Time.deltaTime * 2;
    //triple the incoming point
    score = score + (incomingScore * 3);
    //display triple points 
    scoreUI.text = "Score: " + score;
    incomingScore = 0;
    
    if (triplePtsTimer<=0){
      triplePtsOn = false;
      Debug.Log('triple points off');
    }
  } else if(doublePtsOn){
    //double points timer
    doublePtsTimer -= Time.deltaTime * 2;
    //double the incoming point
    score = score + (incomingScore * 2);
    //display double points 
    scoreUI.text = "Score: " + score;
    incomingScore = 0;
    if (doublePtsTimer<=0){
      doublePtsOn = false;
      Debug.Log('double points off');
    } 
  } else {
    score = score + incomingScore;
    scoreUI.text = "Score: " + score;
    incomingScore = 0;
  }

  //-------------Stages-------------//

    if(score >= 50 && score <= 500){
      stage = 1;
      Debug.Log(stageChangeEnd + "stage change end");
      Debug.Log(stageChange + "stage change ");
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
        var stage1 = GameObject.Find("stage1").animation.Play();
      } else {
        gameStart = true;
      }
      
      
      
    } else if(score >= 500 && score <= 1000){

      stage = 2;
    } else if(score > 1000){

      stage = 3;
    }



  //-------------Start Timer Countdown-------------//

  //Wait til the start timer runs out
  if(startTimer>0){
    //cameraScript.audio.Pause();
    startTimer -= Time.deltaTime;
    startTimerUI.color = Color.white;
    startTimerUI.fontSize = 35;
    startTimerUI.text = "Game Starts in : " + startTimer.ToString("0");
    
    healthScript.enabled = false;
    timerUI.enabled = false;
    livesUI.enabled = false;
    scoreUI.enabled = false;
    gameOverScreen.enabled = false;
    killCountUI.enabled = false;
    startTimerEnd = false;
  }

  //5 seconds before the game starts to give the player some time

  if(startTimer<=0 && !startTimerEnd){
    startTimerEnd = true;
    gameStart = true;
  }

  if(gameStart){

    //----Start timer Fix ------//
    startTimerEnd = true;

    //-------------Game Timer Countdown-------------//
      //cameraScript.audio.Play();

      healthScript.enabled = true;
      scoreUI.enabled = true;

      startTimerUI.enabled = false;
      timerUI.fontSize = 24;
      timerUI.enabled = true;
      
  	  timer -= Time.deltaTime;
      var minutes : int = timer / 60;
      var seconds : int = timer % 60;
      var gameTimer = String.Format ("{0:00}:{1:00}", minutes, seconds);
      timerUI.color = Color.white;

    //1 minute warning

    if(timer<=60 && timer>=58){
      timerUI.color = Color.red;
    }

    //no time left

    if(timer<=0){
      
      timerUI.text = "Game Over";
    }

    //standard 

    if (timer>0){
      timerUI.text = "Time: " + gameTimer;
    }

  //-------------Kill Count-------------//

      killCountUI.enabled = true;
      killCountUI.text = "Kills: " + killCount;

  //-------------Health-------------//

      health = playerScript.playerHealth;
      healthTotal = playerScript.totalHealth;
      var healthRemaining = (health - healthTotal);
      var healthPercent = (healthRemaining/healthTotal);
      var healthPosition = (healthPercent * 2500.0);
      HealthBar.localPosition = new Vector3(healthPosition, 0, 0);

  //-------------Lives-------------//

      lives = playerScript.playerLives;
      livesUI.enabled = true;
      livesUI.text = "Lives: " + lives;
  


  //-------------Enemies Respawning-------------//

    enemyCount = GameObject.FindGameObjectsWithTag("enemy").length;
    if (enemyCount<enemyTotal){
      nextEnemySpawnTimer += Time.deltaTime * 2;
      if (nextEnemySpawnTimer>=spawnTimer){
        FindClosestSpawn();
        var spawnItem : GameObject;
        var spawnPosition : Vector3 = FindClosestSpawn().transform.position;
        prefabRandom = Random.Range(0,stage);
        var safeName : String = randomEnemy[prefabRandom].name.ToString();
        spawnItem = Instantiate(Resources.Load('Prefabs/Enemies/'+safeName), spawnPosition, transform.rotation);
        nextEnemySpawnTimer = 0;
      }   
    }
  } else {
    timer = timer;
  }



//-------------Game Over-------------//
  //if the player runs out of lives or the time runs out then the game is over

  if(playerScript.playerLives<=0 || timer<=0){
    gameOverUI.text = "Game Over";
    gameStart = false;
    playerScript.rigidbody.velocity.x = 0;
    gameUI.enabled = false;
    gameOverScreen.enabled = true;
    resume.anchoredPosition3D = Vector3(0,100000,0);
  }
}

function FindClosestSpawn () : GameObject {
  // Find all game objects with tag Enemy
  var spawns : GameObject[];
  spawns = GameObject.FindGameObjectsWithTag("spawn");

  var Player : GameObject = GameObject.Find("MainPlayer");
  //Debug.Log(spawns = GameObject.FindGameObjectsWithTag("spawn").length;);

  var closest : GameObject; 
  var distance = Mathf.Infinity; 
  var position = Player.transform.position;   // Iterate through them and find the closest one
  for (var spawn : GameObject in spawns)  { 
    var diff = (spawn.transform.position - position);
    var curDistance = diff.sqrMagnitude; 
    if (curDistance < distance) { 
      closest = spawn; 
      distance = curDistance; 
    } 
  } 
  return closest;
}

// function WantedStars(stars){
//   for (var i = 0; i<wantedLevels; i++){
//     var wantedStarClone : GameObject = Instantiate(Resources.Load('Prefabs/Gui/WantedStar'), transform.position, transform.rotation);
//     var Gui  = GameObject.Find("WantedLevels");
//     wantedStarClone.transform.SetParent(Gui.transform, false);
//     wantedStarClone.transform.localPosition = Vector3(wantedLevels * 1.4 ,0,0);
//     wantedStarClone.transform.localScale = Vector3(0.0116076,0.0116076,0.0116076);
//   }
// }