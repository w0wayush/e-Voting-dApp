// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 0xd20ed8f5271811e3144ffd415b05904037aa0044

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
    for (uint256 i = 0; i < _candidateNames.length; i++) {
        candidates.push(Candidate({
            name: _candidateNames[i],
            voteCount: 0
        }));
    }
    owner = msg.sender;
    votingStart = block.timestamp;
    votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
}

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({
                name: _name,
                voteCount: 0
        }));
    }

    function vote(uint256 _candidateIndex) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
    }

    function getAllVotesOfCandidates() public view returns (Candidate[] memory){
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
    }
        return votingEnd - block.timestamp;
    }
}



/*
pragma solidity ^0.8.0;

contract Evoting {

    uint public result;

    event success(string msg);

    function addNumbers(uint num1, uint num2) public pure returns (uint) {
        return num1 + num2;
    }

    function subNumbers(uint num1, uint num2) public pure returns (uint) {
        return num1 - num2;
    }

    function mulNumbers(uint num1, uint num2) public {
        result =  num1 * num2;
        emit success("Multiplication done!");
    }

    function divNumbers(uint num1, uint num2) public pure returns (uint) {
        require(num2 > 0, "num2 cannot be 0 or negative");
        require(num1 > num2, "num1 should be greater than num2");
        return num1 / num2;
    }
} */