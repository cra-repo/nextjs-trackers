import { FC } from 'react';
import Script, { ScriptProps } from 'next/script';
import { humWindow } from './humWindow';

export type HumTrackerOptions = Record<'apiKey' | 'contentSource' | 'apiUrl' | 'cookieDomain',
  string> & { useIframeStorage?: true };

/*
<script>
  window.humTracker = window.humTracker || {};
  window.humTracker.options = {
    apiKey: '{ }',
    contentSource: '{ }',
    apiUrl: '{ }',
    cookieDomain: '{ }',
    useIframeStorage: true,
  };
  (function () {
    const _humTracker = humTracker;
    const queue = humTracker.preloadQueue = [];
    window.humTracker = new Proxy(_humTracker, {
      get(target, key) {
        if (key in target) return target[key];
        return (...args) => queue.push({ method: key, args });
      },
    });
    humTracker.onLoad = () => window.humTracker = _humTracker;
    const script = document.createElement('script');
    script.src = '{ }';
    document.head.appendChild(script);
  }());
</script>
 */

const Hum: FC<HumTrackerOptions & { scriptSrc: string | undefined; strategy: ScriptProps['strategy'] }> = ({
  children,
  scriptSrc: src,
  strategy = 'afterInteractive',
  ...trackerOptions
}) => {
  if (!humWindow || !src) return null;

  /* eslint-disable no-underscore-dangle,@typescript-eslint/ban-ts-comment */
  humWindow.humTracker ||= {};
  humWindow.humTracker.options = trackerOptions;
  // @ts-ignore
  const _humTracker = humTracker;
  const queue: Array<{ method: string | symbol; args: Array<unknown> }> =
    // @ts-ignore
    (humTracker.preloadQueue = []);

  humWindow.humTracker = new Proxy(_humTracker, {
    get(target, key) {
      if (key in target) return target[key];

      return (...args: Array<unknown>) => queue.push({ method: key, args });
    },
  });

  // @ts-ignore
  humTracker.onLoad = () => (humWindow.humTracker = _humTracker);
  /* eslint-enable no-underscore-dangle,@typescript-eslint/ban-ts-comment */

  return <Script async id="HUM_Script" src={src} strategy={strategy} />;
};

export default Hum;
