import React from "react";

const Alert = ({ alert }) => {
  if (!alert) return null;

  const styles = {
    primary: "bg-blue-100 text-blue-800 border-blue-400",
    info: "bg-cyan-100 text-cyan-800 border-cyan-400",
    success: "bg-green-100 text-green-800 border-green-400",
    danger: "bg-red-100 text-red-800 border-red-400",
  };

  const icons = {
    primary: "fa-bell",
    info: "fa-circle-info",
    success: "fa-circle-check",
    danger: "fa-circle-exclamation",
  };

  return (
    <div className="fixed top-14 left-0 right-0 z-50 w-full">
      <div
        className={`flex items-center gap-2 border-l-4 p-3 shadow ${styles[alert.type]}`}
        role="alert"
      >
        <i className={`fa-solid ${icons[alert.type]}`}></i>
        <span>{alert.msg}</span>
      </div>
    </div>
  );
};

export default Alert;
