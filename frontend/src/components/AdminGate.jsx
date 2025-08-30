import Spinner from "./Spinner";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../utils/useAdmin";

export default function AdminGate({ children }){
  const { user, isAdmin, loading } = useAdmin();
  if (loading) return <div className="min-h-screen grid place-items-center"><Spinner /></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="card p-6 max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Accesso negato</h1>
          <p className="text-sm text-gray-600">Questo account non ha privilegi amministratore.</p>
        </div>
      </div>
    );
  }
  return children;
}

