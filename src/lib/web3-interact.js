import { ethers } from 'ethers';
import { nftContractAddress } from './constants';
import { uploadImageToIpfs } from './pinata.js';
import contractABI from '../MhtNFT-contract-abi.json';

/**
 * Retrieves the Ethereum provider and signer from the user's wallet.
 * @async
 * @returns {Promise<{ provider: ethers.providers.Web3Provider, signer: ethers.Signer }>}
 * The provider and signer objects.
 * @throws Will throw an error if the Ethereum provider is not found.
 */
async function getProviderAndSigner() {
  if (!window.ethereum) {
    throw new Error('Ethereum provider not found. Please install MetaMask.');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
}

/**
 * Initializes and returns an instance of the NFT contract connected with the signer.
 * @async
 * @returns {Promise<ethers.Contract>} The initialized contract instance.
 */
async function initializeContract() {
  const { signer } = await getProviderAndSigner();
  return new ethers.Contract(nftContractAddress, contractABI, signer);
}

/**
 * Connects the user's wallet using MetaMask.
 * @async
 * @returns {Promise<{ status: string, address?: string }>}
 * An object containing the connection status and the connected address if successful.
 */
export const connectWallet = async () => {
  if (!window.ethereum) {
    return {
      status:
        'MetaMask is not installed. Please install MetaMask to connect your wallet.',
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
      status:
        err.code === 4001
          ? 'Connection request was denied by the user.'
          : `An error occurred: ${err.message}`,
    };
  }
};

/**
 * Checks if the user's wallet is currently connected.
 * @async
 * @returns {Promise<{ address: string | null, status: string }>}
 * An object containing the connected address and a status message.
 */
export const getCurrentWalletConnected = async () => {
  if (!window.ethereum) {
    return {
      address: null,
      status:
        'MetaMask is not installed. Please install MetaMask to connect your wallet.',
    };
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
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

/**
 * Mints a new NFT by uploading an image to IPFS and interacting with the NFT smart contract.
 * @async
 * @param {File} file - The image file to be uploaded and minted as an NFT.
 * @returns {Promise<{ success: boolean, status: string }>}
 * An object indicating the success status and a message.
 */
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
    console.error('Failed to mint the NFT:', error);
    return {
      success: false,
      status: `Failed to mint the NFT: ${error.message}`,
    };
  }
};

/**
 * Transfers an NFT from the connected wallet to a recipient address.
 * @async
 * @param {string | number} tokenId - The ID of the token to transfer.
 * @param {string} recipientAddress - The Ethereum address of the recipient.
 * @returns {Promise<{ success: boolean, status: string }>}
 * An object indicating the success status and a message.
 */
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

    const tx = await contract.transferFrom(
      address,
      recipientAddress.trim(),
      tokenId
    );
    await tx.wait();

    return {
      success: true,
      status: `NFT transferred successfully! View it on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`,
    };
  } catch (error) {
    console.error('Failed to transfer the NFT:', error);
    return {
      success: false,
      status: `Failed to transfer the NFT: ${error.message}`,
    };
  }
};

/**
 * Fetches the NFTs owned by a specific wallet address.
 * @async
 * @param {string} walletAddress - The Ethereum address of the wallet to fetch NFTs for.
 * @returns {Promise<{ success: boolean, nfts?: Array<{ tokenId: string, tokenURI: string }>, status: string }>}
 * An object indicating the success status, a list of NFTs, and a message.
 */
export const fetchOwnedNFTs = async (walletAddress) => {
  if (!walletAddress || !walletAddress.trim()) {
    return {
      success: false,
      status: 'Wallet address is required to fetch NFTs.',
    };
  }

  try {
    const { address } = await getCurrentWalletConnected();

    if (!address) {
      return {
        success: false,
        status: 'Wallet is not connected. Please connect your wallet.',
      };
    }

    const contract = await initializeContract();
    const balanceBN = await contract.balanceOf(walletAddress);
    const balance = balanceBN.toString();
    const nfts = [];

    for (let i = 0; i < balance; i++) {
      const tokenIdBN = await contract.tokenOfOwnerByIndex(walletAddress, i);
      const tokenId = tokenIdBN.toString();
      const tokenURI = await contract.tokenURI(tokenId);
      nfts.push({ tokenId, tokenURI });
    }

    return {
      success: true,
      nfts,
      status: 'NFTs fetched successfully.',
    };
  } catch (error) {
    console.error('Failed to fetch NFTs:', error);
    return {
      success: false,
      status: `Failed to fetch NFTs: ${error.message}`,
    };
  }
};
