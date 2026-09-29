import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../utils/redux/slices/userSlice";
import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "sonner";
import Loader from "./Loader";

const ProtectedRoutes = () => {
  const { user, loading, error } = useSelector((store) => store.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    toast.error(error);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
