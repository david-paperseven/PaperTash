
class GUIClass
{
    var camera : boolean;
    var tick : boolean;
    var clear : boolean;
    var brush : boolean;
    var undo : boolean;
    var hair : boolean;
    var frameAfterTick : boolean;
}

var gGUIClass = GUIClass();

function ClearFlags() {
    gGUIClass.camera = false;
    gGUIClass.tick = false;
    gGUIClass.brush = false;
}

function Start () {
    ClearFlags();
   gGUIClass.clear = false;
   gGUIClass.undo = false;
   gGUIClass.frameAfterTick = false;
}

function Update()  {
    var inputManager = GameObject.Find("InputManager");
    var inputScript: tashInput = inputManager.GetComponent(tashInput);

    ClearFlags();
    if (inputScript.gInput.newActivation==true){
        var hit : RaycastHit;
        var fwd = Camera.main.transform.forward;
        if (Physics.Raycast (inputScript.gInput.pos, fwd, hit, 10)) {

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
            if (hit.collider.gameObject.name == "Undo"){
                gGUIClass.undo = true;
            }

        }
    }
}


function LateUpdate() {

}
