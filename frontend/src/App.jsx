import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { currentUserThunk } from "./store/reducers/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserThunk()); // This tells the app: "Start checking if we have a user"
  }, [dispatch]);
  
  return (
    <div className="min-h-screen w-full bg-(--color-surface-container-lowest) transition-colors duration-200 max-md:min-h-dvh">
      <AppRoutes />
    </div>
  );
};

export default App;
