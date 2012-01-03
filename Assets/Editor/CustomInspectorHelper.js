
#pragma strict
@CustomEditor(customInspector)

class customInspectorHelper extends Editor
{

    var serObj : SerializedObject;
    var sliderVal : SerializedProperty;

    function OnEnable () {
       serObj = new SerializedObject (target);
       sliderVal = serObj.FindProperty("sliderVal");
    }

    function OnInspectorGUI () {
       serObj.Update ();

       GUILayout.Label("Pimp My Inspector");
       sliderVal.intValue = EditorGUILayout.IntSlider ("Slider Value", sliderVal.intValue, 0, 100);

       serObj.ApplyModifiedProperties();
    }
}