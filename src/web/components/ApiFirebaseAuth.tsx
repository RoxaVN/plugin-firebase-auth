import { Box, LoadingOverlay } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/base';
import { apiFetcher, authService, uiManager } from '@roxavn/core/web';
import firebase from 'firebase/compat/app';
import { Fragment, useEffect, useState } from 'react';
import { identityApi } from '../../base/index.js';
import { FirebaseAuth, FirebaseAuthProps } from './FirebaseAuth.js';

export interface ApiFirebaseAuthProps {
  firebaseConfig: {
    appId: string;
    apiKey: string;
    authDomain: string;
    projectId: string;
  };
  uiConfig: FirebaseAuthProps['uiConfig'];
  stylesheetUrl?: string;
  onSuccess?: (
    data: InferApiResponse<typeof identityApi.authAndRegister>
  ) => void;
}

export const ApiFirebaseAuth = ({
  firebaseConfig,
  uiConfig,
  stylesheetUrl,
  onSuccess,
}: ApiFirebaseAuthProps) => {
  const [app, setApp] = useState<firebase.auth.Auth>();
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function auth(tokenData?: string) {
    if (tokenData) {
      try {
        setLoading(true);
        const data = await apiFetcher.fetch(identityApi.authAndRegister, {
          projectId: firebaseConfig.projectId,
          token: tokenData,
        });
        await authService.authenticate(data);
        app?.signOut();
        onSuccess && onSuccess(data);
      } catch (e: any) {
        uiManager.errorModal(e);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    // Initialize Firebase
    const authApp = firebase.auth(firebase.initializeApp(firebaseConfig));
    authApp.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
      }
    });
    setApp(authApp);
  }, []);

  useEffect(() => {
    auth(token);
  }, [token]);

  return app ? (
    <Box sx={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <FirebaseAuth
        uiConfig={{
          ...uiConfig,
          callbacks: {
            signInSuccessWithAuthResult: function () {
              return false;
            },
          },
        }}
        stylesheetUrl={stylesheetUrl}
        firebaseAuth={app}
      />
    </Box>
  ) : (
    <Fragment />
  );
};
