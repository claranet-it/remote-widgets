import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from "firebase/auth";

import initFirebase from '../firebase';
import {
    removeUserCookie,
    setUserCookie,
    getUserFromCookie
} from './userCookie';

export const mapUserData = async (user: any) => {
    const { uid, email } = user;
    const token = await user.getIdToken(true);
    return {
        id: uid,
        email,
        token
    };
};

export type UserData = {
    id: string;
    email: string;
    token: string;
}

const useUser = () => {
    const app = initFirebase();
    const auth = getAuth(app);
    const [user, setUser] = useState<UserData | undefined>();
    const router = useRouter();

    const logout = async () => {
        return getAuth(app)
            .signOut()
            .then(() => {
                router.push('/');
            })
            .catch(e => {
                console.error(e);
            });
    };

    useEffect(() => {
        const cancelAuthListener = auth
            .onIdTokenChanged(async userToken => {
                if (userToken) {
                    const userData = await mapUserData(userToken);
                    setUserCookie(userData);
                    setUser(userData);
                } else {
                    removeUserCookie();
                    setUser(undefined);
                }
            });

        const userFromCookie = getUserFromCookie();
        if (!userFromCookie) {
            return;
        }

        setUser(userFromCookie);

        return cancelAuthListener;
    }, [auth]);

    return { user, logout };
};

export { useUser };