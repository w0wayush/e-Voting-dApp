import React from "react";
import { BiAward, BiUserCheck } from "react-icons/bi";
import { FaClock } from "react-icons/fa";

const Connected = ({
  account,
  candidates,
  remainingTime,
  selectedCandidate,
  handleCandidateChange,
  voteFunction,
  hasVoted,
  loading,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">eVoting System</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-full max-w-md">
        <div className="flex items-center mb-4">
          <BiUserCheck className="text-green-500 mr-2" size={24} />
          <p className="text-lg">
            <span className="font-semibold">Account:</span>{" "}
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </p>
        </div>
        <div className="flex items-center mb-4">
          <FaClock className="text-blue-500 mr-2" size={16} />
          <p className="text-lg">
            <span className="font-semibold">Remaining Time:</span>{" "}
            {remainingTime} seconds
          </p>
        </div>
      </div>
      {hasVoted ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-r-lg shadow flex items-center">
          {/* <BiCheckCircle className="mr-2" /> */}
          <p className="text-xl font-semibold">
            You have already voted. Thank you for participating!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Cast Your Vote
          </h2>
          <select
            value={selectedCandidate}
            onChange={handleCandidateChange}
            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate.index} value={candidate.index}>
                {candidate.name}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center w-full text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={voteFunction}
            disabled={loading || !selectedCandidate}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Voting...
              </>
            ) : (
              "Submit Vote"
            )}
          </button>
        </div>
      )}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          Current Results
        </h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Candidate Name</th>
                <th className="px-4 py-2">Votes</th>
              </tr>
            </thead>
            <tbody>
              {candidates
                .sort((a, b) => b.voteCount - a.voteCount)
                .map((candidate, index) => (
                  <tr
                    key={candidate.index}
                    className={`border-b border-gray-200 hover:bg-blue-50 ${
                      index === 0 ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2 text-center">
                      {index === 0 && (
                        <BiAward
                          className="inline mr-1 text-yellow-500"
                          size={24}
                        />
                      )}
                      {index + 1}
                    </td>
                    <td className="px-4 py-2">{candidate.name}</td>
                    <td className="px-4 py-2 text-center">
                      {candidate.voteCount}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Connected;
