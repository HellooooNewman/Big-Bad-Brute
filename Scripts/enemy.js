#pragma strict

var bodyhit1 : AudioClip;
var bodyhit2 : AudioClip;
var bodyhit3 : AudioClip;
var bodyhit4 : AudioClip;
var deathfall1 : AudioClip;

var mallCop : boolean = false;
var police : boolean = false;
var army : boolean = false;
var robotCop : boolean = false;

var points : int;

var randomSpawn : GameObject[];
var Player : GameObject;
var EnemyBody : Transform;
var EnemyHealthBar : RectTransform;
var enemyHealthContainer : Canvas;
var enemyHealth = 2.0;
var enemyHealthTotal = 3.0;
var enemyDamage = 3.0;
var MoveSpeed = 4;
var MaxDist = 10;
var MinDist = 3;
var waitTimer : float = 3;
var speed : float; // var to control enemy speed
var gravity = 10;
var moving : boolean = true;
var attack : boolean = false;

/*-----------Robot Specific------------*/

private var enemyHit : boolean = false;
var enemyHitCounter : int = 0;
var enemyHitCounterTotal : int = 1;

/*-----------Robot Specific------------*/

private var stunned : boolean = false;

/*-----------General------------*/

private var enemySeeing : boolean = false;
private var enemyHitTimer : float = 0.0;

/*-----------waypoint------------*/

var waypoint : Transform[];
private var currentWaypoint : int;

var enemyInsideJumpZone : boolean;

/*-----------Distance checks------------*/

var playerAbove : boolean;
var distToGround: float;

function Start(){
	distToGround = collider.bounds.extents.y;
}

var timer : float = 0.0;

