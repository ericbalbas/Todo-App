import React from "react";
import { Link } from "react-router-dom";
import { Icon, InlineIcon } from "@iconify/react";

const ErrorDisplay = ({ errorMessage }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center p-8 bg-red-100 border border-red-400 rounded">
        <InlineIcon
          className="text-4xl text-red-500 mb-4"
          icon="mdi:alert-circle-outline" // Replace with your desired icon
        />
        <h1 className="text-lg text-red-700 text-center">{errorMessage}</h1>
        <Link to='/'>BACK TO HOME</Link>
      </div>
    </div>
  );
};

export default ErrorDisplay;
