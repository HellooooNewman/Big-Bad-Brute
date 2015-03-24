#pragma strict

private var breakableScript : breakable;
var particle : ParticleSystem;
private var timer : float = 0;
function Start(){
	breakableScript = gameObject.GetComponent(breakable);
}

function Update () {
	if (timer <= 15){
		if(breakableScript.itemHP <= 0){
			particle.Play();
			timer += Time.deltaTime * 2;

		} else {
			particle.Pause();
		}
	} else {
			particle.Stop();
	}
}
