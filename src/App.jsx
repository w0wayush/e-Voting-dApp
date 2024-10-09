import React, { useState, useEffect } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import ElectionContract from "./contracts/Election.json"; // ABI JSON

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [voterRegistered, setVoterRegistered] = useState(false);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    const provider = await detectEthereumProvider(); // Detect if MetaMask is installed
    if (provider) {
      const web3 = new Web3(provider); // Instantiate Web3 with MetaMask provider

      // Load account details from MetaMask
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      // Get the current network ID (e.g., 5777 for Ganache local blockchain)
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ElectionContract.networks[networkId];

      if (deployedNetwork) {
        const electionInstance = new web3.eth.Contract(
          ElectionContract.abi,
          deployedNetwork.address
        );
        setContract(electionInstance);

        // Get the number of candidates in the election
        const candidatesCount = await electionInstance.methods
          .candidatesCount()
          .call();
        const candidatesArray = [];
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await electionInstance.methods.candidates(i).call();
          candidatesArray.push(candidate);
        }
        setCandidates(candidatesArray);

        // Check if the current account has voted
        const voterInfo = await electionInstance.methods
          .voters(accounts[0])
          .call();
        setHasVoted(voterInfo.hasVoted);
        setVoterRegistered(voterInfo.isRegistered);
      } else {
        alert("Smart contract not deployed on the current network.");
      }
    } else {
      alert("Please install MetaMask to use this dApp!");
    }
  }

  return (
    <div>
      <h1>Blockchain-based eVoting System</h1>
      <p>Connected Account: {account}</p>

      {voterRegistered ? (
        hasVoted ? (
          <p>You have already voted!</p>
        ) : (
          <div>
            <h2>Vote for a Candidate:</h2>
            {candidates.map((candidate) => (
              <button key={candidate.id} onClick={() => vote(candidate.id)}>
                {candidate.name}
              </button>
            ))}
          </div>
        )
      ) : (
        <p>Register as a voter to participate.</p>
      )}
    </div>
  );
}

export default App;
