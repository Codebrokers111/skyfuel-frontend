import React, { useState, useEffect, useRef } from "react";
import { userContext } from "./userContext";

const UserState = (props) => {
  const { host, showAlert } = props.prop;
  const [user, setUser] = useState({ name: "", email: "", time: "" });
  const [userId, setUserId] = useState("");
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const getUser = async () => {
    try {
      const response = await fetch(`${host}/auth/getuser`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const json = await response.json();
      console.log("user data fetched:", json);

      // backend sends { user: {...} }
      const u = json.user;

      setUser({
        name: u.name,
        email: u.email,
        time: u.createdAt,
      });
      setUserId(u.id);
      localStorage.setItem("skyfuel-userId", u.id); // prisma uses id, not _id
    } catch (err) {
      showAlert("There is Error at Accessing Server", "danger");
    }
};

  const verifyCaptcha = async (token) => {
    try {
      if (!token) {
        showAlert("Captcha is not verified", "danger");
        return { stat: false, msg: "No token provided" };
      }
      const response = await fetch(`${host}/auth/checkcaptcha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });
      const reply = await response.json();
      return reply;
    } catch (err) {
      showAlert("There is an Error Accessing Server", "danger");
    }
  };

  return (
    <div>
      <userContext.Provider
        value={{
          user,
          userIdRef,
          getUser,
          verifyCaptcha
        }}
      >
        {props.children}
      </userContext.Provider>
    </div>
  )
}
export default UserState;