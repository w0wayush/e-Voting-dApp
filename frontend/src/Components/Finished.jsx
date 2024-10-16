import React from "react";
import { BiAward, BiCheckCircle, BiUser } from "react-icons/bi";

const Finished = ({ candidates }) => {
  const winner = candidates.reduce(
    (max, candidate) => (candidate.voteCount > max.voteCount ? candidate : max),
    candidates[0]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">eVoting Results</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <BiAward className="text-yellow-500 mr-2" size={48} />
          <h2 className="text-3xl font-bold text-blue-800">Winner</h2>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800">{winner.name}</p>
          <p className="text-xl text-gray-600">{winner.voteCount} votes</p>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Final Results</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Candidate Name</th>
                <th className="px-4 py-2">Votes Received</th>
              </tr>
            </thead>
            <tbody>
              {candidates
                .sort((a, b) => b.voteCount - a.voteCount)
                .map((candidate, index) => (
                  <tr
                    key={candidate.index}
                    className={`border-b border-gray-200 hover:bg-blue-50 ${
                      candidate.name === winner.name ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2 text-center">
                      {index === 0 ? (
                        <BiAward className="inline mr-1 text-yellow-500" />
                      ) : (
                        <BiUser className="inline mr-1 text-gray-500" />
                      )}
                      {index + 1}
                    </td>
                    <td className="px-4 py-2">
                      {candidate.name}
                      {candidate.name === winner.name && (
                        <BiCheckCircle className="inline ml-2 text-green-500" />
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {candidate.voteCount}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p>Thank you for participating in the eVoting process.</p>
        <p>The results are now final and have been recorded securely.</p>
      </div>
    </div>
  );
};

export default Finished;
