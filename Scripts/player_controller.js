#pragma strict

//-------------Player Selected-------------//

var characterSlot : GameObject[];
private var selectedCharacter : int;
var character : GameObject;
private var instantiatedCharacter : GameObject;

//-------------Player Audio-------------//

public var feetAudio : AudioClip;
public var punchAudio : AudioClip;

//-------------Player Variables-------------//

public var feetCheck : GameObject;
private var groundPoundCollider : GameObject;

public var totalHealth : int = 10;
public var playerHealth : int = 5;

public var totalLives : int = 2;
public var playerLives : int = 3;

public var gravity : float;
private var jumpCount : boolean = true;
public var movingRight : boolean = true;

public var damage : float = 1.0;
public var doubleDamage : boolean = false;

public var speed : float;
public var doubleSpeed : boolean = false;
private var doubleSpeedTimer : float = 10;
public var slowerSpeed : boolean = false;
private var slowerSpeedTimer : float = 10;

public var jumpHeight : float;
public var doubleJumpHeight : float;

var onLadder : boolean = false;
var weapon : GameObject;

var jumping : boolean = false;

var cameraShaker : GameObject;

var dustDirection : boolean;
var emissionSpeed : float = 0;

private var canWallJump : boolean;
private var CurrentWall : GameObject;

var bloodTexture : GameObject[];

private var moving : boolean = false;

var attack : boolean = false;
var attackDelay : float = 2.0;
var attackAnimationSwitch : boolean = true;

private var groundPound : boolean = false;

//-------------Camera Position Variables-------------//

public var CameraChangeLeft : boolean = false;

function Start(){
	selectedCharacter = PlayerPrefs.GetInt("whichCharacter");
	character = characterSlot[selectedCharacter];
	PlayerPrefs.SetInt("Player Score", 10);
	rigidbody.useGravity = false;
	weapon = gameObject.Find("weapon");
	cameraShaker = gameObject.Find("CameraShaker");
	groundPoundCollider = gameObject.Find("groundPound");
	save();

	//---------Instantiate Character Selected In ----------//
	
    instantiatedCharacter = Instantiate (character, transform.position, Quaternion.Euler(Vector3(0, 90, 0)));
    instantiatedCharacter.transform.parent = transform;
    instantiatedCharacter.transform.localPosition= Vector3(0, -1, 0);
}

//-------------Call to this function to save at any time-------------//
function save(){
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	var saveTime = GUIScript.timer;
	PlayerPrefs.SetInt("Time", saveTime);
	PlayerPrefs.Save();

}

function FixedUpdate () {

	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	transform.position.z = 0; //precatuion to keep player from moving in z
	rigidbody.AddForce(new Vector3(0, -gravity * rigidbody.mass,0)); //custom gravity formula
	
	if(GUIScript.gameStart){

		

		//-------------Double Speed, Slow Speed and Regular Speed-------------//
		// Double Speed
		if (doubleSpeed) {
			doubleSpeedTimer -= Time.deltaTime * 2;
			if (doubleSpeedTimer<=0){
				Debug.Log('double Speed off');
				doubleSpeed = false;
			}
			if (isGrounded()){
				Dust();
			}
			rigidbody.velocity.x = (speed * 2.5) * Input.GetAxis("Horizontal");
		// Slow Speed
		} else if (slowerSpeed) {
			slowerSpeedTimer -= Time.deltaTime * 2;
			if (slowerSpeedTimer<=0){
				Debug.Log('double Speed off');
				slowerSpeed = false;
			}
			rigidbody.velocity.x = (speed / 1.5) * Input.GetAxis("Horizontal");
		// Regular Speed
		} else if(Input.GetAxis("Horizontal")) {
			if (isGrounded()){
				Dust();
                
			} else {
				feetCheck.particleSystem.emissionRate = 0;
			}
			// audio.loop = true;
			// audio.clip = feetAudio;
			// audio.Play();
			rigidbody.velocity.x = speed * Input.GetAxis("Horizontal");
		} else {
			feetCheck.particleSystem.emissionRate = 0;
			//rigidbody.velocity.x = 0;
		}

		//---------------Attack-------------//
	} else {
		rigidbody.velocity.x = 0;
	}

	
}


