
class CatPoint
{
    var pos : Vector3;
}

class SplineVar
{
    var prevPos : Vector3;
    var totalDistanceTravelled : float;
    var builtMesh : System.Boolean;
    var currentSpline : int;
}

class Splines
{
    var catPoints : Array;
    var finalPoints : Array;
}
var gSplines=new Array();
var gSplineVar = new SplineVar();

var gReset : int = 0;

public var gLineMaterial : Material;
public var gCrossMaterial : Material;

function Start()
{
   Reset();
}

private var gState : tashState;
function Reset()
{
    gSplineVar.totalDistanceTravelled = 0;
    gSplineVar.currentSpline = 0;

    gSplines.Clear();
    var s : Splines = new Splines();
    gSplines.Add(s);
    s.catPoints = new Array();
    s.finalPoints = new Array();

    gSplineVar.builtMesh = false;
    var cube = GameObject.Find("Cube");
    cube.GetComponent(tashPoly).Clear();
    gReset=1;

    var manager = GameObject.Find("StateManager");
    gState = manager.GetComponent(tashState);
}

var gConstantRecalc = true;
function Update ()
{
    var input: tashInput = GetComponent(tashInput);
    var cube = GameObject.Find("Cube");
    var tp = cube.GetComponent(tashPoly);
    var i:int;

    if (input.gInput.buttonImage == true)
        return;

    if (gState.TashActive()==false)
        return;

    gSplineVar.builtMesh = true; // always drawing in mesh mode

    var s : Splines = gSplines[gSplineVar.currentSpline];

    if (input.gInput.numberTouches == 1)
    {
        UpdateSpline(s,input);
    }

    if (input.gInput.numberTouches == 2)
    {
    }

    if (input.gInput.buttonReset == true)
    {
        Reset();
    }

    if (input.gInput.buttonMesh == true)
    {
        if (gSplineVar.builtMesh==true)
        {
            gSplineVar.builtMesh = false;
        }
        else
        {
            for (i = 0; i <= gSplineVar.currentSpline; i++)
            {
                s = gSplines[i];
                CalcFinalPoints(s);
                cube.GetComponent(tashPoly).ConstructMesh(s.finalPoints);
                gSplineVar.builtMesh = true;
            }

        }

    }

    
    if (input.gInput.buttonTash == true)
    {
        tp.IncTashNumber();
        tp.Clear();
        for (i = 0; i <= gSplineVar.currentSpline; i++)
        {
            s = gSplines[i];
            CalcFinalPoints(s);
            tp.ConstructMesh(s.finalPoints);
            gSplineVar.builtMesh = true;
        }

    }

    if (gConstantRecalc)
    {
        if (gSplineVar.builtMesh)
        {
            tp.Clear();
            for (i = 0; i <= gSplineVar.currentSpline; i++)
            {
                s = gSplines[i];
                CalcFinalPoints(s);
                tp.ConstructMesh(s.finalPoints);
                gSplineVar.builtMesh = true;
            }
        }
    }

}

function EvaluateCatmullRom(s : Splines, i:int,t:float)
{
    var point : CatPoint = s.catPoints[i];
    var maxIndex = s.catPoints.length-1;
    
    var index0 = i - 1;
    var index1 = i - 0;
    var index2 = i + 1;
    var index3 = i + 2;

    index0 = Mathf.Clamp(index0,0,maxIndex);
    index1 = Mathf.Clamp(index1,0,maxIndex);
    index2 = Mathf.Clamp(index2,0,maxIndex);
    index3 = Mathf.Clamp(index3,0,maxIndex);

    var point0 : CatPoint = s.catPoints[index0];
    var point1 : CatPoint = s.catPoints[index1];
    var point2 : CatPoint = s.catPoints[index2];
    var point3 : CatPoint = s.catPoints[index3];

    return PointOnCurve(t,point0.pos,point1.pos,point2.pos,point3.pos);
}

