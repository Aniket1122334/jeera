import { useSelector } from "react-redux";

import AdminDashboard from "../../components/Dashboard/AdminDashboard";
import OwnerDashboard from "../../components/Dashboard/OwnerDashboard";
import { TasksPage } from "../WorkspacePages";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user.data);

  return (
    <>
      {user?.role === "owner" ? (
        <OwnerDashboard user={user} />
      ) : user?.role === "admin" ? (
        <AdminDashboard user={user} />
      ) : user?.role === "employee" ? (
        <TasksPage />
      ) : null}
    </>
  );
};

export default Dashboard;