function Update () {


	Player = FindClosestPlayer();



	//Physics.IgnoreCollision(pickup.collider, collider);
	var playerDirection = transform.InverseTransformPoint(Player.transform.position);
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);


	rigidbody.AddForce(new Vector3(0, -gravity * rigidbody.mass,0)); //custom gravity formula

	/*-----------Enemy Health------------*/

	if (enemyHealth == enemyHealthTotal || enemyHealth <= 0){
		enemyHealthContainer.enabled = false;
	} else {
		enemyHealthContainer.enabled = true;
		var healthRemaining = (enemyHealth - enemyHealthTotal);
		var healthPercent = (healthRemaining/enemyHealthTotal);
		var healthPosition = (healthPercent * 700.0);
		EnemyHealthBar.localPosition = new Vector3(healthPosition, 0, 0);
	}


	if(GUIScript.gameStart && enemyHealth > 0 && !enemyHit){

		/*-----------Enemy Sees the chacter------------*/

		if(Vector3.Distance(transform.position,Player.transform.position) < MinDist){
			
			enemySeeing = true;
			//if the player is moving look in the direction of the player, and move towards him

			if (moving && IsGrounded){
				

				/*-----------Player is above Enemy------------*/

				if(Player.transform.position.y + 0.3 <= transform.position.y){
					EnemyBody.animation.CrossFade("Run");
					//Debug.Log("below");
					//playerAbove = false;
					if (Mathf.Round(Player.transform.position.x) != Mathf.Round(transform.position.x)){
						if (Player.transform.position.x < transform.position.x){
							goLeft();
						} else if (Player.transform.position.x > transform.position.x){
							goRight();
						}
					} else {
						goLeft();
						//Debug.Log("right on top of him");
					}

				/*-----------Player is below Enemy------------*/

				} else if ((transform.position.y + 4) < Player.transform.position.y) {
					EnemyBody.animation.CrossFade("Run");
					//Debug.Log("above");
					//playerAbove = true;
					if (!mallCop){
						//Debug.Log("there's nothing above me");
						if (Mathf.Round(Player.transform.position.x) != Mathf.Round(transform.position.x)){
							if (Player.transform.position.x < transform.position.x){
								goLeft();
							} else if (Player.transform.position.x > transform.position.x){
								goRight();
							}
						} else {
							EnemyBody.animation.CrossFade("Idle");
						}
					} else {
						//Debug.Log("Stay there chubby");
					}

				/*-----------Player is on the same plane------------*/

				} else {
					EnemyBody.animation.CrossFade("Run");
					playerAbove = false;
					//Debug.Log("same plane");
					if (Player.transform.position.x < transform.position.x){
						//Debug.Log("i'm going left");
						goLeft();
					} else if (Player.transform.position.x > transform.position.x){
						//Debug.Log("i'm going right");
						goRight();
					}
				}

			// if he's not moving, wait 3 seconds then turn off the enemy collider off
			}
		}

		timer += Time.deltaTime * 2;
		if (timer>=0.4 && attack){
			EnemyBody.animation.CrossFade("Attack1");
			timer = 0;
		}

		/*-----------Enemy Stop Seeing the Character------------*/
		// Debug.Log(Player.transform.position.y);
		// Debug.Log(transform.position.y);

		if(Vector3.Distance(transform.position,Player.transform.position) >= MaxDist) {
			//rigidbody.velocity.x = 0;
			EnemyBody.animation.CrossFade("Idle");
		}



		/*-----------Enemy Waypoint------------*/

		if(!mallCop && waypoint !== null){
			if(currentWaypoint < waypoint.length && !enemySeeing && waypoint.Length > 0){
				EnemyBody.animation.CrossFade("Run");

				var target : Vector3 = waypoint[currentWaypoint].position;
				var moveDirection : Vector3 = target - transform.position;
				var velocity = moveDirection.normalized * speed;

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
		EnemyBody.animation.CrossFade("Idle");
	}

	if (enemyHealth <= 0){
		EnemyBody.animation.CrossFade("Death");
	}

}

function IsGrounded() : boolean {
   return Physics.Raycast(transform.position, -Vector3.up, distToGround + 0.1);
}

function AboveCheck() : boolean {
	Debug.DrawRay (transform.position, Vector3(0, 4, 0), Color.red);
	return Physics.Raycast(transform.position, Vector3(0, 4, 0), 4);
}

function goRight(){
	transform.Translate(Vector3.right * MoveSpeed * Time.deltaTime);
	EnemyBody.transform.localScale = new Vector3(transform.localScale.x,transform.localScale.y,transform.localScale.z);
}

function goLeft(){
	transform.Translate(-Vector3.right * MoveSpeed * Time.deltaTime);
	EnemyBody.transform.localScale = new Vector3(-transform.localScale.x,transform.localScale.y,transform.localScale.z);
}



function OnTriggerEnter (other : Collider){
	
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);

	if(other.tag == "weapon" && enemyHealth > 0 && GUIScript.gameStart) {

		enemyHit = true;
		enemyHitCounter++;
		if(enemyHitCounter == enemyHitCounterTotal){
			Debug.Log("hit");
			EnemyHit();
		}
		

		var playerWeapon = other.transform.parent.GetComponent(player_controller);
		var playerNumber = playerWeapon.playerNumber;
		var playDamage = Random.Range(1, 4);

    	if(playDamage == 1){
			audio.clip = bodyhit1;
			audio.Play();
 		}

		if(playDamage == 2){
    		audio.clip = bodyhit2;
			audio.Play();
 		}

 		if(playDamage == 3){
    		audio.clip = bodyhit3;
			audio.Play();
 		}

 		if(playDamage == 4){
    		audio.clip = bodyhit4;
			audio.Play();
 		}

		//audio.clip = healthSound;
        //audio.Play();
        var pointsDisplayed : int = 0;
        enemyHealth -= playerWeapon.damage/2;

	/*-----------Hit the Player in a direction------------*/

        if (playerWeapon.movingRight) {
    		rigidbody.AddRelativeForce (20000, 20000, 0);
	    } else {
			rigidbody.AddRelativeForce (-20000, 20000, 0);
	    }

	//check if double or triple points is on

		var pointsTotal : UI.Text;

		var mulitplier : int;
	    if (GUIScript.triplePtsOn==true){
			mulitplier = 3;
		} else if (GUIScript.doublePtsOn==true){
			mulitplier = 2;
		} else {
			mulitplier = 1;
		}


	
	/*-----------Enemy hit------------*/

	    for (var i : int = 0; i<2; i++){
	        var PointsClone : GameObject;
			PointsClone = Instantiate(Resources.Load('Prefabs/PopUps/10pts'), Vector3(transform.position.x + Random.Range(0,5), transform.position.y + 1  + Random.Range(0,4), transform.position.z), transform.rotation);
			pointsTotal = gameObject.Find("PointsText").GetComponent(UI.Text);
			var pointsHit = Random.Range(1,4);
			GUIScript.Score(playerNumber, pointsHit);
			pointsHit *= mulitplier;
			pointsTotal.text = pointsHit + " pts";
			pointsTotal.fontSize = 25;
			pointsTotal.name = pointsHit + '';
			
	    }

	/*-----------Enemy dead------------*/

		var randomSpawnLength =  Random.Range(0, randomSpawn.Length-1);
		var spawnItem : GameObject;

		if (enemyHealth <= 0){
			gameObject.layer = 11;
			for(var g = 0; g<randomSpawn.Length; g++){
				var prefabRandom = Random.Range(0,randomSpawnLength);
				var Prefab : String = randomSpawn[prefabRandom].name.ToString();
				spawnItem = Instantiate(Resources.Load('Prefabs/PickUps/'+Prefab), Vector3(Random.Range(-0.1 + transform.position.x, transform.position.x + 1),transform.position.y + 5, 0), transform.rotation);
				spawnItem.rigidbody.useGravity = true;
				spawnItem.rigidbody.AddForce(0,30,0);
				spawnItem.rigidbody.velocity = transform.TransformDirection(Vector3(0,Random.Range(transform.position.y + 0.3,0), 0));
				spawnItem.transform.name = Prefab;
			}

		// create the text object

		    PointsClone = Instantiate(Resources.Load('Prefabs/PopUps/10pts'), Vector3(transform.position.x, transform.position.y + 3, transform.position.z - 3), transform.rotation);
			
		//add the right amount of points to the thing that shows

			pointsTotal = gameObject.Find("PointsText").GetComponent(UI.Text);
		    pointsTotal.text = points * mulitplier + "pts";

		//add points to total score and killcout then destroy the game object

			GUIScript.Score(playerNumber, points / mulitplier);
			playerWeapon.playerKills += 1;
			EnemyBody.animation.CrossFade("Death");
			Destroy(transform.root.gameObject, 5);
		}
        
	}


	
	
	if(other.tag == "Player" && enemyHealth > 0 && GUIScript.gameStart) {
		var playerScript = other.gameObject.GetComponent(player_controller);
		attack = true;
		moving = false;
		Debug.Log("enemy stop");
		Debug.Log(playerScript.hitTimer);
		if (!playerScript.hitTimer) {
			playerScript.Hit(transform.position, enemyDamage);
			var camera_shaker = GameObject.FindGameObjectWithTag ("MainCamera");
		    var shakeScript = camera_shaker.GetComponent(camera_shake);
		    shakeScript.Shake();
		}
	}

	if(other.tag == "enemyJump" && playerAbove && !mallCop && !enemyInsideJumpZone){
		rigidbody.AddForce (0, 10000, 0);
		Debug.Log("jump");
		enemyInsideJumpZone = false;
	}

 

	if(other.tag == "enemyJump" && playerAbove  && enemyInsideJumpZone){
		Debug.Log("underneath the player and at the edge of the collider");
	}
}

function OnTriggerExit(other : Collider){
	if(other.tag == "Player") {
		moving = true;
	}
}

function FindClosestPlayer () : GameObject {

// Find all game objects with tag Enemy

	var players : GameObject[];
	players = GameObject.FindGameObjectsWithTag("Player");

//Debug.Log(spawns = GameObject.FindGameObjectsWithTag("spawn").length);

	

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

function EnemyHit(){

	yield WaitForSeconds(waitTimer);
	enemyHit = false;
	enemyHitCounter = 0;
}	