public var step : float = 10;
public var MaxDistance : float = 0.2;
var gFinalSplineStep = 0.1;
function CalcFinalPoints(s : Splines)
{
    if (s.catPoints.Count==0)
        return;

    s.finalPoints.Clear();
    
    var totalAngle = 0.0;
    var totaldistance = 0.0;
    var olddir : Vector3 = Vector3.up;

    var maxIndex = s.catPoints.length-1;

    var newpoint : CatPoint;

    // always push the start point
    newpoint = new CatPoint();
    newpoint.pos = EvaluateCatmullRom(s,0,0.0);
    s.finalPoints.Push(newpoint);

    for (var i = 0; i < s.catPoints.Count; i++)
    {
        var point : CatPoint = s.catPoints[i];

        var index0 = i - 1;
        var index1 = i - 0;
        var index2 = i + 1;
        var index3 = i + 2;

        index0 = Mathf.Clamp(index0,0,maxIndex);
        index1 = Mathf.Clamp(index1,0,maxIndex);
        index2 = Mathf.Clamp(index2,0,maxIndex);
        index3 = Mathf.Clamp(index3,0,maxIndex);

        var point0 : CatPoint = s.catPoints[index0];
        var point1 : CatPoint = s.catPoints[index1];
        var point2 : CatPoint = s.catPoints[index2];
        var point3 : CatPoint = s.catPoints[index3];

        var startPos = point1.pos;
        var endPos : Vector3;

        for (var t = 0.0; t <= 1.0+gFinalSplineStep; t+= gFinalSplineStep)
        {
            endPos = PointOnCurve(t,point0.pos,point1.pos,point2.pos,point3.pos);
            var newdir : Vector3 = endPos-startPos;
            var distance = newdir.magnitude;
            if (distance > 0)
            {
                totaldistance += distance;
                newdir.Normalize();
                totalAngle += Vector3.Angle(olddir,newdir);
            }
            else
            {
              //  totalAngle = 0;
            }
            if (/*totalAngle > step || */totaldistance>MaxDistance)
            {
                newpoint = new CatPoint();
                newpoint.pos = endPos;
                s.finalPoints.Push(newpoint);
                olddir=newdir;
                totalAngle=0;
                totaldistance = 0;
            }
            startPos = endPos;
        }
    }

    newpoint = new CatPoint();
    newpoint.pos = EvaluateCatmullRom(s,s.catPoints.Count-1,1.0);
    s.finalPoints.Push(newpoint);

}

public var distanceToNewPoint = 0.1;
function UpdateSpline(s : Splines, input : tashInput)
{
    if (gReset > 0)
    {
        gReset++;
        if (gReset<5)
         return;
        gReset = 0;
    }

    if (s.catPoints.length == 0)
    {
        AddPoint(s,input.gInput.pos);
        AddPoint(s,input.gInput.pos);
    }


    if (input.gInput.newActivation==true)
    {
        var news : Splines = new Splines();
        gSplines.Add(news);
        news.catPoints = new Array();
        news.finalPoints = new Array();
        gSplineVar.currentSpline++;
        return;
    }



    var distance = (gSplineVar.prevPos - input.gInput.pos).magnitude;
    gSplineVar.totalDistanceTravelled += distance;

	// add a new section if the distance is great enough
	if (gSplineVar.totalDistanceTravelled > distanceToNewPoint)
	{
        AddPoint(s,input.gInput.pos);
        gSplineVar.totalDistanceTravelled = 0;
    }

    // last point always at current position
    var point : CatPoint = s.catPoints[s.catPoints.length-1];
    point.pos = input.gInput.pos;

}

function AddPoint(s : Splines, pos : Vector3)
{
    var point : CatPoint = new CatPoint();
    point.pos = pos;
    s.catPoints.Push(point);

    gSplineVar.prevPos = pos;
}