function Update(){

	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	if(GUIScript.gameStart){
		emissionSpeed = 25;

	//-------------Character Jump and Double Jump-------------//

		if(Input.GetButtonDown("Jump") && isGrounded()){
			rigidbody.velocity.y = jumpHeight;
			jumpCount = true;
			jumping = true;
			var jumpTexture : GameObject;
			jumpTexture = Instantiate(Resources.Load('Prefabs/Sprites/smoke_jump'), transform.position, transform.rotation);
			instantiatedCharacter.animation["Jump"].wrapMode = WrapMode.Once;
			instantiatedCharacter.animation.Play("Jump");
		} else if (Input.GetButtonDown("Jump") && !isGrounded() && jumpCount) {
			jumpTexture = Instantiate(Resources.Load('Prefabs/Sprites/smoke_jump'), transform.position, transform.rotation);
			rigidbody.velocity.y = doubleJumpHeight;
			instantiatedCharacter.animation.Play("DoubleJump");
			jumpCount = false;
		} else {
			jumping = false;
		}

	//-------------Character Rotation-------------//

		if((Input.GetAxis("Horizontal") < 0) && movingRight && isGrounded){
			RotateCharacter();
		} else if ((Input.GetAxis("Horizontal") > 0) && !movingRight && isGrounded){
			RotateCharacter();
		} else {
			//audio.Pause();
		}

	//---------------Air Dash-------------//

		if(!isGrounded() && Input.GetAxis("Horizontal") != 0 && Input.GetButtonDown("Fire1")){
			Debug.Log("Air Dash");
		}

	//---------------Ground Pound-------------//

		if(!isGrounded() && Input.GetAxis("Vertical") <= -0.50){
			Debug.Log("Ground Pound");
			
			groundPound = true;
			
		}

		if (groundPound){
			rigidbody.AddForce (Vector3.down * 4000);
			groundPoundCollider.collider.enabled = true;
			Instantiate(Resources.Load('Prefabs/Sprites/smoke_jump'), transform.position, transform.rotation);
		}


		if(isGrounded() && groundPound){
			var groundPoundLand : GameObject = Instantiate(Resources.Load('Prefabs/Sprites/smoke_jump'), transform.position, transform.rotation);
			groundPoundLand.transform.localScale = Vector3(15,5,5);
			groundPoundCollider.collider.enabled = false;
			Debug.Log('splash');
			groundPound = false;
		}


	//---------------Fall Damage-------------//

	//base it off a timer for how long he has been falling for.

		if (rigidbody.velocity.y <= -35 ){
			if (isGrounded()){
				Debug.Log('owwwww');
				//playerHealth -= 2;
			}
			
		}

	//---------------Animations-------------//
	
		if (Mathf.Abs(Input.GetAxis("Horizontal")) > 0.1 && isGrounded()){
			instantiatedCharacter.animation.CrossFade('Run');
		} else {
			instantiatedCharacter.animation.CrossFade('Idle');
		}

		if(Input.GetButtonDown ("Fire1") && !attack){
			Attacking();
			audio.PlayOneShot(punchAudio);
			attackAnimationSwitch = !attackAnimationSwitch;
			if (attackAnimationSwitch){
				instantiatedCharacter.animation.Play('Attack1');
			} else {
				instantiatedCharacter.animation.Play('Attack2');
			}	
		}

		// Debug.Log(rigidbody.velocity.y + "  rigidbody");

		if (!isGrounded()){
			if (rigidbody.velocity.y > 0){
				instantiatedCharacter.animation.CrossFade("Falling");
			} else  if(rigidbody.velocity.y < 0){
				instantiatedCharacter.animation.CrossFade("Falling");
			}
		}

		if (instantiatedCharacter.animation["Falling"].enabled == true && isGrounded()){
			//instantiatedCharacter.animation.CrossFade("RunLand");
			Debug.Log("Land");
		}

	//---------------Attack Delay-------------//

		if(attack){
			attackDelay -= Time.deltaTime * 4;
			weapon.collider.enabled = true;
			if(attackDelay <= 0.0){

				//attack again
				weapon.collider.enabled = false;
				attackDelay = 1.0;
	    		attack = false;
			}
		} 

	//--------no life left--------/
		if (playerHealth<=0){
			playerHealth = totalHealth;
			playerLives--;
		}



	} else {
		feetCheck.particleSystem.emissionRate = 0;
	}


	if(playerLives<=0){
		instantiatedCharacter.animation.CrossFade("Death");
		Debug.Log("death");
	}
}


