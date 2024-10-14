import React from "react";
import { HiLockClosed, HiFingerPrint } from "react-icons/hi";

const Login = ({ connectWallet }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
          Secure eVoting Portal
        </h1>
        <div className="flex justify-center mb-6">
          <HiLockClosed className="text-blue-500 text-6xl" />
        </div>
        <p className="text-center text-gray-600 mb-8">
          Your voice matters. Login securely to participate in the democratic
          process.
        </p>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
          onClick={connectWallet}
        >
          <HiFingerPrint className="mr-2" size={24} />
          Authenticate with Metamask
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Secure, transparent, and decentralized voting powered by blockchain
          technology.
        </p>
      </div>
    </div>
  );
};

export default Login;
