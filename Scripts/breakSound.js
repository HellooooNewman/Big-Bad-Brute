private var destroyTimer : float = 2.0;

public var crate_break1 : AudioClip;
public var crate_break2 : AudioClip;
public var crate_break3 : AudioClip;

function Update(){
	Destroy(gameObject, destroyTimer);
}

function Start(){
	var playBreak = Random.Range(1, 3);

	if(playBreak == 1){
		audio.clip = crate_break1;
		audio.Play();
	}

	if(playBreak == 2){
		audio.clip = crate_break2;
		audio.Play();
	}

	if(playBreak == 3){
		audio.clip = crate_break3;
		audio.Play();
	}
}