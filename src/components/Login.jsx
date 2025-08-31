import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./styling/Loginsignup.css";
import { userContext } from "../context/userContext";
import { useGoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";

const Login = (props) => {
    const { host, showAlert, Logdout, c_sitekey } = props.prop;
    const [cred, setCred] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const context = useContext(userContext);
    const { getUser, verifyCaptcha, updateUserId } = context;
    const [gloader, setGLoader] = useState("");
    const captchaRef = useRef(null);
    const [captcha, setCaptcha] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [searchParams, setSearchParams] = useState({ s: "", id: "" });
    const google_login = import.meta.env.VITE_GOOGLE_USER;

    useEffect(() => {
        document.title = "Login | skyfuel";
        if (localStorage.getItem("token")) {
        navigate("/");
        } else {
        setLoading(false);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const s = params.get("s");
        const id = params.get("id");

        if (s || id) {
        setSearchParams({ s: s, id: id });
        }
    }, [location]);

    const googleLogin = async (a_token) => {
        const response = await fetch(`${google_login}?access_token=${a_token}`, {
        headers: {
            Authorization: `Bearer ${a_token}`,
            Accept: "application/json",
        },
        });
        const data = await response.json();
        const email = await data.email;
        setGLoader("spinner-border spinner-border-sm mt-2");
        const result = await fetch(`${host}/auth/glogin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
        });
        if (result.status === 500) {
        showAlert("Internal Server Error Occurred", "danger");
        setGLoader("");
        } else {
        const json = await result.json();
        if (json.success) {
            if (searchParams.s !== "") {
            await updateUserId(searchParams.s, json.userId, searchParams.id);
            }
            //save the token and redirect
            setGLoader("");
            localStorage.setItem("token", json.authToken);
            navigate("/");
            showAlert("Login Sucessfully", "success");
            getUser();
            Logdout();
        } else {
            showAlert(json.errors, "danger");
            setGLoader("");
        }
        }
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
        googleLogin(codeResponse.access_token);
        },
        onError: (error) => showAlert(`${error} Kindly Login Manually`, "danger"),
    });

    if (loading) {
        return (
        <div className="d-flex justify-content-center align-item-center my-2">
            <span className="spinner-border"></span>
        </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        // const tokens = await executeRecaptcha();
        const token = captchaRef.current.getValue();
        if (!token) {
        showAlert("captcha error", "danger");
        setLoader(false);
        return;
        }
        const reply = await verifyCaptcha(token);
        if (!reply) {
        captchaRef.current.reset();
        setCaptcha(false);
        setLoader(false);
        return;
        }
        if (reply.status === 500) {
        showAlert("There is an Error accessing Server", "danger");
        } else {
        if (reply.stat) {
            console.log("Captcha verified successfully inside login");
            const response = await fetch(`${host}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: cred.email,
                password: cred.password,
            }),
            });
            if (response.status === 500) {
            showAlert("Internal Server Error Occurred", "danger");
            setLoader(false);
            } else {
            const json = await response.json();
            console.log(json,'line 138');
            if (json.success) {
                //save the token and redirect
                setLoader(false);
                localStorage.setItem("token", json.access);
                navigate("/");
                showAlert("Login Sucessfully", "success");
                getUser();
                Logdout();
            } else {
                showAlert(json.error, "danger");
                setLoader(false);
            }
            }
        } else {
            showAlert(reply.msg, "danger");
            setLoader(false);
        }
        captchaRef.current.reset();
        setCaptcha(false);
        }
    };

    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value });
    };

    const captchaChange = () => {
        setCaptcha(true);
    };

    return (
        <div id="login">
        <div className="flex flex-col lg:flex-row shadow-lg">
            {/* Left Section (Welcome Back) */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center text-white px-6 bg-[rgba(13,110,253,0.9)]">
                <div className="px-4">
                <h1 className="text-4xl font-bold mb-4">Welcome Back to Skyfuel</h1>
                <p className="text-lg mb-4">
                    Pigeon nutrition, performance, and health.<br/>
                    To keep connected with us please login with your personal info
                </p>
                <div className="flex gap-6 mb-4">
                    <div className="flex items-center gap-2">
                    <i className="fas fa-lock fa-lg"></i>
                    <p>Password Protection</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <i className="fas fa-clock fa-lg"></i>
                    <p>Time to Live</p>
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* Right Section (Login Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
            <div className="w-full p-6 md:p-10">
                {/* Heading */}
                <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Sign In</h2>
                <p className="text-gray-500">Please enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-semibold mb-1">
                    Email Address
                    </label>
                    <div className="flex items-center border rounded-md bg-gray-100">
                    <span className="px-3 text-gray-500">
                        <i className="fa-solid fa-envelope"></i>
                    </span>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="name@example.com"
                        className="flex-1 p-2 bg-gray-100 text-gray-900 focus:outline-none"
                        value={cred.email}
                        onChange={onChange}
                    />
                    </div>
                </div>

                {/* Password Input */}
                <div className="mb-3">
                    <label htmlFor="password" className="block text-sm font-semibold mb-1">
                    Password
                    </label>
                    <div className="flex items-center border rounded-md bg-gray-100">
                    <span className="px-3 text-gray-500">
                        <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        className="flex-1 p-2 bg-gray-100 text-gray-900 focus:outline-none"
                        value={cred.password}
                        onChange={onChange}
                    />
                    <button
                        type="button"
                        className="px-3 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                        <i className="fa-solid fa-eye-slash"></i>
                        ) : (
                        <i className="fa-solid fa-eye"></i>
                        )}
                    </button>
                    </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end mb-3">
                    <Link to="/forgot-password" className="text-sm font-bold text-blue-600">
                    Forgot Password?
                    </Link>
                </div>

                {/* Captcha */}
                <div className="flex justify-center my-3">
                    <ReCAPTCHA
                    sitekey={c_sitekey}
                    ref={captchaRef}
                    onChange={captchaChange}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2 mb-4 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={
                    cred.email === "" ||
                    cred.password === "" ||
                    captcha === false ||
                    loader
                    }
                >
                    Sign In
                    {loader && <span className="ml-2 animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4"></span>}
                </button>

                {/* Sign Up Link */}
                <p className="text-center mb-6 text-gray-500 font-medium">
                    Don't have an account?{" "}
                    <Link
                    to={
                        searchParams.s !== ""
                        ? `/signup?s=${searchParams.s}&id=${searchParams.id}`
                        : "/signup"
                    }
                    className="text-blue-600 font-semibold"
                    >
                    Sign Up
                    </Link>
                </p>
                </form>

                {/* Social Login */}
                <div className="mb-6">
                <div className="flex items-center mb-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-3 text-gray-500 text-sm">Or continue with</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <button
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 rounded-md hover:bg-gray-50"
                    onClick={login}
                >
                    <img
                    src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                    alt="Google"
                    className="w-5"
                    />
                    Google
                </button>
                <center>
                    <span className={gloader} role="status" aria-hidden="true"></span>
                </center>
                </div>

                {/* Terms */}
                <div className="text-center">
                <small className="text-gray-500">
                    By continuing, you agree to our{" "}
                    <Link to="/terms" className="text-blue-600">
                    Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" className="text-blue-600">
                    Privacy Policy
                    </Link>
                </small>
                </div>
            </div>
            </div>
        </div>
    </div>

  )
}

export default Login
