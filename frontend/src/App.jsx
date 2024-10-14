import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./Constant/constant";
import Login from "./Components/Login";
import Finished from "./Components/Finished";
import Connected from "./Components/Connected";
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [votingEnded, setVotingEnded] = useState(false);

  useEffect(() => {
    if (isConnected) {
      getCandidates();
      getRemainingTime();
      getCurrentStatus();
      checkIfVoted();
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [isConnected, account]);

  async function vote() {
    if (!selectedCandidate) return;
    setLoading(true);
    try {
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const tx = await contractInstance.vote(selectedCandidate);
      await tx.wait();
      setHasVoted(true);
      await getCandidates();
    } catch (error) {
      console.error("Voting failed", error);
    }
    setLoading(false);
  }

  async function checkIfVoted() {
    if (!account || !provider) return;
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const voteStatus = await contractInstance.voters(account);
    setHasVoted(voteStatus);
  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandidates();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber(),
      };
    });
    setCandidates(formattedCandidates);
  }

  async function getCurrentStatus() {
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  async function getRemainingTime() {
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const time = await contractInstance.getRemainingTime();
    const remainingTimeInSeconds = parseInt(time, 16);
    setRemainingTime(remainingTimeInSeconds);
    setVotingEnded(remainingTimeInSeconds <= 0);
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      setHasVoted(false);
      checkIfVoted();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        console.log("Metamask Connected : " + address);
      } catch (err) {
        console.error("Connection to Metamask failed:", err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
      alert("Please install Metamask to use this app!");
    }
  }

  function handleCandidateChange(e) {
    setSelectedCandidate(e.target.value);
  }

  console.log("Voting ended:", votingEnded);
  console.log("Is connected:", isConnected);
  console.log("Remaining time:", remainingTime);

  return (
    <div className="App">
      {!votingEnded ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            selectedCandidate={selectedCandidate}
            handleCandidateChange={handleCandidateChange}
            voteFunction={vote}
            hasVoted={hasVoted}
            loading={loading}
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished candidates={candidates} />
      )}
    </div>
  );
}

export default App;
