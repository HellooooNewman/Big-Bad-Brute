﻿#pragma strict

var extraLife : boolean = false;
var extraHealth : boolean = false;
var extraDamage : boolean = false;
var extraTime : boolean = false;
var lessTime : boolean = false;

var superSpeed : boolean = false;

var slowSpeed : boolean = false;

var doublePoints : boolean = false;
var triplePoints : boolean = false;

var spawnRandomCrates : boolean = false;

var shrinkPlayer  : boolean = false;
var growPlayer  : boolean = false;

function Update(){
	Destroy(gameObject, 15);
}

function OnTriggerEnter (other : Collider) {

	


	if(other.tag == "Player") {
		var playerScript = other.gameObject.GetComponent(player_controller);
		var GUIScript : scoreManager = FindObjectOfType(scoreManager);

		//extra Life
	    if ((playerScript.playerLives < playerScript.totalLives) && extraLife){
			playerScript.playerLives++;
		}

		//extra Health
	    if ((playerScript.playerHealth < playerScript.totalHealth) && extraHealth){
			playerScript.playerHealth++;
		}

		//extra Time
	    if (extraTime){
			GUIScript.timer += 25;
			var spawnItem : GameObject = Instantiate(Resources.Load('Prefabs/PopUps/time'), Vector3(142,-19,0), Quaternion.Euler(Vector3.zero));
			var guiPosition = gameObject.Find("Time");
			spawnItem.transform.SetParent(guiPosition.transform, false);
			spawnItem.rigidbody.AddRelativeForce(transform.up * 10);
			spawnItem.rigidbody.AddForce(0,1,0);
		}

		//less Time
	    if (lessTime){
			GUIScript.timer -= 25;
		}

		//superSpeed
	    if (superSpeed){
			playerScript.doubleSpeed = true;
			Debug.Log("double speed on");
		}

		if (slowSpeed){
			playerScript.slowerSpeed = true;
			Debug.Log("double speed on");
		} 

		//Double Points
	    if (doublePoints){
			GUIScript.doublePtsOn = true; 
			Debug.Log("double points");
		}

		//Triple Points
	    if (triplePoints){
			GUIScript.triplePtsOn = true; 
			Debug.Log("triple points");
		}

		if(spawnRandomCrates){
			var wantedStarClone : GameObject = Instantiate(Resources.Load('Prefabs/PickUps/10Pts'), Vector3(5,5,0), transform.rotation);
			wantedStarClone.rigidbody.AddRelativeForce(transform.up * 10);
		}

		//Lower Wanted Level
	    if (shrinkPlayer){
			Debug.Log("Player Shrank");
		}

		//Lower Wanted Level
	    if (growPlayer){
			Debug.Log("Player grew");
		}


		Destroy(gameObject);
	}
}

