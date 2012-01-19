class InputClass
{
	var pos : Vector3;
	var numberTouches : int;
	var active : boolean;
    var deactivateCounter : int;
	var speed : float;
    var pixelsTravelled : float;
	var dir : Vector3;


    var currentPointerPos : Vector2;
    var oldPointerPos : Vector2;

	var prevPos : Vector3;
    var newActivation : boolean;
}

var gInput = InputClass();

function Start ()
{
    gInput.newActivation = false;
}

function ReadIOS()
{
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
        // wait at least six frames before deciding that the user has lifted their finger
        // because iOS sometimes incorrectly reports that there are no touches
        if (gInput.deactivateCounter>6)
        {
            gInput.active = false;
        }
        gInput.newActivation = false;
    }
    else
    {
        gInput.deactivateCounter=0;
    }

    if (gInput.numberTouches == 1)
    {
        if (gInput.active == false)
        {
            gInput.newActivation = true;
            gInput.active = true;
        }
        else
        {
            gInput.newActivation = false;
        }
    }
}

function ReadMouse()
{
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

   if (gInput.numberTouches == 1)
    {
        if (gInput.active == false)
        {
            gInput.newActivation = true;
            gInput.active = true;
        }
        else
        {
            gInput.newActivation = false;
        }
    }
}

function Update ()
{
    gInput.numberTouches = 0;

    var usingMouse = true;
    #if UNITY_IPHONE
    usingMouse = false;
    #endif
    #if UNITY_EDITOR
    usingMouse=true;
    #endif

    if (usingMouse){
        ReadMouse();
    } else {
        ReadIOS();
    }

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
/*
       if (gInput.active == false)
       {
           gInput.newActivation = true;
           gInput.active = true;
       }
        else
       {
           gInput.newActivation = false;
       }
*/
    }

}
function LateUpdate()
{
}

function OnGUI ()
{
}

public var gInputLineMaterial : Material;
function OnRenderObject(){
	var up = Camera.main.transform.up;
	var right = Camera.main.transform.right;

    // set the current material
    gInputLineMaterial.SetPass( 0 );

	GL.Begin(GL.LINES);
    var renderPointScale = 5;

    GL.Vertex( gInput.pos + up * renderPointScale);
    GL.Vertex( gInput.pos - up * renderPointScale);

    GL.Vertex( gInput.pos + right * renderPointScale);
    GL.Vertex( gInput.pos - right * renderPointScale);


    for (var touch : Touch in Input.touches)
    {
        if (touch.phase == TouchPhase.Began || touch.phase == TouchPhase.Moved)
        {
            var p : Vector3 = Camera.main.ScreenToWorldPoint (Vector3 (touch.position.x,touch.position.y,1));
            renderPointScale = 2;
            GL.Vertex( p + up * renderPointScale);
            GL.Vertex( p - up * renderPointScale);

            GL.Vertex( p + right * renderPointScale);
            GL.Vertex( p - right * renderPointScale);
        }
    }

    GL.End();
}