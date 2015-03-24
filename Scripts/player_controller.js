#pragma strict

//-------------Player Selected-------------//

	var characterSlot : GameObject[];
	var selectedCharacter : int;
	private var characterMesh : GameObject;
	private var character : GameObject;
	private var instantiatedCharacter : GameObject;
	public var playerNumber : int = 1;

//-------------Player Inputs-------------//

	private var jumpKey : String = "Jump";
	private var attackKey : String = "Fire";
	private var horizontalKey : String = "Horizontal";
	private var verticalKey : String = "Vertical";

//-------------Player Audio-------------//

	public var feetAudio : AudioClip;
	public var punchAudio : AudioClip;

	public var woosh_1 : AudioClip;
	public var woosh_2 : AudioClip;
	public var woosh_3 : AudioClip;
	public var woosh_4 : AudioClip;
	public var stomp1 : AudioClip;
	public var stomp2 : AudioClip;


	//-----------walking audio----------//

		private var walkingAudio : AudioClip;
		var walkingRegularAudio : AudioClip;
		var walkingMetalAudio : AudioClip;
		var walkingWoodAudio : AudioClip;

//-------------Stats-------------//

	public var feetCheck : GameObject;
	private var groundPoundCollider : GameObject;

	public var totalHealth : int = 10;
	public var playerHealth : int = 5;

	public var totalLives : int = 2;
	public var playerLives : int = 3;

	public var playerKills : int = 0; 

	public var damage : float = 1.0;
	public var doubleDamage : boolean = false;

//-------------Movement-------------//

	public var speed : float;
	public var doubleSpeed : boolean = false;
	private var doubleSpeedTimer : float = 10;
	public var slowerSpeed : boolean = false;
	private var slowerSpeedTimer : float = 10;
	private var moving : boolean = false;

	public var jumpHeight : float;
	public var doubleJumpHeight : float;
	private var jumping : boolean = false;

	public var gravity : float;
	private var jumpCount : boolean = true;
	public var movingRight : boolean = true;
	private var land : boolean = true;

	var dustDirection : boolean;
	var emissionSpeed : float = 0;

//-------------Misc-------------//

	var weapon : GameObject;

//-------------Attacking - Hurt-------------//

	var bloodTexture : GameObject[];
	var attack : boolean = false;
	var attackDelay : float = 2.0;
	var attackAnimationSwitch : boolean = true;
	private var groundPound : boolean = false;
	var gpAbility : boolean = false;
	var hitTimer : boolean = false;
	private var airDash : boolean = false;

//-------------Camera Position Variables-------------//

	public var CameraChangeLeft : boolean = false;

	var shader1: Shader;
	var shader2: Shader;

function Start(){

	var hitTimer : boolean = false;
	PlayerPrefs.SetInt("Player Score", 10);
	rigidbody.useGravity = false;
	groundPoundCollider = gameObject.Find("groundPound");
	save();

	shader1 = Shader.Find("Toon/Lighted Outline");
	shader2 = Shader.Find("Toon/Lighted");

//---------Set Control Unique to this player--------//

	jumpKey += playerNumber;
	attackKey += playerNumber;
	horizontalKey += playerNumber;
	verticalKey += playerNumber;

//---------Instantiate Character Selected In ----------//
	
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	if(GUIScript.twoPlayer){
		selectedCharacter = Random.Range(0,3);
	} else {
		selectedCharacter = PlayerPrefs.GetInt("whichCharacter");
	}

	character = characterSlot[selectedCharacter];
    instantiatedCharacter = Instantiate (character, transform.position, Quaternion.Euler(Vector3(0, 90, 0)));
    instantiatedCharacter.transform.parent = transform;
    instantiatedCharacter.transform.localPosition= Vector3(0, -1, 0);

    characterMesh = FindMesh();
}

