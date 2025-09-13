import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { userContext } from "../../context/userContext";
import Loader from "../../components/Loader";

import ReCAPTCHA from "react-google-recaptcha";

const Signup = (props) => {
  const { host, showAlert, Logdout, c_sitekey } = props.prop;
  const [showPassword, setShowPassword] = useState(false);
  const [showCpassword, setShowCpassword] = useState(false);
  const [cred, setCred] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();
  const context = useContext(userContext);
  const { getUser, sendEmail, verifyEmail, verifyCaptcha } = context;
  const [loader, setLoader] = useState(false);
  const [mloader, setMloader] = useState(false);
  const [rsloader, setRsloader] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [disable, setDisable] = useState(false);
  const captchaRef = useRef(null);
  const otpModal = useRef(null);
  const modalClose = useRef(null);
  const [otp, setOtp] = useState("");
  const [rotp, setRotp] = useState({ msg: "", bg: "" });
  const [valid, setValid] = useState("invisible");
  const [cdown, setCdown] = useState(60);
  const [rsbtn, setRsbtn] = useState(false);
  const [loading, setLoading] = useState(true);
  const google_signup = import.meta.env.VITE_GOOGLE_USER;

  useEffect(() => {
    document.title = "Signup | skyfuel";
    if (localStorage.getItem("token")) {
      navigate("/");
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const googleSignup = async (gtoken) => {
    const response = await fetch(`${google_signup}?access_token=${gtoken}`, {
      headers: {
        Authorization: `Bearer ${gtoken}`,
        Accept: "application/json",
      },
    });
    const data = await response.json();
    handleSubmit(data.name, data.email, data.id, data.id);
  };

  const signup = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleSignup(codeResponse.access_token);
    },
    onError: (error) =>
      showAlert(`${error} - Kindly Signup Manually`, "danger"),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center my-2">
        <Loader color="gray" size="large" />
      </div>
    );
  }

  const verifyUser = async (e) => {
    e.preventDefault();
    setLoader(true);
    setDisable(true);
    const { name, email, password, cpassword } = cred;
    try {
      if (password !== cpassword) {
        showAlert("Password and Confirm password does not match", "danger");
        setLoader(false);
        setDisable(false);
      } else {
        const token = captchaRef.current.getValue();
        const reply = await verifyCaptcha(token);
        // const reply = { stat: true };
        if (reply.stat) {
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
          } else {
            const checkr = await check.json();
            if (checkr.success) {
              showAlert("Email Already exist kindly Login", "primary");
              setLoader(false);
              setDisable(false);
            } else {
              const reply = await sendEmail(name, email, "signup");
              // const reply = { success: true, uid: "000" };
              if (reply.success) {
                localStorage.setItem("otpID", reply.uid);
                console.log("clicking modal");
                otpModal.current.click();
                setLoader(false);
                console.log("modal clicked");
                let timeLeft = 60; // 60 seconds
                const countdown = setInterval(() => {
                  timeLeft--;
                  setCdown(timeLeft);
                  if (timeLeft <= 0) {
                    clearInterval(countdown);
                    setRsbtn(true);
                  }
                }, 1000); // 1000 milliseconds = 1 second
              } else {
                showAlert("Error Sending OTP, Try after some time", "danger");
                setLoader(false);
                setDisable(false);
              }
            }
          }
        } else {
          showAlert(reply.msg, "danger");
        }
      }
      captchaRef.current.reset();
      setCaptcha(false);
      setLoader(false);
    } catch (error) {
      showAlert("some error has occurred", "danger");
      setLoader(false);
      setDisable(false);
    }
  };

  const onChangeModal = (e) => {
    setOtp(e.target.value);
  };

  const displayrotpmess = (message, bg) => {
    setRotp({ msg: message, bg: bg });
    setTimeout(() => {
      setRotp({ msg: "", bg: "" });
    }, 1000);
  };
  const otpResend = async () => {
    const { name, email } = cred;
    setCdown(60);
    setRsloader(true);
    const reply = await sendEmail(name, email);
    // const reply = { success: true, uid: "000" };
    if (reply.success) {
      displayrotpmess("OTP resend successfully", "green");
      localStorage.setItem("otpID", reply.uid);
      setRsbtn(false);
      let timeLeft = 60; // 60 seconds
      const countdown = setInterval(() => {
        timeLeft--;
        setCdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(countdown);
          setRsbtn(true);
          setRsloader(false);
        }
      }, 1000); // 1000 milliseconds = 1 second
    } else {
      displayrotpmess("Error sending OTP, please try after sometime", "red");
      setRsloader(false);
    }
  };

  const handleVer = async () => {
    const uid = localStorage.getItem("otpID");
    setMloader(true);
    const resp = await verifyEmail(uid, otp);
    if (resp.success) {
      modalClose.current.click();
      showAlert("OTP verified Successully", "primary");
      handleSubmit(cred.name, cred.email, cred.password, cred.cpassword);
      setMloader(false);
    } else {
      setValid("visible");
      setTimeout(() => {
        setValid("invisible");
      }, "2000");
      setMloader(false);
    }
  };

  const handleSubmit = async (name, email, password, cpassword) => {
    setLoader(true);
    try {
      const response = await fetch(`${host}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });
      if (response.status === 500) {
        showAlert("Internal Server Error Occurred", "danger");
        setLoader(false);
        setDisable(false);
        setCred({ name: "", email: "", password: "", cpassword: "" });
      } else {
        const json = await response.json();
        if (json.success) {
          //save the token and redirect
          setLoader(false);
          setDisable(false);
          localStorage.setItem("token", json.access);
          navigate("/");
          showAlert("Account Created Successfully", "success");
          getUser();
          Logdout();
        } else {
          showAlert("Account Already Exist, Kindly Sign In", "danger");
          setLoader(false);
          setCred({ name: "", email: "", password: "", cpassword: "" });
        }
      }
    } catch (error) {
      showAlert("We are sorry from our end some error occurred", "danger");
    } finally {
      setLoader(false);
      setDisable(false);
    }
  };

  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const captchaChange = () => {
    setCaptcha(true);
  };
  return (
    <div id="signup" className="mb-1">
      <div className="flex flex-col lg:flex-row items-stretch shadow-lg">
        {/* Left / Form side */}
        <div className="w-full lg:w-1/2 flex items-center bg-white">
          <div className="container p-4 w-full">
            <div className="w-full p-6 md:p-10">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
                <p className="text-gray-500">Create Your skyfuel Account</p>
              </div>

              <form onSubmit={verifyUser}>
                {/* Full Name */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold mb-1"
                  >
                    Full Name
                  </label>
                  <div className="flex items-center bg-gray-100 rounded-md border border-gray-200 overflow-hidden">
                    <span className="px-3 text-gray-500">
                      <i className="fa-solid fa-user"></i>
                    </span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={cred.name}
                      onChange={onChange}
                      className="flex-1 p-2 bg-gray-100 text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-1"
                  >
                    Email Address
                  </label>
                  <div className="flex items-center bg-gray-100 rounded-md border border-gray-200 overflow-hidden">
                    <span className="px-3 text-gray-500">
                      <i className="fa-solid fa-envelope"></i>
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={cred.email}
                      onChange={onChange}
                      className="flex-1 p-2 bg-gray-100 text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-1"
                  >
                    Password
                  </label>
                  <div className="flex items-center bg-gray-100 rounded-md border border-gray-200 overflow-hidden">
                    <span className="px-3 text-gray-500">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={cred.password}
                      onChange={onChange}
                      className="flex-1 p-2 bg-gray-100 text-gray-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      className="px-3 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
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
                <div className="mb-4">
                  <label
                    htmlFor="cpassword"
                    className="block text-sm font-semibold mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="flex items-center bg-gray-100 rounded-md border border-gray-200 overflow-hidden">
                    <span className="px-3 text-gray-500">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                      id="cpassword"
                      name="cpassword"
                      type={showCpassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={cred.cpassword}
                      onChange={onChange}
                      className="flex-1 p-2 bg-gray-100 text-gray-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      className="px-3 text-gray-500"
                      onClick={() => setShowCpassword(!showCpassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showCpassword ? (
                        <i className="fa-solid fa-eye-slash"></i>
                      ) : (
                        <i className="fa-solid fa-eye"></i>
                      )}
                    </button>
                  </div>
                </div>

                {/* ReCAPTCHA */}
                <div className="flex justify-center items-center my-4">
                  <div>
                    <ReCAPTCHA
                      sitekey={c_sitekey}
                      ref={captchaRef}
                      onChange={captchaChange}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-2 mb-4 flex items-center justify-center bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-60"
                  disabled={
                    cred.name === "" ||
                    cred.email === "" ||
                    cred.password === "" ||
                    cred.cpassword === "" ||
                    captcha == false ||
                    disable
                  }
                >
                  Sign Up
                </button>

                {loader && (
                  <div className="flex justify-center my-2">
                    <Loader color="red" />
                  </div>
                )}

                {/* Already have account */}
                <p className="text-center mb-4 text-gray-500 font-semibold">
                  Already have an account?{" "}
                  <Link to={"/login"} className="text-red-600">
                    Sign In
                  </Link>
                </p>
              </form>

              {/* Social Login */}
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <hr className="flex-grow border-gray-300" />
                  <span className="mx-3 text-gray-500 text-sm">
                    Or continue with
                  </span>
                  <hr className="flex-grow border-gray-300" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={signup}
                    className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 rounded-md hover:bg-gray-50"
                  >
                    <img
                      src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                      alt="Google"
                      className="w-5"
                    />
                    Google
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="text-center">
                <small className="text-gray-500">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-red-600">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-red-600">
                    Privacy Policy
                  </Link>
                </small>
              </div>

              {/* Hidden button to trigger Flowbite modal programmatically if needed */}
              <button
                type="button"
                data-modal-target="otpmodal"
                data-modal-toggle="otpmodal"
                className="hidden"
                ref={otpModal}
              >
                Launch otp
              </button>

              {/* Flowbite Modal for OTP */}
              <div
                id="otpmodal"
                tabIndex={-1}
                aria-hidden="true"
                className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                data-modal-backdrop="static"
              >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                  <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Kindly Verify Your Email
                      </h3>
                      <button
                        type="button"
                        class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="otpmodal"
                        ref={modalClose}
                      >
                        <svg
                          class="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span class="sr-only">Close modal</span>
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 md:p-5">
                      <form className="space-y-4" action="#">
                        <div className="mb-3">
                          <label
                            htmlFor="otp"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter OTP
                          </label>
                          <p className="text-gray-500 text-sm mt-1">{`OTP is sent on your ${cred.email} email`}</p>
                          <input
                            id="otp"
                            name="otp"
                            type="number"
                            value={otp}
                            onChange={onChangeModal}
                            placeholder="OTP"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          />
                        </div>
                      </form>

                      <div className="flex gap-2 items-center">
                        <p className={`${valid} text-red-600`}>
                          Invalid OTP, check again
                        </p>
                        {rotp.msg && (
                          <p style={{ color: rotp.bg }} className="ml-auto">
                            {rotp.msg}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end p-4 space-x-2 border-t rounded-b">
                      {rsbtn ? (
                        <button
                          onClick={otpResend}
                          disabled={rsloader}
                          className="text-sm px-3 py-1 border border-green-600 text-green-600 rounded hover:bg-green-50"
                        >
                          Resend OTP
                          {rsloader && (
                            <span className="ml-2 inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>
                          )}
                        </button>
                      ) : (
                        <p className="me-2 text-sm">{`Resend OTP in ${cdown}`}</p>
                      )}

                      <button
                        type="button"
                        onClick={handleVer}
                        disabled={mloader || otp === ""}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                      >
                        Verify
                        {mloader && <Loader size="small" color="red" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* end modal */}
            </div>
          </div>
        </div>

        {/* Right / Info side */}
        <div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-orange-400 to-red-500 text-white relative overflow-hidden"
          style={{ minHeight: 420 }}
        >
          <div className="absolute top-1/6 left-0 right-0 px-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to skyfuel</h1>
              <p className="mb-4">
                Pegion Supplements - Your trusted partner in high-quality
                supplements. Elevate your Pigeon health and wellness journey
                with our premium products designed to support your active
                lifestyle.
              </p>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4">Why skyfuel?</h2>
              <p>
                At skyfuel, we are committed to providing top-notch supplements
                that cater to the unique needs of Pigeons. Our products are
                formulated with care and precision to ensure optimal health and
                performance.
              </p>
            </div>

            <div className="flex gap-4 mb-4 justify-center flex-wrap">
              <div className="flex items-center gap-2">
                <i className="fas fa-info fa-lg"></i>
                <span>Informative Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-dove fa-lg"></i>
                <span>Health Commitments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
