#pragma strict

var enemyTotal : int = 3;
private var enemyCount : int;
var Player : GameObject;
var randomEnemy : GameObject[];
var spawnTimer : float = 6.0;
private var timer : float = 0.0;
var stage : int = 0;
private var prefabRandom : int = 1;

function Start(){
	Player = gameObject.Find("MainPlayer1");
}

function  Update(){
	
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	if(GUIScript.gameStart){

		if(GUIScript.score1 >= 100 && GUIScript.score1 <= 500){
			stage = 1;
			var stage1 = GameObject.Find("stage1").animation.Play();
		} else if(GUIScript.score1 >= 500 && GUIScript.score1 <= 1000){
			stage = 2;
		} else if(GUIScript.score1 > 1000){
			stage = 3;
		}

		enemyCount = GameObject.FindGameObjectsWithTag("enemy").length;
		if (enemyCount <= enemyTotal){
			timer += Time.deltaTime * 2;
			if (timer>=spawnTimer){
				
				var spawnItem : GameObject;
				var spawnPosition : Vector3 = FindClosestSpawn().transform.position;
				prefabRandom = Random.Range(0,stage);
				var safeName : String = randomEnemy[prefabRandom].name.ToString();
				spawnItem = Instantiate(Resources.Load('Prefabs/Enemies/'+safeName), spawnPosition, transform.rotation);
				timer = 0;
			}		
		}
	}
}



function FindClosestSpawn () : GameObject {
	// Find all game objects with tag Enemy
	var spawns : GameObject[];
	spawns = GameObject.FindGameObjectsWithTag("spawn");
	//Debug.Log(spawns = GameObject.FindGameObjectsWithTag("spawn").length;);

	var closest : GameObject; 
	var distance = Mathf.Infinity; 
	var position = Player.transform.position; 	// Iterate through them and find the closest one
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

