using UnityEngine;
using System.Collections;
using System.Collections.Generic;


public class EtceteraGUIManager : MonoBehaviour
{
	void Start()
	{
		// example of setting the popover rect (only used on the iPad when showing the photo picker)
		EtceteraBinding.setPopoverPoint( 500, 200 );
	}
	
	
	void Update()
	{
		Screen.orientation = ( ScreenOrientation )Input.deviceOrientation;
	}
	

	void OnGUI()
	{
		float yPos = 5.0f;
		float xPos = 5.0f;
		float width = 200.0f;
		float height = 38.0f;
		float heightPlus = height + 8.0f;
		
		
		if( GUI.Button( new Rect ( xPos, yPos, width, height), "Get Current Language" ) )
		{
			Debug.Log( "current launguage: " + EtceteraBinding.getCurrentLanguage() );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Get Localized String" ) )
		{
			string loc = EtceteraBinding.getLocalizedString( "hello", "hello in English" );
			Debug.Log( "'hello' localized: " + loc );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Alert with one Button" ) )
		{
			EtceteraBinding.showAlertWithTitleMessageAndButton( "This is the title", "You should really read this before pressing OK", "OK" );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Alert with two Buttons" ) )
		{
			EtceteraBinding.showAlertWithTitleMessageAndButtons( "This is another title", "You should really read this before pressing a button", "OK", "Cancel" );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Set Prompt Colors" ) )
		{
			EtceteraBinding.setPromptColors( 0xFFFFFFFF, 0xFF9900FF, 0xFF990044 );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Show Prompt with 1 Field" ) )
		{
			EtceteraBinding.showPromptWithOneField( "Enter your name", "This is the name of the main character", "name", false );
		}
		
		
		// Second row
		yPos = 5.0f;
		xPos = Screen.width - width - 5.0f;
		
		if( GUI.Button( new Rect( xPos, yPos, width, height ), "Show Prompt with 2 Fields" ) )
		{
			EtceteraBinding.showPromptWithTwoFields( "Enter your credentials", "", "username", "password", false );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Open Web Page" ) )
		{
			// you can also use a local file that is in your .app bundle or elsewhere
			/*
			var path = Application.dataPath.Replace( "Data", "" );
			path = System.IO.Path.Combine( path, "file.html" );
			*/
			
			EtceteraBinding.showWebPage( "http://www.prime31.com", true );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Show Mail Composer" ) )
		{
			EtceteraBinding.showMailComposer( "support@somecompany.com", "Tell us what you think", "I <b>really</b> like this game!", true );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Show SMS Composer" ) )
		{
			// Make sure SMS is available before we try to show the composer
			if( EtceteraBinding.isSMSAvailable() )
				EtceteraBinding.showSMSComposer( "some text to prefill the message with" );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Mail Composer with Screenshot" ) )
		{
			// we call this as a coroutine so that it can use a couple frames to hande its business
			StartCoroutine( EtceteraBinding.showMailComposerWithScreenshot( this, "", "Game Screenshot", "I like this game!", false ) );
		}
		
		
		if( GUI.Button( new Rect( xPos, yPos += heightPlus, width, height ), "Take Screen Shot" ) )
		{
			StartCoroutine( EtceteraBinding.takeScreenShot( "someScreenshot.png" ) );
		}
		
		
		// Next scene button
		if( GUI.Button( new Rect( Screen.width - 100, Screen.height - 40, 95, 35 ), "Next Scene" ) )
		{
			Application.LoadLevel( "EtceteraTestSceneTwo" );
		}
	}


}
