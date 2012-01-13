//
//  P31RotatingViewController.m
//  EtceteraTest
//
//  Created by Mike on 10/3/10.
//  Copyright 2010 Prime31 Studios. All rights reserved.
//

#import "P31RotatingViewController.h"


@implementation P31RotatingViewController

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark NSObject

- (void)dealloc
{
    [super dealloc];
}


///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark UIViewController

- (void)loadView
{
	[super loadView];
	
	self.wantsFullScreenLayout = YES;
	self.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
	self.view.autoresizesSubviews = YES;
}


- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return YES;
}


@end
