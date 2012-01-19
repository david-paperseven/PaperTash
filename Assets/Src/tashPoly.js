
class Vert
{
    var pos : Vector3;
    var index : int;
}

class Triangle
{
    var iA : int;
    var iB : int;
    var iC : int;
    var exteriorEdge : int;
    var normal : Vector3;
}

class cMesh
{
    var verts : ArrayList;
    var triangles : ArrayList;
}
var gMeshes=new Array();

function Clear()
{
    gMeshes.Clear();
}


public var slerp : float = 0.1;
public var tashHeight : float = 0.06;
public var tashWidth : float = 100.0;
var constructMeshDebug = true;
function ConstructMesh(catPoints : Array)
{
    var splineObject = GameObject.Find("TashSpline");
    var ts : tashSpline = splineObject.GetComponent("tashSpline");

    if (catPoints.Count < 2) // have to have at least 3 points
    {
        return;
    }
    if (!constructMeshDebug)
        return;
    //---
    var m : cMesh = new cMesh();
    gMeshes.Add(m);
    m.verts = new ArrayList();
    m.triangles = new ArrayList();
    //---
    var point : Vector3;
    var up : Vector3;
    var direction : Vector3;
    var currentVert : int;
    var distance : float = 0.0;

    var count : int = 0;

    var totalLength : float = ts.GetTotalSplineLength(catPoints);
    // start slim
    point = catPoints[0];
    AddPoint(m,point);
    for (var i = 1; i < catPoints.Count-1; i++)
    {
        point = catPoints[i];

        var prevPoint : Vector3 = catPoints[i-1];
        direction = point - prevPoint;
        distance += direction.magnitude;
        direction.Normalize();
        up = Vector3.Cross(direction,Camera.main.transform.forward);
        var cameraUp : Vector3 = Camera.main.transform.up;
        up = Vector3.Slerp(up,cameraUp,slerp);

        AddPoint(m,point);

        var width : float = ts.GetWidth(distance/totalLength);

        AddPoint(m,point + up*width*tashWidth + Camera.main.transform.forward*tashHeight);
        AddPoint(m,point - up*width*tashWidth + Camera.main.transform.forward*tashHeight);

        currentVert = m.verts.Count-1;
        // beginning and end are special cases
        if (i==1) // beginning
        {
            AddTriangle(m,currentVert - 2, currentVert - 1, currentVert - 3,0);
            AddTriangle(m,currentVert - 2, currentVert - 3, currentVert - 0,0);

        }
        else
        {
            count++;
            if (count>1)
                count = 0;
            if (count==0)
            {
                AddTriangle(m,currentVert - 2, currentVert - 5, currentVert - 3,1);
                AddTriangle(m,currentVert - 3, currentVert - 0, currentVert - 2,1);

                AddTriangle(m,currentVert - 4, currentVert - 5, currentVert - 2,2);
                AddTriangle(m,currentVert - 2, currentVert - 1, currentVert - 4,2);
            }

            if (count==1)
            {
                AddTriangle(m,currentVert - 0, currentVert - 2, currentVert - 5,2);
                AddTriangle(m,currentVert - 5, currentVert - 3, currentVert - 0,2);

                AddTriangle(m,currentVert - 1, currentVert - 4, currentVert - 5,1);
                AddTriangle(m,currentVert - 5, currentVert - 2, currentVert - 1,1);

            }

        }
    }

    // end slim
    point = catPoints[catPoints.Count-1];
    AddPoint(m,point);

    currentVert = m.verts.Count-1;
    if (currentVert>=3)
    {
        AddTriangle(m,currentVert - 0, currentVert - 2, currentVert - 3,0);
        AddTriangle(m,currentVert - 0, currentVert - 3, currentVert - 1,0);
    }
}

function AddPoint(m : cMesh, pos : Vector3)
{
    var vert : Vert = new Vert();
    vert.index = m.verts.Count;
    vert.pos = pos;
    m.verts.Add(vert);
}

function AddTriangle(m : cMesh, iA : int, iB : int, iC : int, EE : int)
{
    var tri : Triangle = new Triangle();
    tri.iA = iA;
    tri.iB = iB;
    tri.iC = iC;
    tri.exteriorEdge = EE;
    m.triangles.Add(tri);
    tri.normal = CalcTriangleNormal(m,tri);
}

// calc the normal given the 3 vertices
function CalcTriangleNormal(m : cMesh,tri : Triangle)
{
    var pointA : Vert = m.verts[tri.iA];
    var pointB : Vert = m.verts[tri.iB];
    var pointC : Vert = m.verts[tri.iC];

    var AtoB = pointB.pos-pointA.pos;
    var AtoC = pointC.pos-pointA.pos;

    AtoB.Normalize();
    AtoC.Normalize();

    var N = Vector3.Cross(AtoB,AtoC);

 //   var quat : Quaternion = Quaternion.AngleAxis(Random.value*15.0,Vector3.right);
 //   N = quat * N;

    N.Normalize();
    return N;
}

function Update ()
{
}


//-------------------------------------------------------------------------------------
// Mesh renderer

public var DrawMesh = false;

