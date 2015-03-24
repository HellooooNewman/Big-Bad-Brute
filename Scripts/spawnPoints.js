#pragma strict

var enemyTotal : int = 2;
private var enemyCount : int;
private var Player : GameObject;
var randomEnemy : GameObject[];
var spawnTimer : float = 6.0;
private var timer : float = 0.0;
var enemyLevel : int = 0;
private var prefabRandom : int = 1;
var distance : int;

function Start(){
	Player = gameObject.Find("MainPlayer1");
}

function  Update(){

	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	Player = FindClosestPlayer();
	
	if(GUIScript.gameStart){

		if (GUIScript.score1 < 100) {
			enemyLevel = 0;
		} else if(GUIScript.score1 >= 100 && GUIScript.score1 <= 500){
			enemyLevel = 1;
		} else if(GUIScript.score1 >= 500 && GUIScript.score1 <= 1000){
			enemyLevel = 2;
		} else if(GUIScript.score1 > 1000){
			enemyLevel = 3;
		}
 
		var position = Player.transform.position;
		var diff = (transform.position - position);
		var curDistance = diff.sqrMagnitude;

		// Debug.Log(curDistance + 'distance');
		if (curDistance < distance) { 
			if (enemyCount < enemyTotal){
				timer += Time.deltaTime * 2;
				if (timer>=spawnTimer){
					Debug.Log("spawn Enemy");
					enemyCount++;
					var spawnItem : GameObject;
					prefabRandom = Random.Range(0,enemyLevel);
					var safeName : String = randomEnemy[prefabRandom].name.ToString();
					spawnItem = Instantiate(Resources.Load('Prefabs/Enemies/'+safeName), transform.position, transform.rotation);
					timer = 0;
				}		
			}	 
		}
	}
}

function FindClosestPlayer () : GameObject {
  // Find all game objects with tag Enemy
  var players : GameObject[];
  players = GameObject.FindGameObjectsWithTag("Player");

  //Debug.Log(spawns = GameObject.FindGameObjectsWithTag("spawn").length;);

  var closest : GameObject; 
  var distance = Mathf.Infinity; 
  for (var player : GameObject in players)  { 
    var diff = (player.transform.position - transform.position);
    var curDistance = diff.sqrMagnitude; 
    if (curDistance < distance) { 
      closest = player; 
      distance = curDistance; 
    } 
  } 
  return closest;
}
