import { Navigate, Outlet } from "react-router-dom";
import AdminNavBar from "../Components/AdminNavBar";


function Admin() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || user?.role !== "admin") {
    return <Navigate to="/tour/signin" />;
  }

  return (
    <div>
      <AdminNavBar />

      <div className="pt-20 px-4 sm:px-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
