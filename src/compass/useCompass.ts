import { useEffect, useState, useCallback, useMemo } from "react";
import initFirebase from "../firebase";
import { set, ref, child, get, getDatabase } from "firebase/database";


export type CompassScale = "1" | "2" | "3" | "4" | "5";
export type Compass = {
  title: string;
  presence: CompassScale;
  home: CompassScale;
  compensation: CompassScale;
  meetings: CompassScale;
  communication: CompassScale;
  governance: CompassScale;
}

export const vanillaCompass: Compass = {
  title: "",
  presence: "1",
  home: "1",
  compensation: "1",
  meetings: "1",
  communication: "1",
  governance: "1",
};

const useCompass = (userId: string) => {

  const app = useMemo(() => initFirebase(), []);
  const db = useMemo(() => getDatabase(app), [app]);

  const [compass, setCompass] = useState<Compass | null>(null);
  const writeData = useCallback(
    (value: Compass) => {
      if (!userId) return;
      set(ref(db, `compass/${userId}`), {
        compass: value,
      });
    },
    [db, userId]
  );

  useEffect(() => {
    if (!userId) return;
    const dbRef = ref(db);
    get(child(dbRef, `compass/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists() && snapshot.val() && snapshot.val().compass) {
          setCompass(snapshot.val().compass);
        } else {
          setCompass(vanillaCompass);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [db, userId]);

  const onChangeCompass = useCallback(
    (compass: Compass) => {
      if (!userId) return;
      setCompass(compass);
      writeData(compass);
    },
    [setCompass, writeData, userId]
  );

  return { compass, onChangeCompass };
};

export { useCompass };
