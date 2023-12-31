# plugin-firebase-auth

### Test page

```tsx
import firebase from 'firebase/compat/app';
import { ApiFirebaseAuth } from '../components';

const Page = () => {
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
  };

  const firebaseConfig = {
    appId: '1:304209937107:web:588fe99e7a472966d70a26',
    apiKey: 'AIzaSyDy3uQOIICz_smoU8RKJE-G0xmSFdgKdD4',
    authDomain: 'roxavn.firebaseapp.com',
    projectId: 'roxavn',
  };

  return (
    <ApiFirebaseAuth uiConfig={uiConfig} firebaseConfig={firebaseConfig} />
  );
};

export default Page;
```

## Release

```
npx standard-version
```
