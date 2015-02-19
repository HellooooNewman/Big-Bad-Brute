#pragma strict

var newScale : Vector3 = Vector3 (2, 2, 2);
var speed : float = 4.0;

function Start () {

}

function Update () {
	transform.localScale = Vector3.Lerp (transform.localScale, newScale, speed * Time.deltaTime);
    Destroy(transform.parent.gameObject, 0.7);
}