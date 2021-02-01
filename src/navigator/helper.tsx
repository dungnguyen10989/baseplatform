import React from 'react';
import {
  NavigationProp,
  NavigationAction,
  NavigationState,
  EventListenerCallback,
  EventMapCore,
  PartialState,
  NavigationContainerRef,
} from '@react-navigation/native';
import { ConsoleUtils } from '@utils/log';
import { ROUTES } from './routes';

type NavProps = NavigationProp<any>;
type NavState = NavigationState<any>;
type EventName = Extract<keyof EventMapCore<any>, string>;

export const containerNav = React.createRef<NavigationContainerRef>();

const log = (title: string, message?: any) => {
  ConsoleUtils.l(`[NAV] ${title}`, message);
};

export class NavManager {
  static push = (nav: NavProps, route: keyof typeof ROUTES, params?: any) => {
    try {
      nav.navigate(route, params);
      log(
        `push to "${route}" ${params ? 'with params: ' : 'without params'}`,
        params,
      );
    } catch (error) {
      log(`Route ${route} does not compatible with current navigator`);
    }
  };

  static canGoBack = (nav: NavProps) => nav.canGoBack();

  static dangerouslyGetParent = (nav: NavProps) => {
    const value = nav.dangerouslyGetParent();
    log('[dangerouslyGetParent]', value);
    return value;
  };

  static dangerouslyGetState = (nav: NavProps) => nav.dangerouslyGetState();

  static dispatch = (
    nav: NavProps,
    action: NavigationAction | ((state: NavState) => NavigationAction),
  ) => nav.dispatch(action);

  static goBack = (nav: NavProps) => {
    const _canGoBack = NavManager.canGoBack(nav);
    if (_canGoBack) {
      nav.goBack();
      return true;
    }
    ConsoleUtils.w('[NAV] cannot goBack from this navigation', nav);
  };

  static isFocused = (nav: NavProps) => nav.isFocused();

  static addListener = (
    nav: NavProps,
    type: EventName,
    callback: EventListenerCallback<EventMapCore<any>, EventName>,
  ) => {
    nav.addListener(type, callback);
  };

  static removeListener = (
    nav: NavProps,
    type: EventName,
    callback: EventListenerCallback<EventMapCore<any>, EventName>,
  ) => {
    nav.removeListener(type, callback);
  };

  static reset = (nav: NavProps, state: PartialState<NavState> | NavState) => {
    nav.reset(state);
  };

  static setOptions = (nav: NavProps, options: Partial<any>) => {
    nav.setOptions(options);
  };

  static setParams = (nav: NavProps, params: any) => {
    nav.setParams(params);
  };
}
