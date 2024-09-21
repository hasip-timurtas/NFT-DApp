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

    return {
      status: err.code === 4001
        ? 'Connection request was denied by the user.'
        : `An error occurred: ${err.message}`,
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

    return {
      status: err.code === 4001
        ? 'Access to wallet was denied by the user.'
        : `An error occurred: ${err.message}`,
    };
  }
};

async function initializeContract() {
  return new web3.eth.Contract(contractABI, nftContractAddress);
}

export const mintToken = async (url, name, description) => {
  if (!url.trim() || !name.trim() || !description.trim()) {
    return {
      success: false,
      status: 'Please fill out all fields before proceeding with the minting process.',
    };
  }

  const metadata = {
    name: name,
    image: url,
    description: description,
  };

  const pinataResponse = await uploadJsonToIpfs(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: 'An error occurred while uploading the token metadata to IPFS.',
    };
  }
  const tokenURI = pinataResponse.pinataUrl;

  try {
    const contract = await initializeContract();

    const transactionDetails = {
      to: nftContractAddress,
      from: window.ethereum.selectedAddress,
      data: contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI(),
    };

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

// New: Transfer NFT function
export const transferNFT = async (tokenId, recipientAddress) => {
  if (!tokenId || !recipientAddress.trim()) {
    return {
      success: false,
      status: 'Token ID and recipient address are required for transfer.',
    };
  }

  try {
    const contract = await initializeContract();

    const transactionDetails = {
      to: nftContractAddress,
      from: window.ethereum.selectedAddress,
      data: contract.methods.transferFrom(
        window.ethereum.selectedAddress,
        recipientAddress,
        tokenId
      ).encodeABI(),
    };

    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionDetails],
    });

    return {
      success: true,
      status: `NFT transferred successfully! View it on Etherscan: https://sepolia.etherscan.io/tx/${transactionHash}`,
    };
  } catch (error) {
    return {
      success: false,
      status: `Failed to transfer the NFT: ${error.message}`,
    };
  }
};

export const fetchOwnedNFTs = async (walletAddress) => {
  try {
    const contract = await initializeContract();
    console.log({ contract, walletAddress })
    const balance = await contract.methods.balanceOf(walletAddress).call();
    console.log({ balance })
    const nfts = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(walletAddress, i).call();
      const tokenURI = await contract.methods.tokenURI(tokenId).call();
      nfts.push({ tokenId, tokenURI });
    }

    return {
      success: true,
      nfts: nfts,
      status: 'NFTs fetched successfully.',
    };
  } catch (error) {
    return {
      success: false,
      status: `Failed to fetch NFTs: ${error.message}`,
    };
  }
};