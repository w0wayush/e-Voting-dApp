// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Election {
    struct Candidate {
        uint id;
        string name;
        // uint age;
        bool registered;
        address candidateAddress;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedCandidateId;
    }

    address public admin;
    uint public candidatesCount;
    uint public totalVotes;
    address public winnerAddress;
    string public eventName;
    bool votingStarted;
    
    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    modifier onlyRegistered() {
        require(voters[msg.sender].isRegistered, "Not registered as a voter.");
        _;
    }

    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        _;
    }

    event VoterRegistered(address voter);
    event VoteCast(address voter, uint candidateId);
    event CandidateAdded(string candidateName);

    constructor() {
        admin = msg.sender; // The contract creator is the admin
    }

    function addCandidate(string memory name, address _candidateAddress) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0, _candidateAddress);
        candidates[candidatesCount].registered = true;
        emit CandidateAdded(name);
    }

    function registerVoter(address voterAddress) public onlyAdmin {
        require(!voters[voterAddress].isRegistered, "Voter is already registered.");
        voters[voterAddress].isRegistered = true;
        emit VoterRegistered(voterAddress);
    }

    function vote(uint candidateId) public onlyRegistered hasNotVoted {
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate ID.");
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = candidateId;
        candidates[candidateId].voteCount++;
        totalVotes++;
        emit VoteCast(msg.sender, candidateId);
    }

    function getCandidate(uint candidateId) public view returns (string memory, uint) {
        Candidate memory candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }

    function getResults() public view returns (string memory winnerName, uint winnerVoteCount) {
        uint maxVotes = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerName = candidates[i].name;
                winnerVoteCount = candidates[i].voteCount;
            }
        }
        return (winnerName, winnerVoteCount);
    }
}
