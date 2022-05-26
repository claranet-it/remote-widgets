import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import withAuth from "../src/auth/withAuth";
import { useUser } from "../src/auth/useUser";
import CompassForm from "../components/CompassForm";

const Home: NextPage = () => {
  const { user, logout } = useUser();

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div>
        <div>Email: {user.email}</div>
        <button onClick={logout}>Logout</button>
      </div>
      <CompassForm user={user} />
    </div>
  );
};

export default withAuth(Home);
