#pragma strict

//-------------Player Audio-------------//

public var feetAudio : AudioClip;
public var punchAudio : AudioClip;

//-------------Player Variables-------------//

public var feetCheck : GameObject;

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
var characterSlot : GameObject;

var dustDirection : boolean;
var emissionSpeed : float = 0;

private var canWallJump : boolean;
private var CurrentWall : GameObject;

var bloodTexture : GameObject[];

private var moving : boolean = false;

var characterHit : boolean = false;

var attack : boolean = true;
var attackDelay : float = 2.0;

//-------------Camera Position Variables-------------//

public var CameraChangeLeft : boolean = false;

function Start(){
	
	PlayerPrefs.SetInt("Player Score", 10);
	rigidbody.useGravity = false;
	weapon = gameObject.Find("weapon");
	save();
	//characterSlot.animation.wrapMode = WrapMode.Loop;
	//characterSlot.animation["Jump"].layer = 1;
	//characterSlot.animation["Jump"].wrapMode = WrapMode.Once;
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
			rigidbody.velocity.x = (speed * 2.5) * Input.GetAxis("Horizontal2");
		// Slow Speed
		} else if (slowerSpeed) {
			slowerSpeedTimer -= Time.deltaTime * 2;
			if (slowerSpeedTimer<=0){
				Debug.Log('double Speed off');
				slowerSpeed = false;
			}
			rigidbody.velocity.x = (speed / 1.5) * Input.GetAxis("Horizontal2");
		// Regular Speed
		} else if(Input.GetAxis("Horizontal2")) {
			if (isGrounded()){
				Dust();
                
			} else {
				feetCheck.particleSystem.emissionRate = 0;
			}
			audio.loop = true;
			audio.clip = feetAudio;
			audio.Play();
			rigidbody.velocity.x = speed * Input.GetAxis("Horizontal2");
		} else {
			feetCheck.particleSystem.emissionRate = 0;
			rigidbody.velocity.x = 0;
		}
	}
}


function Update(){
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	if(GUIScript.gameStart){
		emissionSpeed = 25;

		//-------------Character Jump and Double Jump-------------//

		if(Input.GetButtonDown("Jump2") && isGrounded()){
			Debug.Log("player 2 jump");
			//characterSlot.animation.CrossFade("Jump");
			rigidbody.velocity.y = jumpHeight;
			jumpCount = true;
			jumping = true;
			var jumpTexture : GameObject;
			jumpTexture = Instantiate(Resources.Load('Prefabs/Sprites/smoke_jump'), transform.position, transform.rotation);
			//characterSlot.animation.CrossFade("Jump");
		} else if (Input.GetButtonDown("Jump2") && !isGrounded() && jumpCount && !canWallJump) {
			rigidbody.velocity.y = doubleJumpHeight;
			jumpCount = false;
			Debug.Log("double Jump");
		} else {
			jumping = false;
			//characterSlot.animation.CrossFade("Run");
		}

		//-------------Wall Jump------------//

		// if(Input.GetKeyDown("space") && !isGrounded() && canWallJump){

  //           var Direction = Input.GetAxis("Horizontal2") * 5000;


		// 	jumpCount = false;
  //           RotateCharacter();
  //           if ( movingRight) {
  //       	rigidbody.AddRelativeForce (5000, 5000, 0);
	 //        } else {
		// 		rigidbody.AddRelativeForce (-5000, 5000, 0);
	 //        } 

		// }

		if((Input.GetAxis("Horizontal2") < 0) && movingRight && isGrounded){
			//-------------Character Rotation-------------//

			//Scales the character on the x axis
			RotateCharacter();
		} else if ((Input.GetAxis("Horizontal2") > 0) && !movingRight && isGrounded){
			RotateCharacter();
		} else {
			audio.Pause();
		}

		//---------------Animations-------------//



		if(!isGrounded()){
			
		}

		//---------------Attack-------------//
	
		if(Input.GetButtonDown ("Fire2") && !attack){
			Attacking();
		}


		if(attack){
			attackDelay -= Time.deltaTime * 4;
			weapon.collider.enabled = true;
			if(attackDelay <= 0.0){
				weapon.collider.enabled = false;
				Debug.Log("attack again");
				attackDelay = 0.3;
	    		attack = false;
			}
		}



		if(!isGrounded && Input.GetAxis("Horizontal2") != 0 && Input.GetButtonDown ("Fire2")){
			Debug.Log("Air Dash");
		}

		//---------------Fall Damage-------------//

		if (rigidbody.velocity.y == -25){
			Debug.Log('owwwww');
		}

		//--------no life left--------/
		if (playerHealth<=0){
			playerHealth = totalHealth;
			playerLives--;
		}

	} else {
		feetCheck.particleSystem.emissionRate = 0;
	}
}


function RotateCharacter(){
	movingRight = !movingRight;
	transform.localScale = new Vector3(-transform.localScale.x,transform.localScale.y,transform.localScale.z);
	var dustTurn : GameObject;
	var dustScale : int;
	if (movingRight){
		dustScale = 2;
	}else{ 
		dustScale = -2;
	}
	dustTurn = Instantiate(Resources.Load('Prefabs/Sprites/dustTurn'), Vector3(transform.localPosition.x + dustScale,transform.localPosition.y - 1.6,transform.localPosition.z - 2), transform.rotation);
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
		characterHit = true;
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
		characterHit = false;
	}

	if(other.tag == "wall") {
		canWallJump = false;
		CurrentWall = null;
	}
}

function Hit(){
	playerHealth--;
	var randomBloodPrefab = Random.Range(0, bloodTexture.length);
	var safeName : String = bloodTexture[randomBloodPrefab].name.ToString();
	Debug.Log(safeName);

	var blood : GameObject = Instantiate(Resources.Load('Prefabs/Sprites/'+ safeName), Vector3(transform.localPosition.x,transform.localPosition.y,transform.localPosition.z - 2), transform.rotation);
}

function Attacking(){
	Debug.Log("attack hit");
	audio.clip = punchAudio;
    audio.Play();

	weapon.collider.enabled = true;
	attack = true;
	//characterSlot.animation.Play("Attack");
	//characterSlot.animation["Attack"].speed= 3;
    
	//---------Attack texture--------//

	var attackSide = 2;
	var attackScale = 5;
	if (movingRight){
		attackScale = 5;
		attackSide = 3;
	}else{ 
		attackSide = -3;
		attackScale = -5;
	}

	var attackTexture : GameObject;
	attackTexture = Instantiate(Resources.Load('Prefabs/Sprites/cut_b'), Vector3(transform.localPosition.x + attackSide,transform.localPosition.y,transform.localPosition.z - 1), transform.rotation);
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
