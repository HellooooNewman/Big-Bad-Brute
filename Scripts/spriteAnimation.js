#pragma strict

var texture : Texture[];

var animationSpeed : float = 30.0;

private var timer : float = 0.0;

private var framePointer : int = 1;
private var framesPerSecond : float = 1.0;

var destroySprite : boolean;

function Start () {

}

function Update () {

 	timer += Time.deltaTime * animationSpeed;

	if ((timer >= framesPerSecond) && framePointer < texture.length - 1) {
		framePointer++;
		renderer.material.mainTexture = texture[framePointer];
		timer = 0.0;
		if (!destroySprite && framePointer == texture.length - 1){
			framePointer = 1;
			timer = 0.0;
		}
	}

	if (destroySprite){
		if (texture.length - 1  == framePointer){
			Destroy(gameObject, 0);
		}
	}
}