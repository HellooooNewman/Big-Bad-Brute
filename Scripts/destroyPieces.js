private var destroyTimer : float = 10.0;

function Update(){
	destroyTimer = Random.Range(10, 20);
	Destroy(gameObject, destroyTimer);
}