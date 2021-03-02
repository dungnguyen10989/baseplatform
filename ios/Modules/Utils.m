//
//  Utils.m
//
//  Created by dungnguyen on 8/29/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SVProgressHUD.h"
#import "Utils.h"

@implementation Utils
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(showOverlay)
{
  [SVProgressHUD setBackgroundColor:UIColor.clearColor];
  [SVProgressHUD setRingThickness:3];
  [SVProgressHUD setForegroundColor:UIColor.whiteColor];
  [SVProgressHUD setDefaultMaskType:SVProgressHUDMaskTypeBlack];
  [SVProgressHUD show];
}


RCT_EXPORT_METHOD(showProgress: (float)progress)
{
  [SVProgressHUD setBackgroundColor:UIColor.clearColor];
  [SVProgressHUD setRingThickness:3];
  [SVProgressHUD setForegroundColor:UIColor.whiteColor];
  [SVProgressHUD setDefaultMaskType:SVProgressHUDMaskTypeBlack];
  if(progress <= 1) {
    [SVProgressHUD showProgress:progress];
  }
  if(progress == 1) {
    dispatch_time_t delay = dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 0.5);
    dispatch_after(delay, dispatch_get_main_queue(), ^(void){
      [SVProgressHUD dismiss];
    });
  }
}

RCT_EXPORT_METHOD(dismissOverlay)
{
  [SVProgressHUD dismiss];
}

@end
