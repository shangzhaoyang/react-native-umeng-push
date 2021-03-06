'use strict';

import React, {
  NativeModules,
  DeviceEventEmitter, //android
  NativeAppEventEmitter, //ios
  Platform,
  AppState,
} from 'react-native';

const UmengPushModule = NativeModules.UmengPush;

var receiveMessageSubscript, openMessageSubscription;

var UmengPush = {

  setAppkeyAndSecret(key:String,secret:String) {
    UmengPushModule.setAppkeyAndSecret(key,secret);
  },
  addAlias(alias:String,type:String) {
    UmengPushModule.addAlias(alias,type);
  },
  setAlias(alias:String,type:String) {
    UmengPushModule.setAlias(alias,type);
  },

  removeAlias(alias:String,type:String) {
    UmengPushModule.removeAlias(alias,type);
  },
  
  getDeviceToken(handler: Function) {
    UmengPushModule.getDeviceToken(handler);
  },

  didReceiveMessage(handler: Function) {
    receiveMessageSubscript = this.addEventListener(UmengPushModule.DidReceiveMessage, message => {
      //处于后台时，拦截收到的消息
      if(AppState.currentState === 'background') {
        return;
      }
      handler(message);
    });
  },

  didOpenMessage(handler: Function) {
    openMessageSubscription = this.addEventListener(UmengPushModule.DidOpenMessage, handler);
  },

  addEventListener(eventName: string, handler: Function) {
    if(Platform.OS === 'android') {
      return DeviceEventEmitter.addListener(eventName, (event) => {
        handler(event);
      });
    }
    else {
      return NativeAppEventEmitter.addListener(
        eventName, (userInfo) => {
          handler(userInfo);
        });
    }
  },
};

module.exports = UmengPush;
