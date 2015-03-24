var nameHere : UI.InputField;

function postScore() {

    var GUIScript : scoreManager = FindObjectOfType(scoreManager);

    var name : String = nameHere.text;
    GUIScript.postScore(name);

}