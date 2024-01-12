import mixpanel from "mixpanel-browser";
import dotenv from "dotenv";
import { User } from "./models";
import { Logger } from "./logger";
dotenv.config();

export enum TimeoutLength {
  SHORT = 100,
  MEDIUM = 5000,
  LONG = 10000,
}

export interface Dict {
  [key: string]: any;
}
export const initEventTracker = () => {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_API_KEY ?? "");
};

export const setUserEventTracker = (user?: User | null) => {
  try {
    mixpanel.identify(user?.id);
  } catch (error: any) {
    Logger.error("Error setting user for event tracker", {
      data: {
        user,
      },
      error,
    });
  }
};

const timeoutEvent = (eventName: string, timeout: TimeoutLength) => {
  const lastEvent = localStorage.getItem(eventName);
  const now = new Date().getTime();
  if (lastEvent && now - parseInt(lastEvent) < timeout) {
    return true;
  }
  localStorage.setItem(eventName, now.toString());
  return false;
};

export class EventTracker {
  /**
   *  Track event with props
   * @param eventName is the name of the event
   * @param props is the object with the properties
   * @param timeout how long to wait before sending the same event again
   */
  static track(eventName: string, props?: Dict, timeout?: TimeoutLength) {
    if (timeout && timeoutEvent(eventName, timeout)) {
      return;
    }
    if (process.env.NODE_ENV !== "production") {
      console.log("Tracking event", eventName, props ?? "");
      return;
    }
    mixpanel.track(eventName, props);
  }
}
