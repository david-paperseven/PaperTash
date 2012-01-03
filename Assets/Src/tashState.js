


public var gState =
{
    "SPLASHSCREEN" : 0,
    "EDITTASH" : 1
};
public var gCurrentState = 0;

private var gStates = new Array();
private var gDelayCounter = 0;

function ShowGUI()
{
    //return gCurrentState == 2;
    //never show the gui
    return false;
}

function MovePhoto()
{
    return gCurrentState==2;
}
function TashActive()
{
    return gCurrentState == 3;
}

function SaveScreenshot()
{
    StartCoroutine( EtceteraBinding.takeScreenShot( "someScreenshot.png" ) );
}

var gCameras : Camera[];
var gTashGuideMesh : MeshRenderer;
private var gTashInput : tashInput;
private var gTashPoly : tashPoly;
private var gCatmull : Catmull;
private var gHUD : GameObject;
var hudy : float;
var gTick : GameObject;
var gTickInitialScaleY : float;
var gLogo : GameObject;
var gLogoInitialY : float;
function Start ()
{
    // gather all the states

    gCurrentState = 0;

    var splashscreen = GameObject.Find("Cam1");
    if (Screen.width == 960)
    {
 //       splashscreen.transform.position.z = 46;
    }
    else
    {
        splashscreen.transform.position.z = 56;
    }
    gStates.Add(splashscreen);
    var nextscreen = GameObject.Find("Main Camera");
    if (Screen.width == 960)
    {
        nextscreen.transform.position.z = 65;
    }
    else
    {
        nextscreen.transform.position.z = 72;
    }
    gStates.Add(nextscreen);
//    var tashscreen = GameObject.Find("Main Camera");
//    gStates.Add(tashscreen);

    gCameras = FindObjectsOfType(Camera) as Camera[];

    var tashGuide = GameObject.Find("Tash_Guide_Mesh");
    gTashGuideMesh = tashGuide.GetComponent(MeshRenderer);

    // Listen to image picker event so we can load the image into a texture later
    EtceteraManager.imagePickerChoseImage += imagePickerChoseImage;

    var tashMain = GameObject.Find("TashMain");
    gTashInput = tashMain.GetComponent(tashInput);
    gCatmull = tashMain.GetComponent(Catmull);

    var cube = GameObject.Find("Cube");
    gTashPoly = cube.GetComponent(tashPoly);

    gHUD = GameObject.Find("HUD");
    hudy = gHUD.transform.position.y;

    gTick = GameObject.Find("Tick_ICON");
    gTickInitialScaleY = gTick.transform.localScale.y;

    gLogo = GameObject.Find("Logo_ICON");
    gLogoInitialY = gLogo.transform.position.y;
}

function OnDisable()
{
    // Stop listening to the image picker event
    EtceteraManager.imagePickerChoseImage -= imagePickerChoseImage;
}

public var photoObject : GameObject;
function textureLoaded(texture : Texture2D)
{
    photoObject.renderer.material.mainTexture = texture;
    photoObject.renderer.material.color = Color(0.5,0.5,0.5,1);
}

function textureLoadFailed( error : String )
{
    EtceteraBinding.showAlertWithTitleMessageAndButton( "Error Loading Texture.  Did you choose a photo first?", error, "OK" );
    Debug.Log( "textureLoadFailed: " + error );
}

function imagePickerChoseImage( imagePath : String)
{
    var iPath = imagePath;
    print("got one "+iPath);
    StartCoroutine( EtceteraManager.textureFromFileAtPath( "file://" + imagePath, textureLoaded, textureLoadFailed ) );
    //EtceteraBinding.saveImageToPhotoAlbum(imagePath);
}

function DisableAllCameras ()
{
   for (var cam : Camera in gCameras)
   {
        cam.camera.enabled = false;
   }
}

function Update ()
{
    ChangeState();
    ProcessState();
}

function ChangeState()
{
}

function EnteringState()
{


}

var gPromptedForPhoto = false;
var gTickPressed = false;
var gScreenShot = 0;