function RotateCharacter(){
	movingRight = !movingRight;
	transform.localScale = new Vector3(-transform.localScale.x,transform.localScale.y,transform.localScale.z);
	var dustTurn : GameObject;
	var dustScale : int;
	if (movingRight){
		dustScale = -2;
	} else { 
		dustScale = 2;
	}

	dustTurn = Instantiate(Resources.Load('Prefabs/Sprites/dustTurn'), Vector3(transform.localPosition.x + dustScale,transform.localPosition.y - 1.6 ,transform.localPosition.z), transform.rotation);
}

//-------------Dust Trail at his feet-------------//

function Dust(){
	feetCheck.particleSystem.emissionRate = emissionSpeed;
}

function OnTriggerEnter(other : Collider){

	if(other.tag == "cameraLeft") {
		CameraChangeLeft = true;
	}

	if(other.tag == "ladder") {
		onLadder = true;
		Debug.Log('enter');
	}

	//player gets hurt

	if(other.tag == "enemy") {
		speed = 3;
	}

	if(other.tag == "wall") {
		canWallJump = true;
		CurrentWall = other.gameObject;
	}
}

function OnTriggerExit(other : Collider){

	//resets cinematic camera

	if(other.tag == "cameraLeft") {
		CameraChangeLeft = false;
	}

	if(other.tag == "ladder") {
		onLadder = false;
		
	}

	if(other.tag == "enemy") {
		speed = 15;
	}
}

function Hit(enemyPosition : Vector3){
	var cameraShake = gameObject.Find("cameraShaker");

	if (enemyPosition.x > transform.position.x) {
		rigidbody.AddRelativeForce (-15000, 15000, 0);
    } else {
		rigidbody.AddRelativeForce (15000, 15000, 0);
    } 

	//cameraShake.animation.Play();
	playerHealth--;
	var randomBloodPrefab = Random.Range(0, bloodTexture.length);
	var safeName : String = bloodTexture[randomBloodPrefab].name.ToString();
	Debug.Log(safeName);

	var blood : GameObject = Instantiate(Resources.Load('Prefabs/Sprites/'+ safeName), Vector3(transform.localPosition.x,transform.localPosition.y,transform.localPosition.z - 2), transform.rotation);
}

function Attacking(){


	weapon.collider.enabled = true;
	attack = true;
    
	//---------Attack texture--------//

	var attackSide = 2;
	var attackScale = 3;
	if (movingRight){
		attackScale = 3;
		attackSide = 1;
	}else{ 
		attackSide = -1;
		attackScale = -3;
	}

	var attackTexture : GameObject;

	if (attackAnimationSwitch){
		attackTexture = Instantiate(Resources.Load('Prefabs/Sprites/slashUpper'), Vector3(transform.localPosition.x + attackSide,transform.localPosition.y,transform.localPosition.z - 1), transform.rotation);
	} else {
		attackTexture = Instantiate(Resources.Load('Prefabs/Sprites/horiSlash'), Vector3(transform.localPosition.x + attackSide,transform.localPosition.y,transform.localPosition.z - 1), transform.rotation);
	
	}

	attackTexture.transform.parent = transform;

	
	attackTexture.transform.localScale = new Vector3(attackScale,5,5);
}

//-------------Is Grounded Check-------------//

function isGrounded(){
	var front : Vector3 = transform.position;
	front.x += 0.4;
	var middle : Vector3 = transform.position;
	var back : Vector3 = transform.position;
	back.x -= 0.4;
	
	//debug ray cast
	var jumpLine : float = collider.bounds.size.y/2 + 0.1;
	Debug.DrawRay (middle, Vector3(0, -jumpLine, 0), Color.red);
	Debug.DrawRay (front, Vector3(0, -jumpLine, 0), Color.red);
	Debug.DrawRay (back, Vector3(0, -jumpLine, 0), Color.red);
	
	if(
		Physics.Raycast(front, Vector3.down, collider.bounds.size.y/2+0.1) ||
		Physics.Raycast(middle, Vector3.down, collider.bounds.size.y/2+0.1) ||
		Physics.Raycast(back, Vector3.down, collider.bounds.size.y/2+0.1)
	){
		return true;
	}
	return false;
}
