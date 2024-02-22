var web3 = new Web3('http://localhost:7545'); // Replace 8545 with your Ganache port if different

var abi = [
    {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "member",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          }
        ],
        "name": "MemberAdded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "member",
            "type": "address"
          }
        ],
        "name": "MemberRemoved",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "name": "ProposalCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "proposalIndex",
            "type": "uint256"
          }
        ],
        "name": "ProposalExecuted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "member",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "proposalIndex",
            "type": "uint256"
          }
        ],
        "name": "Voted",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "memberInfo",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenBalance",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "members",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "proposals",
        "outputs": [
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "executed",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "votes",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_newMember",
            "type": "address"
          }
        ],
        "name": "addMember",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_member",
            "type": "address"
          }
        ],
        "name": "removeMember",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_description",
            "type": "string"
          }
        ],
        "name": "createProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_proposalIndex",
            "type": "uint256"
          }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_proposalIndex",
            "type": "uint256"
          }
        ],
        "name": "executeProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }];

var contractAddress = '0xA39Dc4b54D02234B17Eda9e51F099918ec1af3b7';

var contract = new web3.eth.Contract(abi, contractAddress);

// Flag to prevent multiple submissions
var submitting = false;

// Function to handle errors
function handleError(error) {
    console.error(error);
    alert('An error occurred. Please check the console for details.');
}

// Function to disable button after submission
function disableButton(buttonId) {
    var button = document.getElementById(buttonId);
    if (button) {
        button.disabled = true;
    }
}

// Function to enable button
function enableButton(buttonId) {
    var button = document.getElementById(buttonId);
    if (button) {
        button.disabled = false;
    }
}

// Function to add a member
function addMember() {
    if (submitting) return;
    submitting = true;

    var newMemberAddress = document.getElementById('newMemberAddress').value;

    // Get the selected account from MetaMask
    web3.eth.getAccounts()
        .then(function(accounts) {
            var fromAddress = accounts[0]; // Assuming the first account is used
            return contract.methods.addMember(newMemberAddress).send({ from: fromAddress });
        })
        .then(function(receipt) {
            console.log(receipt);
            alert('Member added successfully');
        })
        .catch(function(error) {
            handleError(error);
        })
        .finally(function() {
            submitting = false;
            enableButton('addMemberButton');
        });
}

// Function to remove a member
function removeMember() {
    if (submitting) return;
    submitting = true;

    var memberAddress = document.getElementById('memberAddress').value;

    // Get the selected account from MetaMask
    web3.eth.getAccounts()
        .then(function(accounts) {
            var fromAddress = accounts[0]; // Assuming the first account is used
            return contract.methods.removeMember(memberAddress).send({ from: fromAddress });
        })
        .then(function(receipt) {
            console.log(receipt);
            alert('Member removed successfully');
        })
        .catch(function(error) {
            handleError(error);
        })
        .finally(function() {
            submitting = false;
            enableButton('removeMemberButton');
        });
}

// Function to create a proposal
function createProposal() {
    if (submitting) return;
    submitting = true;

    var description = document.getElementById('proposalDescription').value;

    // Get the selected account from MetaMask
    web3.eth.getAccounts()
        .then(function(accounts) {
            var fromAddress = accounts[0]; // Assuming the first account is used
            return contract.methods.createProposal(description).send({ from: fromAddress });
        })
        .then(function(receipt) {
            console.log(receipt);
            alert('Proposal created successfully');
        })
        .catch(function(error) {
            handleError(error);
        })
        .finally(function() {
            submitting = false;
            enableButton('createProposalButton');
        });
}

// Function to vote on a proposal
function vote() {
    if (submitting) return;
    submitting = true;

    var proposalIndex = document.getElementById('proposalIndex').value;

    // Get the selected account from MetaMask
    web3.eth.getAccounts()
        .then(function(accounts) {
            var fromAddress = accounts[0]; // Assuming the first account is used
            return contract.methods.vote(proposalIndex).send({ from: fromAddress });
        })
        .then(function(receipt) {
            console.log(receipt);
            alert('Vote submitted successfully');
        })
        .catch(function(error) {
            handleError(error);
        })
        .finally(function() {
            submitting = false;
            enableButton('voteButton');
        });
}

// Function to execute a proposal
function executeProposal() {
    if (submitting) return;
    submitting = true;

    var proposalIndex = document.getElementById('executeProposalIndex').value;

    // Get the selected account from MetaMask
    web3.eth.getAccounts()
        .then(function(accounts) {
            var fromAddress = accounts[0]; // Assuming the first account is used
            return contract.methods.executeProposal(proposalIndex).send({ from: fromAddress });
        })
        .then(function(receipt) {
            console.log(receipt);
            alert('Proposal executed successfully');
        })
        .catch(function(error) {
            handleError(error);
        })
        .finally(function() {
            submitting = false;
            enableButton('executeProposalButton');
        });
}