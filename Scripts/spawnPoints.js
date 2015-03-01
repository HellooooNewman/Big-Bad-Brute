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
	Player = gameObject.Find("MainPlayer");
}

function  Update(){

	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	if(GUIScript.gameStart){

		if (GUIScript.score < 100) {
			enemyLevel = 0;
		} else if(GUIScript.score >= 100 && GUIScript.score <= 500){
			enemyLevel = 1;
		} else if(GUIScript.score >= 500 && GUIScript.score <= 1000){
			enemyLevel = 2;
		} else if(GUIScript.score > 1000){
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