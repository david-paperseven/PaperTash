
//
// touchscreen control for the iDevices
//

#pragma strict
private var touchBegan: boolean;
private var previous: Vector2;
private var swipe: int;
private var dx: float;
private var dy: float;
var dVec: Vector3;
private var minDist: float;
private var maxDist: float;
private var moveFactor: float;
private var curDist: Vector2;
private var prevDist: Vector2;
private var	touch2: Touch;
private var nTouch;
private var dpos: Vector2;
private var pinch: boolean;
private	var slide: float;
private var nextDeviceMove: GameObject;
private var go: GameObject;
private var pos: Vector3;
private var hit: RaycastHit;
private var currentPlayer: int;
private var undoLimit: float;
private var undoAllowed: boolean;
private var undo: boolean;
private var devicePlays: int;
private var timeSinceLastMove: float;
private var rotationRate: float;
static var touch: Touch;
static var popup : boolean;
static var tap: boolean;
static var offset : Vector3;

private var gTashInput : tashInput;
private var gState : tashState;

private var gTopLeft : GameObject;
private var gBottomRight : GameObject;
var leftx : float;
function Start()
{
	reset();

    var tashMain = GameObject.Find("TashMain");
    gTashInput = tashMain.GetComponent(tashInput);

    var manager = GameObject.Find("StateManager");
    gState = manager.GetComponent(tashState);

    gTopLeft = GameObject.Find("TopLeft");
    gBottomRight = GameObject.Find("BottomRight");


}

function reset()
{
	touchBegan = false;
	swipe = 0;
	pinch = false;
	dVec = Vector3.zero;
	minDist = 1;
	maxDist = 10;
	moveFactor = 0.010;
	popup = false;
	tap = false;
    slide = 1.0;

    offset = Vector3(0,0,0);
	//transform.LookAt(Vector3.zero);
}

//
// Check for iPhone Touches here
//
var gLastNumTouches : int = 0;
function FixedUpdate ()
{
	timeSinceLastMove += Time.deltaTime;

	//
	// Decode touches here
	//

	nTouch = Input.touchCount;

    if (nTouch != gLastNumTouches)
    {
        gLastNumTouches = nTouch;
        return;
    }
    gLastNumTouches = nTouch;

	if (nTouch == 1)
    {
        touch = Input.GetTouch(0);
        var oldposition = touch.position - touch.deltaPosition;

        var p1 : Vector3 = Camera.main.ScreenToWorldPoint (Vector3 (touch.position.x,touch.position.y,70));
        var p2 : Vector3 = Camera.main.ScreenToWorldPoint (Vector3 (oldposition.x,oldposition.y,70));
        offset+=(p1-p2);

	}
    else
    if (nTouch == 2)
    {
        print(gTashInput.gInput.numberTouches+" nTouch "+nTouch);
#if UNITY_EDITOR
        slide += (gTashInput.gInput.oldScreenSpacePos.y-gTashInput.gInput.currentPointerPos.y)*moveFactor;
		slide = Mathf.Clamp(slide, minDist, maxDist);
        pinch = true;
#else

        pinch = false;
		touch = Input.GetTouch(0);
 		touch2 = Input.GetTouch(1);
		dVec = Vector3.zero;

		if (touch.phase == TouchPhase.Moved &&
		    touch2.phase == TouchPhase.Moved)
        {

			curDist = touch.position - touch2.position;

			prevDist = (touch.position - touch.deltaPosition) -
			                  (touch2.position - touch2.deltaPosition);

			slide -= moveFactor * (prevDist.magnitude - curDist.magnitude);


			slide = Mathf.Clamp(slide, minDist, maxDist);

			pinch = true;
		}

#endif

	}
}

function Update ()
{
    if (!gState.MovePhoto())
        return;
    if (pinch)
    {
		// move the camera in and out based on how far we pinched
	//	transform.Translate(dVec);

		// make sure we're still looking at the origin
	//	transform.LookAt(Vector3.zero);

		// don't pinch on next update
		pinch = false;
        transform.localScale = Vector3(slide,slide,slide);
    }
    var topLeft = Camera.main.WorldToScreenPoint(gTopLeft.transform.position);
    var bottomRight = Camera.main.WorldToScreenPoint(gBottomRight.transform.position);

//    print("topleft "+topLeft+" bottomRight "+bottomRight);

    var divisor = 50.0;

    var centre : Rect;

    if (Screen.width == 960)
    {
        centre = Rect(0,640,960,0);
    }
    else
    {
        centre = Rect(32,704,992,64);
    }

    if (topLeft.x > centre.xMin)
    {
        offset.x -= (centre.xMin-topLeft.x)/divisor;
    }


    if (topLeft.y < centre.yMin)
    {
        offset.y += (centre.yMin-topLeft.y)/divisor;
    }


    if (bottomRight.x < centre.width)
    {
        offset.x -= (centre.width-bottomRight.x)/divisor;
    }

    if (bottomRight.y > centre.height)
    {
        offset.y += (centre.height-bottomRight.y)/divisor;
    }
  
    transform.position.x = offset.x;
    transform.position.y = offset.y;

}

