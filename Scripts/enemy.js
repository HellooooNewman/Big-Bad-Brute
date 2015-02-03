#pragma strict

var mallCop : boolean = false;
var police : boolean = false;
var army : boolean = false;
var robotCop : boolean = false;

var points : int;

var randomSpawn : GameObject[];
var Player : GameObject;
var enemyModel : GameObject;
var EnemyBody : Transform;
var EnemyHealthBar : RectTransform;
var enemyHealthContainer : Canvas;
var enemyHealth = 2.0;
var enemyHealthTotal = 3.0;
var MoveSpeed = 4;
var MaxDist = 10;
var MinDist = 3;
var speed : float; // var to control enemy speed
var gravity = 10;
var moving : boolean  = true;

private var enemySeeing : boolean = false;

var waypoint : Transform[];
private var currentWaypoint : int;

function Start(){
	Player = GameObject.FindWithTag("Player");

}
var timer : float = 0.0;

function Update () {

	//Physics.IgnoreCollision(pickup.collider, collider);
	var playerDirection = transform.InverseTransformPoint(Player.transform.position);
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);

	rigidbody.AddForce(new Vector3(0, -gravity * rigidbody.mass,0)); //custom gravity formula

	/*-----------Enemy Health------------*/

	if (enemyHealth == enemyHealthTotal){
		enemyHealthContainer.enabled = false;
	} else {
		enemyHealthContainer.enabled = true;
		var healthRemaining = (enemyHealth - enemyHealthTotal);
		var healthPercent = (healthRemaining/enemyHealthTotal);
		var healthPosition = (healthPercent * 700.0);
		EnemyHealthBar.localPosition = new Vector3(healthPosition, 0, 0);
	}



	if(GUIScript.gameStart && enemyHealth > 0){

		/*-----------Enemy Sees the chacter------------*/

		if(Vector3.Distance(transform.position,Player.transform.position) < MinDist && playerDirection.y < 3.0){
			enemySeeing = true;
			//if the player is moving look in the direction of the player, and move towards him

			if (moving){
				enemyModel.collider.enabled = true;

				if (playerDirection.x < 0.0){
					transform.Translate(-Vector3.right * MoveSpeed * Time.deltaTime);
					EnemyBody.transform.localScale = new Vector3(transform.localScale.x,transform.localScale.y,transform.localScale.z);
				} else if (playerDirection.x > 0.0){
					transform.Translate(Vector3.right * MoveSpeed * Time.deltaTime);
					EnemyBody.transform.localScale = new Vector3(-transform.localScale.x,transform.localScale.y,transform.localScale.z);
				}
			// if he's not moving, wait 3 seconds then turn off the enemy collider off
			} else {
				timer += Time.deltaTime * 2;
				if (timer>=1.6){
					timer = 0;
					enemyModel.collider.enabled = true;
					moving = true;
				} else {
					//
					enemyModel.collider.enabled = false;
				}
			}
		}

		/*-----------Enemy Stop Seeing the Character------------*/
		

		if(Vector3.Distance(transform.position,Player.transform.position) >= MaxDist) {
			//rigidbody.velocity.x = 0;


		}



		/*-----------Enemy Waypoint------------*/

		if(!mallCop && waypoint !== null){
			if(currentWaypoint < waypoint.length && !enemySeeing && waypoint.Length > 0){

				var target : Vector3 = waypoint[currentWaypoint].position;
				var moveDirection : Vector3 = target - transform.position;
				var velocity = moveDirection.normalized * speed;

				rigidbody.velocity.y = -15;
				rigidbody.velocity = velocity;		
				if(moveDirection.magnitude < .5){
					rigidbody.velocity.x = -15;
					currentWaypoint++;
					EnemyBody.transform.localScale = new Vector3(transform.localScale.x,transform.localScale.y,transform.localScale.z);
				} else if (currentWaypoint == 1){
					EnemyBody.transform.localScale = new Vector3(-transform.localScale.x,transform.localScale.y,transform.localScale.z);
				}
			} else {
				currentWaypoint = 0;
			}

		}
		
	} else {
		rigidbody.velocity.x = 0;
	}
}

function OnTriggerEnter (other : Collider){
	var playerScript : player_controller = FindObjectOfType(player_controller);
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	/*-----------Enemy gets hurt------------*/

	if(other.tag == "weapon" && enemyHealth > 0 ) {
		enemyHealth--;
		/*audio.clip = healthSound;
        audio.Play();*/

        var randomSpawnLength =  Random.Range(0, randomSpawn.Length-1);
		
		var spawnItem : GameObject;
		if (enemyHealth == 0){
			for(var i = 0; i<randomSpawn.Length; i++){
				var prefabRandom = Random.Range(0,randomSpawnLength);
				var safeName : String = randomSpawn[prefabRandom].name.ToString();
				spawnItem = Instantiate(Resources.Load('Prefabs/PickUps/'+safeName), Vector3(Random.Range(-0.1 + transform.position.x, transform.position.x + 0.1),Random.Range(transform.position.y + 0.3,0), 0), transform.rotation);
				var box : BoxCollider;
				box = spawnItem.AddComponent(BoxCollider);
				spawnItem.rigidbody.useGravity = true;
				spawnItem.rigidbody.velocity = transform.TransformDirection(Vector3(0,Random.Range(transform.position.y + 0.3,0), 0));
				spawnItem.transform.name = safeName;

			}
			GUIScript.incomingScore += points;
			GUIScript.killCount+=1;
			Destroy(gameObject);
		}
	}

	if(other.tag == "Player" && enemyHealth > 0 && enemySeeing) {
		playerScript.playerHealth--;
		moving = false;
	}
}

function OnTriggerExit(other : Collider){
	if(other.tag == "Player") {
		moving = true;
	}
}




