import React, { useEffect } from "react";
import router from "next/router";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import initFirebase from "../firebase";

const withAuth = (
  Component: React.ComponentType<any>
): React.FunctionComponent => {
  const app = initFirebase();
  const auth = getAuth(app);

  const AuthHOC = (props: any) => {
    useEffect(() => {
      auth.onAuthStateChanged((authUser) => {
        if (!authUser) {
          router.push("/signin");
        }
      });
    }, []);

    return <Component {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
