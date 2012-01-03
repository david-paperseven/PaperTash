using UnityEngine;
using System.Collections;


public class EtceteraGUIManagerTwo : MonoBehaviour
{
	public GameObject testPlane;
	private string imagePath;
	
	
	void Start()
	{
		// Listen to image picker event so we can load the image into a texture later
		EtceteraManager.imagePickerChoseImage += imagePickerChoseImage;
	}
	
	
	void OnDisable()
	{
		// Stop listening to the image picker event
		EtceteraManager.imagePickerChoseImage -= imagePickerChoseImage;
	}
	
	
	void OnGUI()
	{
		float yPos = 5.0f;
		float xPos = 5.0f;
		float width = 200.0f;
		float height = 40.0f;
		float heightPlus = height + 10.0f;
		
		
		if( GUI.Button( new Rect ( xPos, yPos, width, height), "Show Activity View" ) )
		{
			EtceteraBinding.showActivityView();
			
			// hide the activity view after a short delay
			StartCoroutine( hideActivityView() );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Show Bezel Activity View" ) )
		{
			EtceteraBinding.showBezelActivityViewWithLabel( "Loading Stuff..." );
			
			// hide the activity view after a short delay
			StartCoroutine( hideActivityView() );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Rate This App" ) )
		{
			EtceteraBinding.askForReview( "Do you like this game?", "Please review the game if you do!", "https://userpub.itunes.apple.com/WebObjects/MZUserPublishing.woa/wa/addUserReview?id=366238041&type=Prime31+Studios" );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Prompt for Photo" ) )
		{
			EtceteraBinding.promptForPhoto( 0.15f );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Register for Push" ) )
		{
			EtceteraBinding.registerForRemoteNotifcations( RemoteNotificationType.Alert | RemoteNotificationType.Badge | RemoteNotificationType.Sound );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Get Registered Push Types" ) )
		{
			RemoteNotificationType types = EtceteraBinding.getEnabledRemoteNotificationTypes();
			
			if( ( types & RemoteNotificationType.Alert ) != RemoteNotificationType.None )
				Debug.Log( "registered for alerts" );
				
			if( ( types & RemoteNotificationType.Sound ) != RemoteNotificationType.None )
				Debug.Log( "registered for sounds" );
				
			if( ( types & RemoteNotificationType.Badge ) != RemoteNotificationType.None )
				Debug.Log( "registered for badges" );
		}
		
		
		// Second row
		yPos = 5.0f;
		xPos = Screen.width - width - 5.0f;
		
		if( GUI.Button( new Rect( xPos, yPos, width, height ), "Set Urban Airship Credentials" ) )
		{
			EtceteraBinding.setUrbanAirshipCredentials( "ENTER_HERE", "ENTER_HERE" );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Load Photo Texture" ) )
		{
			if( imagePath == null )
			{
				EtceteraBinding.showAlertWithTitleMessageAndButton( "Load Photo Texture Error", "You have to choose a photo before loading", "OK" );
				return;
			}
			
			// No need to resize because we asked for an image scaled from the picker
			// Resize the image so that we dont end up trying to load a gigantic image
			//EtceteraBinding.resizeImageAtPath( imagePath, 256, 256 );
			
			// Add 'file://' to the imagePath so that it is accessible via the WWW class
			StartCoroutine( EtceteraManager.textureFromFileAtPath( "file://" + imagePath, textureLoaded, textureLoadFailed ) );
		}
		

		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Save Photo to Album" ) )
		{
			if( imagePath == null )
			{
				EtceteraBinding.showAlertWithTitleMessageAndButton( "Load Photo Texture Error", "You have to choose a photo before loading", "OK" );
				return;
			}

			EtceteraBinding.saveImageToPhotoAlbum( imagePath );
		}

		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Landscape iPhoneKeyboard" ) )
		{
			iPhoneKeyboard.autorotateToLandscapeLeft = true;
			iPhoneKeyboard.autorotateToLandscapeRight = true;
			iPhoneKeyboard.autorotateToPortrait = false;
			iPhoneKeyboard.autorotateToPortraitUpsideDown = false;
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Portrait iPhoneKeyboard" ) )
		{
			iPhoneKeyboard.autorotateToLandscapeLeft = false;
			iPhoneKeyboard.autorotateToLandscapeRight = false;
			iPhoneKeyboard.autorotateToPortrait = true;
			iPhoneKeyboard.autorotateToPortraitUpsideDown = true;
		}


		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Get Image Size" ) )
		{
			if( imagePath == null )
			{
				EtceteraBinding.showAlertWithTitleMessageAndButton( "Error Getting Image Size", "You have to choose a photo before checking it's size", "OK" );
				return;
			}

			var size = EtceteraBinding.getImageSize( imagePath );
			Debug.Log( "image size: " + size );
		}

		
		
		// Next scene button
		if( GUI.Button( new Rect( Screen.width - 100, Screen.height - 50, 95, 45 ), "Next" ) )
		{
			Application.LoadLevel( "EtceteraTestSceneThree" );
		}
	}
	
	
	void imagePickerChoseImage( string imagePath )
	{
		this.imagePath = imagePath;
	}
	
	
	public IEnumerator hideActivityView()
	{
		yield return new WaitForSeconds( 2.0f );
		EtceteraBinding.hideActivityView();
	}
	
	
	// Texture loading delegates
	public void textureLoaded( Texture2D texture )
	{
		testPlane.renderer.material.mainTexture = texture;
	}
	
	
	public void textureLoadFailed( string error )
	{
		EtceteraBinding.showAlertWithTitleMessageAndButton( "Error Loading Texture.  Did you choose a photo first?", error, "OK" );
		Debug.Log( "textureLoadFailed: " + error );
	}

}
