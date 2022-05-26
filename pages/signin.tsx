
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import initFirebase from '../src/firebase';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from "react";

import { setUserCookie, getUserFromCookie } from '../src/auth/userCookie';
import { mapUserData } from '../src/auth/useUser';


const app = initFirebase();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const FirebaseAuth = () => {
  const router = useRouter();

  useEffect(() => {
    if(getUserFromCookie()){
      router.push('/');
    }
  }, [router]);


  const login = useCallback(async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userData = await mapUserData(user);
    setUserCookie(userData);

    router.push('/');
  }, [router]);
  return (
    <div>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default FirebaseAuth;