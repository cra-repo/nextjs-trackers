import { HumTrackerOptions } from './HumScript';

type HumWindow = {
  humTracker?: {
    identify?: (email: string) => void;
    options?: HumTrackerOptions;
  };
};

export const humWindow = (
  typeof window !== 'undefined' ? window : null
) as HumWindow;