function ProcessState()
{
    var cam : Camera;
    var go : GameObject;

    DisableAllCameras();

    gTashGuideMesh.enabled = false;

    gLogo.transform.position.y = 1000;

    switch (gCurrentState)
    {
        case 0:
            go = gStates[gCurrentState];
            cam = go.GetComponent(Camera);
            cam.camera.enabled = true;

            if (gTashInput.gInput.newActivation)
            {
                gCurrentState++;
                gTashInput.gInput.newActivation=false;
            }
            break;
        case 1:
            go = gStates[gCurrentState];
            cam = go.GetComponent(Camera);
            cam.camera.enabled = true;

            if (gTashInput.gInput.newActivation)
            {
                if (!gPromptedForPhoto)
                {
                    EtceteraBinding.promptForPhoto( 1.0 );
                    gPromptedForPhoto = true;
                }
                else
                {
                    gCurrentState++;
                }
            }

            break;
        case 2:
            go = gStates[1];
            cam = go.GetComponent(Camera);
            cam.camera.enabled = true;
   //         gTashGuideMesh.enabled=true;

            if (gTickPressed)
            {
                gCurrentState++;
            }
            break;
        case 3:
             go = gStates[1];
             cam = go.GetComponent(Camera);
             cam.camera.enabled = true;
            if (gTickPressed)
            {
                StartCoroutine( EtceteraBinding.takeScreenShot( "someScreenshot.png" ) );
                gHUD.transform.position.y = 1000;

                gScreenShot=1;
//                gCatmull.Reset();
//                gTashPoly.Clear();
//                gCurrentState=0;
            //    gPromptedForPhoto = false;

            }
            break;

    }
    gTickPressed = false;

    if (gScreenShot>0)
    {
        print("screenshot "+gScreenShot);
        gScreenShot++;
        gLogo.transform.position.y = gLogoInitialY;
        if (gScreenShot == 20)
        {
            gScreenShot = 0;
            gHUD.transform.position.y = hudy;
        }

    }

    if (gTick.transform.localScale.y>gTickInitialScaleY)
    {
        gTick.transform.localScale.y -= (gTick.transform.localScale.y-gTickInitialScaleY)*0.1;
    }
}

public var gGUITexture : Texture;

public var gResetButton4G = Rect(449,562,70,70);
public var gTickButton4G = Rect(851,555,91,80);
public var gStyleButton4G = Rect(10,567,74,69);
public var gCameraButton4G = Rect(848,4,105,78);
public var gColourButton4G = Rect(703,569,256,70);

public var gResetButtonPad = Rect(476,633,78,70);
public var gTickButtonPad = Rect(870,528,103,85);
public var gStyleButtonPad = Rect(52,629,76,76);
public var gCameraButtonPad = Rect(857,99,109,70);
public var gColourButtonPad = Rect(736,648,271,50);


function OnGUI ()
{
    // switch based on screen dimensions
    var ResetButton : Rect;
    var TickButton : Rect;
    var StyleButton : Rect;
    var CameraButton : Rect;
    var ColourButton : Rect;
    if (Screen.width == 960) // iphone 4G
    {
        ResetButton = gResetButton4G;
        TickButton = gTickButton4G;
        StyleButton = gStyleButton4G;
        CameraButton = gCameraButton4G;
        ColourButton = gColourButton4G;
    }
    else // iPad (1024 x 768)
    {
        ResetButton = gResetButtonPad;
        TickButton = gTickButtonPad;
        StyleButton = gStyleButtonPad;
        CameraButton = gCameraButtonPad;
        ColourButton = gColourButtonPad;
    }

	if (GUI.Button (ResetButton, gGUITexture,GUIStyle.none))
    {
        if (TashActive())
        {
            gCatmull.Reset();
        }
	}

    if (GUI.Button (TickButton, gGUITexture,GUIStyle.none))
    {
        gTick.transform.localScale.y = 0.5;
        gTickPressed = true;
    }

    if (TashActive())
    {
        if (GUI.Button (StyleButton, gGUITexture,GUIStyle.none))
        {
            gTashPoly.IncTashNumber();
            gTashPoly.Clear();
        }
    }

    if (GUI.Button (CameraButton, gGUITexture,GUIStyle.none))
    {
        if (gCurrentState==3)
        {
            if (TashActive())
            {
                gCatmull.Reset();
            }
            gPromptedForPhoto=false;
            gCurrentState=1;
            gTashInput.gInput.newActivation=true;
        }
    }

    if (GUI.Button (ColourButton, gGUITexture,GUIStyle.none))
    {
        print("cycle colours");
    }

//    if (GUI.Button (Rect (xpos,ypos,width,height), gGUITexture))
//    {
//        print("cycle");
//    }
}
