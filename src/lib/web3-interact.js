import { ethers } from 'ethers';
import { nftContractAddress } from './constants';
import { uploadImageToIpfs } from './pinata.js';

const contractABI = require('../MhtNFT-contract-abi.json');

async function getProviderAndSigner() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
}

async function initializeContract() {
  const { signer } = await getProviderAndSigner();
  return new ethers.Contract(nftContractAddress, contractABI, signer);
}

export const connectWallet = async () => {
  if (!window.ethereum) {
    return {
      status: 'Metamask is not installed. Please install Metamask to connect your wallet.',
    };
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const { signer } = await getProviderAndSigner();
    const address = await signer.getAddress();

    return {
      status: 'Wallet connected successfully.',
      address,
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
      address: null,
      status: 'Metamask is not installed. Please install Metamask to connect your wallet.',
    };
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      return {
        address: accounts[0],
        status: 'Wallet connected successfully.',
      };
    } else {
      return {
        address: null,
        status: 'Please connect your wallet using the Connect Wallet button.',
      };
    }
  } catch (err) {
    console.error('Error checking wallet connection:', err);
    return {
      address: null,
      status: `An error occurred: ${err.message}`,
    };
  }
};

export const mintToken = async (file) => {
  if (!file) {
    return {
      success: false,
      status: 'Please upload an image file before minting.',
    };
  }

  const imageResponse = await uploadImageToIpfs(file);
  if (!imageResponse.success) {
    return {
      success: false,
      status: 'An error occurred while uploading the image to IPFS.',
    };
  }

  const imageUrl = imageResponse.pinataUrl;

  try {
    const { signer } = await getProviderAndSigner();
    const address = await signer.getAddress();
    const contract = await initializeContract();

    const tx = await contract.mintNFT(address, imageUrl);
    await tx.wait();

    return {
      success: true,
      status: `Transaction successful! View it on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`,
    };
  } catch (error) {
    return {
      success: false,
      status: `Failed to mint the NFT: ${error.message}`,
    };
  }
};

export const transferNFT = async (tokenId, recipientAddress) => {
  if (!tokenId || !recipientAddress.trim()) {
    return {
      success: false,
      status: 'Token ID and recipient address are required for transfer.',
    };
  }

  try {
    const contract = await initializeContract();
    const { signer } = await getProviderAndSigner();
    const address = await signer.getAddress();

    const tx = await contract.transferFrom(address, recipientAddress, tokenId);
    await tx.wait();

    return {
      success: true,
      status: `NFT transferred successfully! View it on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`,
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

    const { address } = await getCurrentWalletConnected();

    if (!address) {
      return {
        success: false,
        status: 'Wallet is not connected. Please connect your wallet.',
      };
    }
    const contract = await initializeContract();
    const balance = await contract.balanceOf(walletAddress);
    const nfts = [];

    for (let i = 0; i < balance.toString(); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
      const tokenURI = await contract.tokenURI(tokenId);
      nfts.push({ tokenId: tokenId.toString(), tokenURI });
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