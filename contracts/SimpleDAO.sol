// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract DAO {
    // Proposal struct
    struct Proposal {
        string description;
        uint256 voteCount;
        bool executed;
    }

    // Member struct
    struct Member {
        uint256 startTime;
        uint256 tokenBalance;
    }

    // State variables
    address[] public members;
    mapping(address => Member) public memberInfo;
    mapping(address => mapping(uint256 => bool)) public votes;
    Proposal[] public proposals;
    uint256 public totalSupply;

    // Events
    event MemberAdded(address indexed member, uint256 startTime);
    event MemberRemoved(address indexed member);
    event ProposalCreated(string description);
    event Voted(address indexed member, uint256 proposalIndex);
    event ProposalExecuted(uint256 proposalIndex);

    // Functions

    function addMember(address _newMember) external {
        require(!isMember(_newMember), "Member already exists");
        
        Member memory newMember = Member({
            startTime: block.timestamp,
            tokenBalance: 0
        });
        
        members.push(_newMember);
        memberInfo[_newMember] = newMember;
        totalSupply++;

        emit MemberAdded(_newMember, block.timestamp);
    }

    function removeMember(address _member) external {
        require(isMember(_member), "Member does not exist");

        delete memberInfo[_member];
        removeFromMembersArray(_member);
        totalSupply--;

        emit MemberRemoved(_member);
    }

    function createProposal(string memory _description) external {
        proposals.push(Proposal({
            description: _description,
            voteCount: 0,
            executed: false
        }));

        emit ProposalCreated(_description);
    }

    function vote(uint256 _proposalIndex) external {
        require(isMember(msg.sender), "You are not a member");
        require(!hasVoted(msg.sender, _proposalIndex), "Already voted");

        votes[msg.sender][_proposalIndex] = true;
        proposals[_proposalIndex].voteCount++;
        memberInfo[msg.sender].tokenBalance++;

        emit Voted(msg.sender, _proposalIndex);
    }

    function executeProposal(uint256 _proposalIndex) external {
        require(!proposals[_proposalIndex].executed, "Proposal already executed");

        uint256 votePercentage = (proposals[_proposalIndex].voteCount * 100) / totalSupply;

        require(votePercentage > 50, "Insufficient support for execution");

        proposals[_proposalIndex].executed = true;

        emit ProposalExecuted(_proposalIndex);
    }

    // Helper functions

    function isMember(address _member) internal view returns (bool) {
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == _member) {
                return true;
            }
        }
        return false;
    }

    function hasVoted(address _member, uint256 _proposalIndex) internal view returns (bool) {
        return votes[_member][_proposalIndex];
    }

    function removeFromMembersArray(address _member) internal {
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == _member) {
                for (uint256 j = i; j < members.length - 1; j++) {
                    members[j] = members[j + 1];
                }
                members.pop();
                break;
            }
        }
    }
}
