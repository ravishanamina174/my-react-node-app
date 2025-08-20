import { Outlet , Navigate} from "react-router";
import { useUser } from "@clerk/clerk-react";

const AdminProtectedLayout = () => {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {
        return null;
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" />;
    }

    const isAdmin = user?.publicMetadata?.role === "admin";
    if (!isAdmin) {
        return <Navigate to="/" />;
    }
 
    return <Outlet />;
           
};

export default AdminProtectedLayout;