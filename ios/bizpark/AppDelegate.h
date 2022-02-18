#import <UserNotifications/UNUserNotificationCenter.h>
#import <Foundation/Foundation.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

#import <Expo/Expo.h>

// @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@interface AppDelegate : EXAppDelegateWrapper <RCTBridgeDelegate, UIApplicationDelegate, UNUserNotificationCenterDelegate>

@end
