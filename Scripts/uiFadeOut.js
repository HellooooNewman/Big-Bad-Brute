

private var sprite : UI.Text;

function Start(){
	sprite = GetComponent(UI.Text);
}
function Update(){

	sprite.color.a = Mathf.Lerp(sprite.color.a, 0.0, Time.deltaTime * 5);

	if (sprite.color.a <= 0){
		Destroy(gameObject);

	}

}