import { Snackbar, Button } from '@mui/material';
import React from 'react'
import { useTranslation } from './common/components/LocalizationProvider';

import { useAttributePreference } from './common/util/preferences';

import { useRegisterSW } from 'virtual:pwa-register/react'

// Based on https://vite-pwa-org.netlify.app/frameworks/react.html
function ReloadPrompt() {
  const t = useTranslation();

  // const serviceWorkerUpdateInterval = useAttributePreference('serviceWorkerUpdateInterval', 3600000);
  const serviceWorkerUpdateInterval = 60000;

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('serviceWorkerUpdateCheck', serviceWorkerUpdateInterval);

      serviceWorkerUpdateInterval > 0 && r && setInterval(async () => {
        if (!(!r.installing && navigator)) {
          return;
        }
  
        if (('connection' in navigator) && !navigator.onLine) {
          return;
        }
  
        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            'cache': 'no-store',
            'cache-control': 'no-cache',
          },
        });
  
        if (resp?.status === 200) {
          await r.update();
        }
      }, serviceWorkerUpdateInterval)
    }
  });

  return (
    <Snackbar 
      open={needRefresh} 
      message={t('updateAvailable')}
      action={(
        <Button color="secondary" size="small" onClick={() => updateServiceWorker(true)}>
          {t('sharedReload')}
        </Button>
      )}
      />
  );
}

export default ReloadPrompt;