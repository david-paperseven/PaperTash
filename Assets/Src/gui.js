
class GUIClass
{
    var camera : boolean;
    var tick : boolean;
    var clear : boolean;
    var brush : boolean;
}

var gGUIClass = GUIClass();

function ClearFlags() {
    gGUIClass.camera = false;
    gGUIClass.tick = false;
    gGUIClass.clear = false;
    gGUIClass.brush = false;
}

function Start () {
    ClearFlags();
}

function Update()  {
    var inputManager = GameObject.Find("InputManager");
    var inputScript: tashInput = inputManager.GetComponent(tashInput);

    ClearFlags();
    if (inputScript.gInput.newActivation==true){
        print(" pos "+inputScript.gInput.pos);
        var hit : RaycastHit;
        var fwd = Camera.main.transform.forward;
        if (Physics.Raycast (inputScript.gInput.pos, fwd, hit, 10)) {
            print(hit.collider.gameObject.name);

            if (hit.collider.gameObject.name == "Camera"){
                gGUIClass.camera = true;
            }
            if (hit.collider.gameObject.name == "Tick"){
                gGUIClass.tick = true;
            }
            if (hit.collider.gameObject.name == "Clear"){
                gGUIClass.clear = true;
            }
            if (hit.collider.gameObject.name == "Brush"){
                gGUIClass.brush = true;
            }
        }
    }
}

function LateUpdate() {

}
