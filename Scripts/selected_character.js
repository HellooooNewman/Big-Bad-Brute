#pragma strict

var Characters : GameObject[];

function Start () {
	var selectedCharacter = PlayerPrefs.GetInt("whichCharacter");

	if(selectedCharacter == 1){
    	Instantiate (Characters[0], transform.position, transform.rotation);
	}

    if(selectedCharacter == 2){
    	Instantiate (Characters[1], transform.position, transform.rotation);
	}

    if(selectedCharacter == 3){
    	Instantiate (Characters[2], transform.position, transform.rotation);
	}

    if(selectedCharacter == 4){
    	Instantiate (Characters[3], transform.position, transform.rotation);
	}
}