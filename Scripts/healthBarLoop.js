#pragma strict


var timer : float = 1.0;

function Update () {
	var image : UI.RawImage = new gameObject.GetComponent("RawImage");

	timer += 0.004;

	var pointa : Vector2;

    if (timer>=1.0){
    	image.uvRect.position = new Vector2(timer,0.0);
    	if (timer>=2.0){ 
    		//timer = 0.0;
    	}
    }
}


//image.uvRect.position = new Vector2(2,0);
