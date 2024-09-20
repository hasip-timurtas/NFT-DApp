import Web3 from 'web3';
import { infuraProjectId, nftContractAddress } from './constants';
import { uploadJsonToIpfs } from './pinata.js';

const infuraUrl = `https://sepolia.infura.io/v3/${infuraProjectId}`;
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

const contractABI = require('../contract-abi.json');

export const connectWallet = async () => {
  if (!window.ethereum) {
    return {
      status: 'Metamask is not installed. Please install Metamask to connect your wallet.',
    };
  }

  try {
    // Request wallet connection
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    web3.setProvider(window.ethereum);
    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
      return {
        status: 'No accounts found. Please ensure Metamask is connected.',
      };
    }

    return {
      status: 'Wallet connected successfully.',
      address: accounts[0],
    };
  } catch (err) {
    console.error('Error connecting wallet:', err);

    if (err.code === 4001) {
      return {
        status: 'Connection request was denied by the user.',
      };
    }

    return {
      status: `An error occurred: ${err.message}`,
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (!window.ethereum) {
    return {
      status: 'Metamask is not installed. Please install Metamask to connect your wallet.',
    };
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length === 0) {
      return {
        status: 'No wallet connected. Please connect to Metamask.',
      };
    }

    return {
      address: accounts[0],
      status: 'Wallet connected successfully.',
    };
  } catch (err) {
    console.error('Error fetching accounts:', err);

    if (err.code === 4001) {
      // User rejected the request
      return {
        status: 'Access to wallet was denied by the user.',
      };
    }

    return {
      status: `An error occurred: ${err.message}`,
    };
  }
};

async function initializeContract() {
  return new web3.eth.Contract(contractABI, nftContractAddress);
}

export const mintToken = async (url, name, description) => {
  // Validate inputs
  if (!url.trim() || !name.trim() || !description.trim()) {
    return {
      success: false,
      status: 'Please fill out all fields before proceeding with the minting process.',
    };
  }

  // Prepare metadata
  const metadata = {
    name: name,
    image: url,
    description: description,
  };

  // Upload metadata to IPFS
  const pinataResponse = await uploadJsonToIpfs(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: 'An error occurred while uploading the token metadata to IPFS.',
    };
  }
  const tokenURI = pinataResponse.pinataUrl;

  try {
    // Initialize the contract
    const contract = await initializeContract();

    // Define the transaction details
    const transactionDetails = {
      to: nftContractAddress,
      from: window.ethereum.selectedAddress,
      data: contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI(),
    };

    // Send the transaction
    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionDetails],
    });

    return {
      success: true,
      status: `Transaction successful! View it on Etherscan: https://sepolia.etherscan.io/tx/${transactionHash}`,
    };
  } catch (error) {
    return {
      success: false,
      status: `Failed to mint the NFT: ${error.message}`,
    };
  }
};
