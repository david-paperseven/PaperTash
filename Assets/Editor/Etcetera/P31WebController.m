    //
//  P31WebController.m
//  EtceteraTest
//
//  Created by Mike on 10/2/10.
//  Copyright 2010 Prime31 Studios. All rights reserved.
//

#import "P31WebController.h"
#import "EtceteraManager.h"


@implementation P31WebController

@synthesize webView = _webView, url = _url;

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark NSObject

- (id)initWithUrl:(NSString*)url
{
	if( ( self = [super initWithNibName:nil bundle:nil] ) )
	{
		self.url = url;
	}
	return self;
}


- (void)dealloc
{
	[_webView stopLoading];
	[_webView release];
	[_url release];
	
	[super dealloc];
}


///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark UIViewController

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation
{
	return YES;
}


- (void)loadView
{
	[super loadView];
	
	// add a done button
	self.navigationItem.rightBarButtonItem = [[[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone
																							target:self
																							action:@selector(onTouchDone)] autorelease];
	
	// create the UIWebView and show the url
	CGRect frame = [UIApplication sharedApplication].keyWindow.bounds;
	_webView = [[UIWebView alloc] initWithFrame:frame];
	_webView.autoresizingMask = UIViewAutoresizingFlexibleWidth	| UIViewAutoresizingFlexibleHeight;
	_webView.scalesPageToFit = YES;
	[self.view addSubview:_webView];
	
	// the url could be absolute or local so check and load appropriately
	NSURL *url;
	if( ![_url hasPrefix:@"http:"] && [[NSFileManager defaultManager] fileExistsAtPath:_url] )
		url = [NSURL fileURLWithPath:_url];
	else
		url = [NSURL URLWithString:_url];
	
	NSURLRequest *request = [NSURLRequest requestWithURL:url];
	[_webView loadRequest:request];
}


- (void)onTouchDone
{
	// dismiss
	[[EtceteraManager sharedManager] dismissWrappedController];
}

@end
