#pragma strict

var turnOnKinematic : boolean;
var Smoke : GameObject[];
var Pieces : GameObject[];
var Pickups : GameObject[];
var breakSound : GameObject;
var itemHP: int = 5;
var pointAmount: int = 100;
var piecesDestroyed : int = 4;
var attacked : boolean = false;
public var crate_hit1 : AudioClip;
public var crate_hit2 : AudioClip;

function OnTriggerEnter (other : Collider){
	var playerScript : player_controller = FindObjectOfType(player_controller);
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);
	var playSound = 0;

	if(other.tag == "weapon") {

		var playerWeapon = other.transform.parent.GetComponent(player_controller);
		var playerNumber = playerWeapon.playerNumber;
		itemHP--;
		
		//rigidbody.AddForce(0,20,0);
		
		attacked = true;
		
		playSound = Random.Range(1, 2);

    	if(playSound == 1){
			audio.clip = crate_hit1;
			audio.Play();
 		}

		if(playSound == 2){
    		audio.clip = crate_hit2;
			audio.Play();
 		}
 		if(!turnOnKinematic){
 			if (playerWeapon.movingRight) {
	    		rigidbody.AddRelativeForce (20000, 20000, 0);
		    } else {
				rigidbody.AddRelativeForce (-20000, 20000, 0);
		    }
 		}

 		

       	Instantiate (Smoke[0], Vector3(Random.Range(-1 + transform.position.x, transform.position.x + 1),Random.Range(-1 + transform.position.y, transform.position.y + 1), -0.6), Quaternion.Euler(0,0,0));

		if (itemHP <= 0){

			Instantiate (breakSound, Vector3(Random.Range(-1 + transform.position.x, transform.position.x + 1),Random.Range(-1 + transform.position.y, transform.position.y + 1), -0.6), Quaternion.Euler(0,0,0));

			//Spawn smoke & pieces

			

			for (var g = 3; g >= 0; g--) {
				var newSmoke = Instantiate (Smoke[Random.Range(0, Smoke.length)], Vector3(Random.Range(-2 + transform.position.x, transform.position.x + 2),Random.Range(-2 + transform.position.y, transform.position.y + 2), Random.Range(-3, 0)), Quaternion.Euler(Random.Range(0, 30), Random.Range(30, 0), Random.Range(30, 0)));
				var randomScale = Random.Range(5, 7);
				newSmoke.transform.localScale = Vector3(randomScale, randomScale, 0);
			};

			var randomPickups = Random.Range(1, Pickups.length);

			for (var f = 0; f <= randomPickups; f++) {
				var newPickups = Instantiate (Pickups[Random.Range(0, Pickups.length)], Vector3(Random.Range(-2 + transform.position.x, transform.position.x + 2),Random.Range(-2 + transform.position.y, transform.position.y + 2), -0.6), Quaternion.Euler(Random.Range(0, 30), Random.Range(30, 0), Random.Range(30, 0)));
			};

			

			//Spawn points
			

			GUIScript.Score(playerNumber, pointAmount);
			var PointsClone : GameObject;
			PointsClone = Instantiate(Resources.Load('Prefabs/PopUps/10pts'), Vector3(transform.position.x, transform.position.y + 3, transform.position.z - 3), Quaternion.Euler(0,0,0));
			//PointsClone.transform.SetParent(transform, false);

			//add the right amount of points
			var pointsTotal = gameObject.Find("PointsText").GetComponent(UI.Text);
		    pointsTotal.text = " " + pointAmount;

		    if (!turnOnKinematic){
		    	if (playerWeapon.movingRight) {
	    		rigidbody.AddRelativeForce (20000, 20000, 0);
			    } else {
					rigidbody.AddRelativeForce (-20000, 20000, 0);
			    }
		    	for (var i = 0; i <= piecesDestroyed; i++) {
					Instantiate (Pieces[Random.Range(0, Pieces.length)], Vector3(Random.Range(-0.1 + transform.position.x, transform.position.x + 1),transform.position.y, Random.Range(-2 + transform.position.z, transform.position.z + 2)), Quaternion.Euler(Random.Range(0, 360), Random.Range(360, 0), Random.Range(360, 0)));
				};

		    	Destroy(transform.root.gameObject);
		    } else {
		    	var rigidbodies : Component[];
				rigidbodies = GetComponentsInChildren (Rigidbody);


				for (var body : Rigidbody in rigidbodies) {
					
					body.isKinematic = false;
					body.useGravity = true;
					gameObject.collider.enabled = false;
					if (playerWeapon.movingRight) {
		    			body.rigidbody.AddRelativeForce (30000, 30000, 0);
				    } else {
						body.rigidbody.AddRelativeForce (-30000, 30000, 0);
				    }
				}
		    }
			//Destroy the object
			
		}
	}
}