var originPosition:Vector3;
var originRotation:Quaternion;

var shake_decay: float;
var shake_intensity: float;;

function Update(){
    if(shake_intensity > 0){

        transform.position = originPosition + Random.insideUnitSphere * shake_intensity;
        transform.rotation =  Quaternion(
                     originRotation.x + Random.Range(-shake_intensity,shake_intensity)*.20,
                     originRotation.y + Random.Range(-shake_intensity,shake_intensity)*.20,
                     originRotation.z + Random.Range(-shake_intensity,shake_intensity)*.20,
                     originRotation.w + Random.Range(-shake_intensity,shake_intensity)*.20);
        shake_intensity -= shake_decay;
    }
}

function Shake(){
    originPosition = transform.position;
    originRotation = transform.rotation;
    shake_intensity = .040;
    shake_decay = 0.010;
}