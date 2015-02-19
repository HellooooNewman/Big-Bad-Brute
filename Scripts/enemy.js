#pragma strict



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
var MoveSpeed = 4;
var MaxDist = 10;
var MinDist = 3;
var speed : float; // var to control enemy speed
var gravity = 10;
var moving : boolean  = true;

private var enemySeeing : boolean = false;

var waypoint : Transform[];
private var currentWaypoint : int;



var playerAbove : boolean;
var distToGround: float;

function Start(){
	Player = GameObject.FindWithTag("Player");
	distToGround = collider.bounds.extents.y;

}

var timer : float = 0.0;

function Update () {

	//Physics.IgnoreCollision(pickup.collider, collider);
	var playerDirection = transform.InverseTransformPoint(Player.transform.position);
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	var playerScript : player_controller = FindObjectOfType(player_controller);

	//Debug.Log("player" + Player.transform.position.x);
	//Debug.Log("enemy" + transform.position.x);


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

		if(Vector3.Distance(transform.position,Player.transform.position) < MinDist){
			enemySeeing = true;
			//if the player is moving look in the direction of the player, and move towards him

			if (moving && IsGrounded){
				

				/*-----------Player is above Enemy------------*/

				if(Player.transform.position.y + 0.3 <= transform.position.y){
					//Debug.Log("below");
					playerAbove = false;
					if (Player.transform.position.x < transform.position.x){
						goRight();
					} else if (Player.transform.position.x > transform.position.x){
						goLeft();
					}

				/*-----------Player is below Enemy------------*/

				} else if ((transform.position.y + 4) < Player.transform.position.y) {
					//Debug.Log("above");
					playerAbove = true;
					if (!mallCop){
						if(AboveCheck()){
							//Debug.Log("there's nothing above me");
							if (Player.transform.position.y <= transform.position.y - 5){
								goLeft();
							} else if (Player.transform.position.y <= transform.position.y + 5){
								goRight();
							}
						} else {
							//Debug.Log("there's a thing above me");
							if (playerDirection.x < 0.0){
								goLeft();
							} else if (playerDirection.x > 0.0){
								goRight();
							}
						}
					} else {
						//Debug.Log("Stay there chubby");
					}

				/*-----------Player is on the same plane------------*/

				} else {
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
			} else {
				timer += Time.deltaTime * 2;
				if (timer>=2.0){
					Debug.Log("enemy hit 1");
					timer = 0;
					playerScript.Hit();
				}
			}
		}

		/*-----------Enemy Stop Seeing the Character------------*/
		// Debug.Log(Player.transform.position.y);
		// Debug.Log(transform.position.y);

		if(Vector3.Distance(transform.position,Player.transform.position) >= MaxDist) {
			//rigidbody.velocity.x = 0;
		}



		/*-----------Enemy Waypoint------------*/

		if(!mallCop && waypoint !== null){
			if(currentWaypoint < waypoint.length && !enemySeeing && waypoint.Length > 0){

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
	EnemyBody.transform.localScale = new Vector3(-transform.localScale.x,transform.localScale.y,transform.localScale.z);
}

function goLeft(){
	transform.Translate(-Vector3.right * MoveSpeed * Time.deltaTime);
	EnemyBody.transform.localScale = new Vector3(transform.localScale.x,transform.localScale.y,transform.localScale.z);
}

var enemyInsideJumpZone : boolean;

function OnTriggerEnter (other : Collider){
	var playerScript : player_controller = FindObjectOfType(player_controller);
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	/*-----------Enemy gets hurt------------*/


	if(other.tag == "weapon" && enemyHealth > 0) {

		//Debug.Log(enemyHealth);
		Debug.Log("hit");
		//audio.clip = healthSound;
        //audio.Play();
        Debug.Log(playerScript.damage);

        enemyHealth -= playerScript.damage/2;

        if (playerScript.movingRight) {
    	rigidbody.AddRelativeForce (5000, 5000, 0);
	    } else {
			rigidbody.AddRelativeForce (-5000, 5000, 0);
	    } 
	    /*-----------Enemy hit------------*/

	    for (var i : int = 0; i<4; i++){
	        var PointsClone : GameObject;
			PointsClone = Instantiate(Resources.Load('Prefabs/PopUps/10pts'), Vector3(transform.position.x + Random.Range(0,5), transform.position.y + 1  + Random.Range(0,4), transform.position.z), transform.rotation);

			var pointsTotal = gameObject.Find("PointsText").GetComponent(UI.Text);
			var pointsHit = Random.Range(1,2);
			pointsTotal.text = " " + pointsHit;
			pointsTotal.fontSize = 34;
			pointsTotal.name = points + i + " ";

			GUIScript.incomingScore += pointsHit;
	    }

		/*-----------Enemy dead------------*/

		var randomSpawnLength =  Random.Range(0, randomSpawn.Length-1);
		var spawnItem : GameObject;

		if (enemyHealth <= 0){
			for(var g = 0; g<randomSpawn.Length; g++){
				yield WaitForSeconds (0.03);
				var prefabRandom = Random.Range(0,randomSpawnLength);
				var safeName : String = randomSpawn[prefabRandom].name.ToString();
				spawnItem = Instantiate(Resources.Load('Prefabs/PickUps/'+safeName), Vector3(Random.Range(-0.1 + transform.position.x, transform.position.x + 1),transform.position.y + 5, 0), transform.rotation);
				var box : BoxCollider;
				box = spawnItem.AddComponent(BoxCollider);
				spawnItem.rigidbody.useGravity = true;
				spawnItem.rigidbody.AddForce(0,30,0);
				spawnItem.rigidbody.velocity = transform.TransformDirection(Vector3(0,Random.Range(transform.position.y + 0.3,0), 0));
				spawnItem.transform.name = safeName;
			}

			//check if double or triple points is on

			if (GUIScript.triplePtsOn==true){
				points = points * 3;
			} else if (GUIScript.doublePtsOn==true){
				points = points * 2;
			}

			// create the text object

		    PointsClone = Instantiate(Resources.Load('Prefabs/PopUps/10pts'), Vector3(transform.position.x, transform.position.y + 3, transform.position.z - 3), transform.rotation);
			
			//add the right amount of points

			pointsTotal = gameObject.Find("PointsText").GetComponent(UI.Text);
		    pointsTotal.text = " " + points;

		    //add points to total score and killcout then destroy the game object

			GUIScript.incomingScore += points;
			GUIScript.killCount+=1;
			Destroy(transform.root.gameObject);
		}
        
	}
	
	if(other.tag == "Player") {
		moving = false;
		Debug.Log("enemy stop");
	}

	if(other.tag == "enemyJump" && playerAbove && !mallCop && !enemyInsideJumpZone){
		rigidbody.AddForce (0, 2500, 0);
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