function LateUpdate ()
{



	// Rebuild the mesh
	var mesh : Mesh = GetComponent(MeshFilter).mesh;
	mesh.Clear();

    if (!DrawMesh)
      return;

    var i:int;
    var numTriangles = 0;
    var m : cMesh;
    for (i = 0; i < gMeshes.length; i++)
    {
        m = gMeshes[i];
        numTriangles+=m.triangles.Count;

    }

    var tri : Triangle;
    var numTriangleIndices = numTriangles*3;
    var numVerts = numTriangleIndices;
	var vertices = new Vector3[numVerts];
	var colors = new Color[numVerts];
	var uv = new Vector2[numVerts];
    var normals = new Vector3[numVerts];
    var triangleIndices = new int[numTriangleIndices];

    // Use matrix instead of transform.TransformPoint for performance reasons
	var localSpaceTransform = transform.worldToLocalMatrix;

    var counter : int = 0;
    for (var index = 0; index < gMeshes.Count; index++)
    {
        m = gMeshes[index];
        // Generate vertex, uv and colors
        for (i=0;i<m.triangles.Count;i++)
        {
            uv[counter + 0] = Vector2(0, 0);
            uv[counter + 1] = Vector2(0, 0);
            uv[counter + 2] = Vector2(0, 0);

            var Color = Color.red;
            colors[counter + 0] = Color;
            colors[counter + 1] = Color;
            colors[counter + 2] = Color;

            tri = m.triangles[i];
            var vertA : Vert = m.verts[tri.iA];
            var vertB : Vert = m.verts[tri.iB];
            var vertC : Vert = m.verts[tri.iC];
            vertices[counter + 0] = localSpaceTransform.MultiplyPoint(vertA.pos);
            vertices[counter + 1] = localSpaceTransform.MultiplyPoint(vertB.pos);
            vertices[counter + 2] = localSpaceTransform.MultiplyPoint(vertC.pos);

            var TransformedNormal = localSpaceTransform.MultiplyVector(tri.normal);
            normals[counter + 0] = TransformedNormal;
            normals[counter + 1] = TransformedNormal;
            normals[counter + 2] = TransformedNormal;
            counter+=3;
        }
    }

    numTriangleIndices = numTriangles*3;
	for (i=0;i<numTriangleIndices;i++)
	{
		triangleIndices[i] = i;
	}

   	// Assign to mesh
	mesh.vertices = vertices;
	mesh.colors = colors;
	mesh.uv = uv;
    mesh.normals = normals;
	mesh.triangles = triangleIndices;
}

public var zBiasForWireframe = 0.003;
function DrawWireframe()
{
    GL.Begin(GL.LINES);

    var tri : Triangle;
    var m : cMesh;
    var numTriangles = 0;
    var count : int = 0;
    var index:int;
    for (index = 0; index < gMeshes.Count; index++)
    {
        m = gMeshes[index];
        numTriangles = m.triangles.Count;

        for (var i=0;i<numTriangles;i++)
        {
            tri = m.triangles[i];
            var vertA : Vert = m.verts[tri.iA];
            var vertB : Vert = m.verts[tri.iB];
            var vertC : Vert = m.verts[tri.iC];
            var p1 : Vector3  = vertA.pos-Camera.main.transform.forward*zBiasForWireframe;
            var p2 : Vector3  = vertB.pos-Camera.main.transform.forward*zBiasForWireframe;
            var p3 : Vector3  = vertC.pos-Camera.main.transform.forward*zBiasForWireframe;

            if ( tri.exteriorEdge==0 || tri.exteriorEdge==1)
            {
                GL.Vertex(p1);
                GL.Vertex(p2);
            }
            else
            {
                if (count < 3)
                {
                    GL.Vertex(p1);
                    GL.Vertex(p2);

                }
            }
            if ( tri.exteriorEdge==0 || tri.exteriorEdge==2)
            {
                GL.Vertex(p2);
                GL.Vertex(p3);
            }
            else
            {
                if (count > 3)
                {
                    GL.Vertex(p2);
                    GL.Vertex(p3);
                }

            }
            if (count < 4 )
            {
                GL.Vertex(p3);
                GL.Vertex(p1);
            }
            count++;
            if (count>6)
                count=0;

        }
    }
    GL.End();
}

function DrawPoints()
{

	var up = Camera.main.transform.up;
	var right = Camera.main.transform.right;

	GL.Begin(GL.LINES);
    var renderPointScale = 0.01;

    var index:int;
    var m : cMesh;
    
    for (index = 0; index < gMeshes.Count; index++)
    {
        m = gMeshes[index];

        for (var i = 0; i < m.verts.Count; i++)
        {
            var vert : Vert = m.verts[i];

            GL.Vertex( vert.pos + up * renderPointScale);
            GL.Vertex( vert.pos - up * renderPointScale);

            GL.Vertex( vert.pos + right * renderPointScale);
            GL.Vertex( vert.pos - right * renderPointScale);
        }
    }
 	GL.End();

}

public var gMeshLineMaterial : Material;

function OnRenderObject()
{
    if (!DrawMesh)
        return;
    // set the current material
    gMeshLineMaterial.SetPass( 0 );

	GL.PushMatrix();
  	DrawPoints();
    DrawWireframe();
    GL.PopMatrix();
  
}


@script RequireComponent (MeshFilter)