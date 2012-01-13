using UnityEngine;
using System.Collections;


public class EtceteraGUIManagerThree : MonoBehaviour
{
	void OnGUI()
	{
		float yPos = 5.0f;
		float xPos = 5.0f;
		float width = 200.0f;
		float height = 40.0f;
		float heightPlus = height + 10.0f;
		
		
		/* These methods will only be available if you follow the steps in the READ_ME.txt file when
		   using Unity < 3.2.
		if( GUI.Button( new Rect ( xPos, yPos, width, height), "Enable MSAA 4x" ) )
		{
			EtceteraBinding.enableAntiAliasing( true, 4 );
		}
		
		
		if( GUI.Button( new Rect ( xPos, yPos += heightPlus, width, height), "Enable MSAA 2x" ) )
		{
			EtceteraBinding.enableAntiAliasing( true, 2 );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Disable MSAA" ) )
		{
			EtceteraBinding.enableAntiAliasing( false, 0 );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Toggle Pause Rotation" ) )
		{
			var results = FindObjectsOfType( typeof( CubeRotator ) );
			for( int i = 0; i < results.Length; i++ )
			{
				var item = results[i] as CubeRotator;
				item.togglePauseRotation();
			}
		}
		*/
		

		// Next scene button
		if( GUI.Button( new Rect( Screen.width - 100, Screen.height - 50, 95, 45 ), "Back" ) )
		{
			Application.LoadLevel( "EtceteraTestScene" );
		}
		
		
		// Second row
		yPos = 5.0f;
		xPos = Screen.width - width - 5.0f;
		
		if( GUI.Button( new Rect( xPos, yPos, width, height ), "Get Badge Count" ) )
		{
			Debug.Log( "badge count is: " + EtceteraBinding.getBadgeCount() );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Set Badge Count" ) )
		{
			EtceteraBinding.setBadgeCount( 46 );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Get Orientation" ) )
		{
			UIInterfaceOrientation orient = EtceteraBinding.getStatusBarOrientation();
			Debug.Log( "status bar orientation: " + orient.ToString() );
		}

		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Get UDIDs" ) )
		{
			var uniqueDeviceId = EtceteraBinding.uniqueDeviceIdentifier();
			var globalId = EtceteraBinding.uniqueGlobalDeviceIdentifier();
			
			Debug.Log( string.Format( "unique: {0}\nglobal: {1}", uniqueDeviceId, globalId ) );
		}
		
	}
}
