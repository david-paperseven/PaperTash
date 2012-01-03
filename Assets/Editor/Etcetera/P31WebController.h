//
//  P31WebController.h
//  EtceteraTest
//
//  Created by Mike on 10/2/10.
//  Copyright 2010 Prime31 Studios. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface P31WebController : UIViewController
{
	UIWebView *_webView;
	NSString *_url;
}
@property (nonatomic, retain) UIWebView *webView;
@property (nonatomic, retain) NSString *url;


- (id)initWithUrl:(NSString*)url;

@end