//--------------------------------------------------------------------------------------------------------------------
// Render
//--------------------------------------------------------------------------------------------------------------------

function DrawPoints(s : Splines)
{
	var up = Camera.main.transform.up;
	var right = Camera.main.transform.right;
	var scale = 0.01;
	GL.Begin(GL.LINES);
//	GL.Color(Color.red);

   	for (var i = 0; i < s.catPoints.length; i++)
	{
        var point : CatPoint = s.catPoints[i];
		var pos = point.pos;

		GL.Vertex( pos + up * scale);
		GL.Vertex( pos - up * scale);

		GL.Vertex( pos + right * scale);
		GL.Vertex( pos - right * scale);
	}
 	GL.End();
}

public var splineStep = 0.1;
function DrawSpline(s : Splines)
{
    GL.Begin(GL.LINES);
  //  GL.Color(Color.white);

    var p0 : Vector3;
    var p1 : Vector3;
    var p2 : Vector3;
    var p3 : Vector3;

    var maxIndex = s.catPoints.length-1;
    for (var i = 0; i < s.catPoints.length-1; i++)
    {
        var index0 = i - 1;
        var index1 = i - 0;
        var index2 = i + 1;
        var index3 = i + 2;


        index0 = Mathf.Clamp(index0,0,maxIndex);
        index1 = Mathf.Clamp(index1,0,maxIndex);
        index2 = Mathf.Clamp(index2,0,maxIndex);
        index3 = Mathf.Clamp(index3,0,maxIndex);

        var point0 : CatPoint = s.catPoints[index0];
        var point1 : CatPoint = s.catPoints[index1];
        var point2 : CatPoint = s.catPoints[index2];
        var point3 : CatPoint = s.catPoints[index3];

        var startPos = point1.pos;
        var endPos : Vector3;
        for (var t = 0.0; t <= 1.0+splineStep; t+= splineStep)
        {
            endPos = PointOnCurve(t,point0.pos,point1.pos,point2.pos,point3.pos);
            GL.Vertex( startPos );
            GL.Vertex( endPos );
            startPos = endPos;

        }
    }

    GL.End();
}

function OnRenderObject()
{
    /*
    var i:int;
    var s : Splines;

    if (gSplineVar.builtMesh)
        return;

    GL.PushMatrix();
    gCrossMaterial.SetPass(0);

    for (i = 0; i <= gSplineVar.currentSpline; i++)
    {
        s = gSplines[i];
        DrawPoints(s);
    }

    gLineMaterial.SetPass(0);

    for (i = 0; i <= gSplineVar.currentSpline; i++)
    {
        s = gSplines[i];
        DrawSpline(s);
    }
    GL.PopMatrix();
    */
}

function PointOnCurve(t : float, p0 : Vector3, p1 : Vector3, p2 : Vector3, p3 : Vector3)
{
    var t2 : float = t * t;
    var t3 : float = t2 * t;

    var out : Vector3;

    out.x = 0.5 * ( ( 2.0 * p1.x ) + ( -p0.x + p2.x ) * t + ( 2.0 * p0.x - 5.0 * p1.x + 4 * p2.x - p3.x ) * t2 + ( -p0.x + 3.0 * p1.x - 3.0 * p2.x + p3.x ) * t3 );
    out.y = 0.5 * ( ( 2.0 * p1.y ) + ( -p0.y + p2.y ) * t + ( 2.0 * p0.y - 5.0 * p1.y + 4 * p2.y - p3.y ) * t2 + ( -p0.y + 3.0 * p1.y - 3.0 * p2.y + p3.y ) * t3 );
    out.z = p0.z;//0.5 * ( ( 2.0 * p1.z ) + ( -p0.z + p2.z ) * t + ( 2.0 * p0.z - 5.0 * p1.z + 4 * p2.z - p3.z ) * t2 + ( -p0.y + 3.0 * p1.z - 3.0 * p2.z + p3.z ) * t3 );

    return out;
}
