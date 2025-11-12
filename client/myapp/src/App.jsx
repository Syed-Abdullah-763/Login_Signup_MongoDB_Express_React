import Login from "./pages/login";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./routes/publicRoute";
import PrivateRoute from "./routes/privateRoute";
import Signup from "./pages/signup";
import OtpVerify from "./pages/otp";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route index element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp-verification" element={<OtpVerify />} />
        </Route>
      </Routes>

      <Routes>
        <Route element={<PrivateRoute />}>
          {/* <Route path="/dashboard" element={<Login />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
