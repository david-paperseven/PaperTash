class InputClass
{
	var pos : Vector3;
	var numberTouches : int;
	var active : boolean;
    var deactivateCounter : int;
	var speed : float;
    var pixelsTravelled : float;
	var dir : Vector3;
    var oldScreenSpacePos : Vector2;


    var currentPointerPos : Vector2;
    var oldPointerPos : Vector2;

	var prevPos : Vector3;
    var newActivation : boolean;

    var buttonReset : boolean;
    var buttonMesh : boolean;
    var buttonTash : boolean;
    var buttonImage : boolean;
}

var gInput = InputClass();

private var gState : tashState;
function Start ()
{
    gInput.newActivation = false;

    var manager = GameObject.Find("StateManager");
    gState = manager.GetComponent(tashState);
}

function Update ()
{
    gInput.numberTouches = 0;
    gInput.oldScreenSpacePos = gInput.currentPointerPos;

#if UNITY_EDITOR
    gInput.currentPointerPos = Input.mousePosition;
    if(Input.GetMouseButton(0))
    {
        gInput.numberTouches=1;
    }
    else
    if (Input.GetMouseButton(1))
    {
        gInput.numberTouches = 2;
    }
    else
    {
        gInput.active = false;
    }
#else

    for (var touch : Touch in Input.touches)
    {
        if (touch.phase == TouchPhase.Began || touch.phase == TouchPhase.Moved)
        {
            gInput.currentPointerPos = touch.position;
            gInput.numberTouches++;
        }
    }
    if (gInput.numberTouches==0)
    {
        gInput.deactivateCounter++;
        if (gInput.deactivateCounter>2)
        {
            gInput.active = false;
            gInput.newActivation = false;
        }
    }
    else
    {
        gInput.deactivateCounter=0;
    }

#endif

    if (gInput.numberTouches == 1)
    {

       var p : Vector3 = Camera.main.ScreenToWorldPoint (Vector3 (gInput.currentPointerPos.x,gInput.currentPointerPos.y,1));
       gInput.pos = p;
       gInput.speed = (gInput.currentPointerPos - gInput.oldPointerPos).magnitude;

       gInput.speed = Mathf.Clamp(gInput.speed,0,50);
       gInput.speed = gInput.speed / 50.0;

       if (gInput.speed > 0.0)
       {
           gInput.dir = (p - gInput.prevPos);
           gInput.dir.Normalize();
       }
       else // arbitary vector
       {
//			pInput.dir = Vector3.up;
       }
       gInput.oldPointerPos = gInput.currentPointerPos;

       if (gInput.active == false)
       {
           gInput.newActivation = true;
           gInput.active = true;
           gInput.oldScreenSpacePos = gInput.currentPointerPos;
       }
        else
       {
           gInput.newActivation = false;
       }

    }

}
function LateUpdate()
{
    gInput.buttonReset = false;
    gInput.buttonMesh = false;
    gInput.buttonTash = false;
}

function OnGUI ()
{

    if (gState.ShowGUI()==false)
        return;

    var buttonwidth = 50;
    var buttonheight = 50;
    var left = 10;
    var down = 10;

#if UNITY_EDITOR
#else
    buttonwidth *= 3;
    buttonheight *= 3;
    left *= 3;
    down *= 3;
#endif
	if (GUI.Button (Rect (left,down,buttonwidth,buttonheight), "Reset"))
    {
        gInput.buttonReset = true;
	}
    down+=buttonheight;
    if (GUI.Button (Rect (left,down,buttonwidth,buttonheight), "Mesh"))
    {
        gInput.buttonMesh = true;
    }
    down+=buttonheight;
    if (GUI.Button (Rect (left,down,buttonwidth,buttonheight), "Tash"))
    {
        gInput.buttonTash = true;
    }
    down+=buttonheight;
    if (GUI.Button (Rect (left,down,buttonwidth,buttonheight), "Image"))
    {
 //       state.SaveScreenshot();



        if (gInput.buttonImage == false)
            gInput.buttonImage = true;
        else
            gInput.buttonImage = false;
            
    }

}