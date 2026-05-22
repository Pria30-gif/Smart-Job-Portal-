import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< HEAD
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "Recruiter" && user.role !== "Admin") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  if (!user || (user.role !== "Recruiter" && user.role !== "Admin")) {
    return null;
  }

  return <>{children}</>;
=======
    if (!user || user.role !== "Recruiter") {
      navigate("/");  
    }
  }, [user, navigate]);   
 
  if (!user || user.role !== "Recruiter") {
    return null;   
  }

  return <>{children}</>;   
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
};

export default ProtectedRoute;