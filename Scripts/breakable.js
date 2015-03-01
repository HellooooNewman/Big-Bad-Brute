#pragma strict

var Smoke : GameObject[];
var Pieces : GameObject[];
var itemHP: int = 5;
var pointAmount: int = 100;
var attacked : boolean = false;
private var parentObject : GameObject;

function Start(){
	//get the parent object then tell the parent object 
}

function OnTriggerEnter (other : Collider){
	var playerScript : player_controller = FindObjectOfType(player_controller);
	var GUIScript : scoreManager = FindObjectOfType(scoreManager);

	if(other.tag == "weapon") {
		itemHP--;
		
		//rigidbody.AddForce(0,20,0);
		
		attacked = true;
		Debug.Log(attacked + 'attacked');
		// audio.clip = impactSound;
		// audio.Play();

       	Instantiate (Smoke[0], Vector3(Random.Range(-1 + transform.position.x, transform.position.x + 1),Random.Range(-1 + transform.position.y, transform.position.y + 1), -0.6), transform.rotation);

		if (itemHP <= 0){



			//Spawn smoke & pieces

			for (var g = 15; g >= 0; g--) {
				var newSmoke = Instantiate (Smoke[Random.Range(0, Smoke.length)], Vector3(Random.Range(-2 + transform.position.x, transform.position.x + 2),Random.Range(-2 + transform.position.y, transform.position.y + 2), -0.6), Quaternion.Euler(Random.Range(0, 30), Random.Range(30, 0), Random.Range(30, 0)));
				var randomScale = Random.Range(3, 5);
				newSmoke.transform.localScale = Vector3(randomScale, randomScale, 0);
			};

			for (var i = 10; i >= 0; i--) {
				Instantiate (Pieces[Random.Range(0, Pieces.length)], Vector3(Random.Range(-0.1 + transform.position.x, transform.position.x + 1),transform.position.y, Random.Range(-2 + transform.position.z, transform.position.z + 2)), Quaternion.Euler(Random.Range(0, 360), Random.Range(360, 0), Random.Range(360, 0)));
			};

			//Spawn points

			GUIScript.incomingScore = pointAmount;
			var PointsClone : GameObject;
			PointsClone = Instantiate(Resources.Load('Prefabs/PopUps/10pts'), Vector3(transform.position.x, transform.position.y + 3, transform.position.z - 3), transform.rotation);
			//PointsClone.transform.SetParent(transform, false);

			//add the right amount of points
			var pointsTotal = gameObject.Find("PointsText").GetComponent(UI.Text);
		    pointsTotal.text = " " + pointAmount;


			//Destroy the object
			Destroy(transform.root.gameObject);
		}
	}
}