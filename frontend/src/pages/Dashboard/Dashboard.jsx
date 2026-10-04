import { useSelector } from "react-redux";

import AdminDashboard from "../../components/Dashboard/AdminDashboard";
import OwnerDashboard from "../../components/Dashboard/OwnerDashboard";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user.data);

  return (
    <>
      {user?.role === "owner" ? (
        <OwnerDashboard user={user} />
      ) : user?.role === "admin" ? (
        <AdminDashboard user={user} />
      ) : null}
    </>
  );
};

export default Dashboard;