function FixedUpdate () {

	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	transform.position.z = 0; //precatuion to keep player from moving in z
	rigidbody.AddForce(new Vector3(0, -gravity * rigidbody.mass,0)); //custom gravity formula
	
	if(GUIScript.gameStart && playerLives > 0){

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
			rigidbody.velocity.x = (speed * 2.5) * Input.GetAxis(horizontalKey);

		// Slow Speed
		} else if (slowerSpeed) {
			slowerSpeedTimer -= Time.deltaTime * 2;
			if (slowerSpeedTimer<=0){
				Debug.Log('double Speed off');
				slowerSpeed = false;
			}
			rigidbody.velocity.x = (speed / 1.5) * Input.GetAxis(horizontalKey);
		// Regular Speed
		} else if(Input.GetAxis(horizontalKey)) {
			if (isGrounded()){
				Dust();
                
			} else {
				feetCheck.particleSystem.emissionRate = 0;
			}
			// audio.loop = true;
			// audio.clip = feetAudio;
			// audio.Play();
			rigidbody.velocity.x = speed * Input.GetAxis(horizontalKey);
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

	if(GUIScript.gameStart && playerLives > 0){
		emissionSpeed = 25;

	//-------------Character Jump and Double Jump-------------//

		if(Input.GetButtonDown(jumpKey) && isGrounded()){
			rigidbody.velocity.y = jumpHeight;
			jumpCount = true;
			jumping = true;
			var jumpTexture : GameObject;
			jumpTexture = Instantiate(Resources.Load('Prefabs/Sprites/smoke_jump'), transform.position, transform.rotation);
			instantiatedCharacter.animation["Jump"].wrapMode = WrapMode.Once;
			instantiatedCharacter.animation.Play("Jump");
		} else if (Input.GetButtonDown(jumpKey) && !isGrounded() && jumpCount) {
			jumpTexture = Instantiate(Resources.Load('Prefabs/Sprites/smoke_jump'), transform.position, transform.rotation);
			rigidbody.velocity.y = doubleJumpHeight;
			instantiatedCharacter.animation.Play("DoubleJump");
			jumpCount = false;
			gpAbility = true;
		} else {
			jumping = false;
		}

	//-------------Character Rotation-------------//

		if((Input.GetAxis(horizontalKey) < 0) && movingRight && isGrounded){
			RotateCharacter();
		} else if ((Input.GetAxis(horizontalKey) > 0) && !movingRight && isGrounded){
			RotateCharacter();
		} else {
			//audio.Pause();
		}

	//---------------Air Dash-------------//

		if(!isGrounded() && Input.GetAxis(horizontalKey) != 0 && Input.GetButtonDown(attackKey) && !groundPound){
			Debug.Log("Air Dash");
			
			airDash = true;
		}

		var moveHorizontal : float = Input.GetAxis(horizontalKey);
	       
	    var movement : Vector3 = Vector3(moveHorizontal, 0, 0);

		if(airDash){
			Debug.Log(5 * transform.right * movement.x * 10000);
			rigidbody.AddForce (Vector3.right * movement.x * 100000);
			AirDash();
		}

	//---------------Ground Pound-------------//

		if(!isGrounded() && Input.GetAxis(verticalKey) <= -0.50 && gpAbility){
			Debug.Log("Ground Pound");
			groundPound = true;
			gpAbility = false;
		}

		// force the character down and add a sprite animation

		if (groundPound){
			damage = 3;
 			rigidbody.AddForce (Vector3.down * 4000);
			groundPoundCollider.collider.enabled = true;
			Instantiate(Resources.Load('Prefabs/Sprites/smoke_jump'), transform.position, transform.rotation);
		}

		// ground pound landing splash

		if(isGrounded() && groundPound){
			damage = 1;
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
				playerHealth -= 1;
			}
			
		}

	//---------------Animations-------------//
	
		if (Mathf.Abs(Input.GetAxis(horizontalKey)) > 0.1 && isGrounded()){
			instantiatedCharacter.animation.CrossFade('Run');
		} else {
			instantiatedCharacter.animation.CrossFade('Idle');
		}

		if(Input.GetButtonDown (attackKey)){
			
		}

		if(Input.GetButtonDown (attackKey) && !attack && !groundPound){
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
		} else {
			rigidbody.position.y = 0;
		}

		
		if (instantiatedCharacter.animation["Falling"].enabled == true && isGrounded()){
			//instantiatedCharacter.animation.CrossFade("Land");
			land = true;
		}

	//---------------Player Mesh-------------//

	var color1 : Color = Color(255.0/255.0,140.0/255.0,140.0/255.0,1.0);
	var color2 : Color = Color(255.0/255.0,255.0/255.0,255.0/255.0,1.0);
 

	if(hitTimer){
		characterMesh.transform.renderer.material.shader = shader1;
		characterMesh.transform.renderer.material.SetColor ("_OutlineColor", Color.black);
		//characterMesh.transform.renderer.material.SetColor ("_Color", color2);
		//characterMesh.transform.renderer.material.SetFloat ("_Outline", 0.001);
		var lerp : float = Mathf.PingPong(Time.time, 0.5) / 0.5;
		var newColor : Color = Color.Lerp(color1, color2, lerp);
		characterMesh.transform.renderer.material.SetColor ("_Color", newColor);
	} else {
		characterMesh.transform.renderer.material.shader = shader2;
		characterMesh.transform.renderer.material.SetColor ("_Color", color2);
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

	//--------no life left--------//

		if (playerHealth <= 0 && playerLives > 0){
			playerHealth = totalHealth;
			playerLives--;
			Debug.Log(playerLives);
		}



	} else {
		feetCheck.particleSystem.emissionRate = 0;
	}

//-------------Game Over-------------//

	var players = GameObject.FindGameObjectsWithTag("Player").length;



	if(playerLives <= 0 && GUIScript.twoPlayer && players > 1){
		instantiatedCharacter.animation.CrossFade("Death");
		Destroy(gameObject, 3);
		playerHealth = 0;
	} else if(playerLives <= 0){
		playerHealth = 0;
		instantiatedCharacter.animation.CrossFade("Death");
	}

	if(GUIScript.timer <= 0){
		instantiatedCharacter.animation.CrossFade("Death");
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

	if(other.tag == "enemy") {
		//speed = 3;
	} else {
		//speed = 15;
	}

	if(other.tag == "hurt"){
		playerHealth--;
	}


	if(other.tag == "wood"){
		walkingAudio = walkingWoodAudio;
	}

	if(other.tag == "metal"){
		walkingAudio = walkingMetalAudio;
	}

	if(other.tag == "Untagged"){
		walkingAudio = walkingRegularAudio;
	}
}

function OnTriggerExit(other : Collider){

	//resets cinematic camera

	if(other.tag == "cameraLeft") {
		CameraChangeLeft = false;
	}

	//speed = 15;

}

function Hit(enemyPosition : Vector3, Damage : int){

	

	if (enemyPosition.x > transform.position.x) {
		rigidbody.AddRelativeForce (-15000, 15000, 0);
    } else {
		rigidbody.AddRelativeForce (15000, 15000, 0);
    }

	//cameraShake.animation.Play();
	playerHealth -= Damage;
	var randomBloodPrefab = Random.Range(0, bloodTexture.length);
	var safeName : String = bloodTexture[randomBloodPrefab].name.ToString();
	Debug.Log(safeName);

	var blood : GameObject = Instantiate(Resources.Load('Prefabs/Sprites/'+ safeName), Vector3(transform.localPosition.x,transform.localPosition.y,transform.localPosition.z - 2), transform.rotation);


	hitTimer = true;

	yield WaitForSeconds (2);

	hitTimer = false;

}

function Attacking(){

	weapon.collider.enabled = true;
	attack = true;
    
	//---------Attack texture--------//

	// use this if the object is not parented

	var attackSide = 2;
	// var attackScale = 3;

	if (movingRight){
		// attackScale = 3;
		attackSide = 1;
	} else { 
		attackSide = -1;
		// attackScale = -3;
	}

	var attackTexture : GameObject;

	if (attackAnimationSwitch){
		attackTexture = Instantiate(Resources.Load('Prefabs/Sprites/slashUpper'), Vector3(transform.localPosition.x + attackSide,transform.localPosition.y,transform.localPosition.z - 1), transform.rotation);
	} else {
		attackTexture = Instantiate(Resources.Load('Prefabs/Sprites/horiSlash'), Vector3(transform.localPosition.x + attackSide,transform.localPosition.y,transform.localPosition.z - 1), transform.rotation);
	
	}
	attackTexture.transform.parent = transform;
	attackTexture.transform.localScale = new Vector3(3,3,3);
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


function save(){

	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	var saveTime = GUIScript.timer;
	PlayerPrefs.SetInt("Time", saveTime);
	PlayerPrefs.Save();

}

function FindMesh() : GameObject {
	// Find all game objects with tag Enemy
	var meshes = GameObject.FindGameObjectsWithTag("playerMesh");
	var playerMesh : GameObject;
	for (var mesh : GameObject in meshes)  {
		if (mesh.transform.root.name == collider.transform.root.name){
			playerMesh = mesh;
		}
	}

	return playerMesh;
}

function AirDash(){
	yield WaitForSeconds(0.1);
	airDash = false;
}