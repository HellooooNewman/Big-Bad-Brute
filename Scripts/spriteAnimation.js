#pragma strict

var texture : Texture[];

var timer : float = 0.0;

var framePointer : int = 1;
var framesPerSecond : float = 1.0;

function Start () {

}

function Update () {
 	timer += Time.deltaTime * 30.0;


	if ((timer >= framesPerSecond) && framePointer < texture.length - 1) {
		framePointer++;
		renderer.material.mainTexture = texture[framePointer];
		timer = 0.0;
	}

	if (texture.length - 1  == framePointer){
		Destroy(gameObject, 0);
	}
}