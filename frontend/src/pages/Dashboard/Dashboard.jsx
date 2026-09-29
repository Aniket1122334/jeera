// import AdminDashboard from "./AdminDashboard";
// import EmployeeDashboard from "./EmployeeDashboard";

import { useSelector } from "react-redux";
import AdminDashboard from "../../components/Dashboard/AdminDashboard";
import Navbar from "../../components/Dashboard/Navbar";
import OwnerDashboard from "../../components/Dashboard/OwnerDashboard";
import Sidebar from "../../components/Dashboard/Sidebar";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user.data);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {user.role === "owner" ? (
            <OwnerDashboard user={user} />
          ) : user.role === "admin" ? (
            <AdminDashboard />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
