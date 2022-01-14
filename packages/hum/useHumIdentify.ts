import { humWindow } from './humWindow';
import { useState, useEffect } from 'react';

type AbstractUser = {
  email: string | undefined;
} | undefined

type DispatchUserEvent = (
  arg: {
    type: string,
    tracker: string
  }
) => void;

type IsUserIdentifiedByTracker = (tracker: 'hum') => boolean;

export const useHumIdentify = (
  user: AbstractUser,
  dispatch: DispatchUserEvent,
  isUserIdentifiedByTracker?: IsUserIdentifiedByTracker
) => {
  const [trackerLoaded, setTrackerLoaded] = useState(false);

  const trackerLoadedReducer: () => (() => void) | void = () => {
    if (!user || trackerLoaded) return;

    if (humWindow?.humTracker?.identify) {
      setTrackerLoaded(true);

      return;
    }

    const checkerTimeout = setTimeout(trackerLoadedReducer, 1500);

    return () => clearTimeout(checkerTimeout);
  };

  const userIdentifiedByHum = isUserIdentifiedByTracker && !isUserIdentifiedByTracker('hum');

  useEffect(trackerLoadedReducer, [trackerLoadedReducer, trackerLoaded]);

  useEffect(() => {
    if (
      user?.email &&
      !userIdentifiedByHum &&
      trackerLoaded &&
      humWindow?.humTracker?.identify
    ) {
      humWindow.humTracker.identify(user.email);

      dispatch({
        type: 'UserIdentifiedByTracker',
        tracker: 'hum',
      });
    }
  }, [
    user,
    dispatch,
    trackerLoaded,
    userIdentifiedByHum,
  ]);
};
