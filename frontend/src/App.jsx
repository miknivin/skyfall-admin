import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "./redux/api/userApi"; // Use userApi as provided
import { Toaster } from "react-hot-toast";
import { FullScreenLoader } from "./utils/Loader";

function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const { isLoading } = useGetMeQuery();

  // Prevent redirect during loading
  if (isLoading) return <FullScreenLoader/>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/sign-in" replace />;
}

function App() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const { isLoading, error } = useGetMeQuery();


 // Show loading state while verifying authentication
 if (isLoading) return <FullScreenLoader/>;
  return (
    <>
    <Toaster/>
        <Routes>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Route>
            <Route path="/auth/*" element={<Auth />} />
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard/home" : "/auth/sign-in"}
                  replace
                />
              }
            />
            </Routes>
    </>

  );
}

export default App;