import Login from "./pages/login";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./routes/publicRoute";
import PrivateRoute from "./routes/privateRoute";
import Signup from "./pages/signup";
import OtpVerify from "./pages/otp";
import ForgotPassword from "./pages/forgetPassword";
import ChangePassword from "./pages/changePassword";
import Profile from "./pages/profile";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp-verification" element={<OtpVerify />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>

      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
