import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../utils/redux/slices/userSlice";
import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "sonner";
import Loader from "./Loader";
import useSocket from "../hooks/useSocket";

const ProtectedRoutes = () => {
  const { user, loading, error } = useSelector((store) => store.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !user && error) {
      toast.error(error);
    }
  }, [loading, user, error]);

  useSocket(user?.data?._id);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
