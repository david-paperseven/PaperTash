
//DON'T USE THIS ANYMORE


private var gState : tashState;
private var gTashInput : tashInput;
function Start ()
{
    var manager = GameObject.Find("StateManager");
    gState = manager.GetComponent(tashState);

    var tashMain = GameObject.Find("TashMain");
    gTashInput = tashMain.GetComponent(tashInput);
}

function Update ()
{
    if (gState.MovePhoto()==false)
        return;

    if (0 && gTashInput.gInput.active)
    {
        var p1 : Vector3 = Camera.main.ScreenToWorldPoint (Vector3 (gTashInput.gInput.currentPointerPos.x,gTashInput.gInput.currentPointerPos.y,70));
        var p2 : Vector3 = Camera.main.ScreenToWorldPoint (Vector3 (gTashInput.gInput.oldScreenSpacePos.x,gTashInput.gInput.oldScreenSpacePos.y,70));
       // print(p1-p2);
        transform.position += p1-p2;
    }

    
}