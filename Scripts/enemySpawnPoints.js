#pragma strict

var enemyTotal : int = 10;
private var enemyCount : int;
var Player : GameObject;
var randomEnemy : GameObject[];
var timer : float = 0.0;

function  Update(){
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);

	

	if(GUIScript.gameStart){
		enemyCount = GameObject.FindGameObjectsWithTag("enemy").length;
		if (enemyCount<enemyTotal){
			
			timer += Time.deltaTime * 2;
			if (timer>=4){
				FindClosestSpawn();
				var spawnItem : GameObject;
				var spawnPosition : Vector3 = FindClosestSpawn().transform.position;
				var prefabRandom = Random.Range(0,randomEnemy.length);
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

