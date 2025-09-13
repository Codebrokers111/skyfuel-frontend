import { useState, useContext } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const ForgotPassword = (props) => {
  const { host, showAlert, setCookie } = props.prop;
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const context = useContext(userContext);
  const { sendEmail, verifyEmail } = context;
  const navigate = useNavigate();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [otp, setOtp] = useState("");
  const [otptf, setOtptf] = useState("hidden");
  const [btname, setBtname] = useState("Submit");
  const [pass, setPass] = useState(true);
  const [newpass, setNewPass] = useState({ pass: "", npass: "" });
  const [disable, setDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCpassword, setShowCpassword] = useState(false);
  const [reseToken, setResetoken] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    setLoader(true);
    const check = await fetch(`${host}/auth/existuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    if (check.status === 500) {
      showAlert("Some Error Occurred", "danger");
      setLoader(false);
      setDisable(false);
    } else {
      const checkr = await check.json();
      if (checkr.success) {
        const name = checkr.name;
        const id = checkr.id;
        setCookie("uid", id);
        const reply = await sendEmail(name, email);
        // const reply = { success: true, uid: id }; // --- IGNORE ---
        if (reply.success) {
          showAlert("Email Sent Succesfully", "primary");
          setCookie("fpid", reply.uid);
          setOtptf("visible");
          setLoader(false);
          setBtname("Verify OTP");
        } else {
          showAlert(
            "Cannot send Email at this moment, Try again after some time",
            "danger"
          );
          setLoader(false);
          setDisable(false);
        }
      } else {
        showAlert("This Email does NOT Exist in our Records", "danger");
        setLoader("");
        setEmail("");
        setDisable(false);
      }
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpid = Cookies.get("fpid");
    // const otpid = "123456";
    setLoader(true);
    setDisable(true);
    const resp = await verifyEmail(otpid, otp);
    // const resp = { success: otp === "123456" }; // --- IGNORE ---
    if (resp.success) {
      showAlert("OTP verified Successully", "success");
      setResetoken(resp.resetToken);
      setLoader(false);
      setPass(false);
      setDisable(false);
      Cookies.remove("fpid");
    } else {
      showAlert("Invalid OTP, kindly Check", "danger");
      setLoader(false);
      setDisable(false);
    }
  };

  const changePass = async (e) => {
    e.preventDefault();
    if (newpass.pass !== newpass.npass) {
      showAlert("Password and Confirm Password Does not Match", "danger");
      setLoader("");
    } else {
      const uid = Cookies.get("uid");
      setLoader(true);
      setDisable(true);
      const resp = await fetch(`${host}/auth/updatepass`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${reseToken}`,
        },
        body: JSON.stringify({ userId: uid, npass: newpass.pass }),
      });
      if (resp.status === 500) {
        showAlert("Internal Server Error, kindly Try again", "danger");
        setLoader("");
        setPass(true);
        setOtptf("hidden");
        setBtname("submit");
        setOtp("");
        setDisable(false);
        Cookies.remove("uid");
      } else {
        const reply = await resp.json();
        if (reply.success) {
          showAlert("Password Changed Successfully, kindly Login", "success");
          setLoader("");
          setPass(true);
          setOtptf("hidden");
          setBtname("submit");
          setOtp("");
          setDisable(false);
          navigate("/login");
          Cookies.remove("uid");
        } else {
          showAlert("Password was Not Changed, kindly submit again", "danger");
          setLoader("");
          setDisable(false);
        }
      }
    }
  };

  const passChange = (e) => {
    setNewPass({ ...newpass, [e.target.name]: e.target.value });
  };

  const otpChange = (e) => {
    otp.length <= 4 ? setDisable(true) : setDisable(false);
    setOtp(e.target.value);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row items-center justify-center -mt-15 md:gap-x-6">
      <div className="absolute top-32 left-32 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="hidden md:flex flex-1 items-center justify-center relative z-10">
        <img
          src={new URL("../../assets/fp2.png", import.meta.url).href} // replace with your image path
          alt="Forgot Password Illustration"
          className="max-w-full h-auto"
        />
      </div>
      {/* Left side - Form */}
      {pass ? (
        <div className="flex flex-1 items-center justify-start px-3 md:px-6 relative z-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Forgot Password
            </h2>
            <p className="text-gray-600 mb-4">
              Enter your e-mail address, and we’ll sent you an OTP.
            </p>

            <form
              onSubmit={otp == "" ? handleSubmit : verifyOtp}
              className="space-y-4 mb-4"
            >
              <input
                type="email"
                placeholder="Enter e-mail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              {/* OTP field (use your otptf variable to control visibility / custom class) */}
              <div className={`mb-3 mt-2 ${otptf}`}>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                  style={{ fontSize: "14px" }}
                >
                  {`Enter OTP we send to ${email}`}
                </label>
                <input
                  id="otp"
                  type="number"
                  aria-describedby="otpHelp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={otpChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed "
                disabled={disable}
                style={{ cursor: "pointer" }}
              >
                {btname}
                <span className="ms-3">
                  {loader && <Loader color="blue" size="small" />}
                </span>
              </button>
            </form>

            <Link
              className="text-sm text-indigo-600 hover:text-black w-fit cursor-pointer"
              to="/login"
              style={{ textDecoration: "none" }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-1 items-center justify-start px-3 md:px-6 relative z-10${
            isTabletOrMobile ? "w-[350px]" : "w-[500px]"
          }`}
        >
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create Password
            </h2>
            <hr className="mb-6 border-gray-200" />

            <form onSubmit={changePass} className="space-y-4">
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="pass"
                    placeholder="Create Password"
                    value={newpass.pass}
                    onChange={passChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-sm placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>
              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showCpassword ? "text" : "password"}
                    name="npass"
                    placeholder="Confirm Password"
                    value={newpass.npass}
                    onChange={passChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-sm placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCpassword(!showCpassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showCpassword ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex items-center" id="btns">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                  style={{ cursor: "pointer" }}
                  disabled={disable}
                >
                  Change Password
                  <span className="ms-3">
                    {loader && <Loader color="blue" size="small" />}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Right side - Image (hidden on small screens) */}
    </div>
  );
};

export default ForgotPassword;
