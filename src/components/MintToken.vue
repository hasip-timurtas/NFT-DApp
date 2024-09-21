<template>
  <div class="nft-minter">
    <!-- Connect Wallet Button -->
    <button id="walletButton" @click="handleWalletConnection">
      {{
        walletAddress
          ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : "Connect Wallet"
      }}
    </button>

    <!-- Minting Section -->
    <h1 id="pageTitle">NFT Minting Tool</h1>
    <p>Upload an image and click "Mint" to create your NFT.</p>
    
    <form @submit.prevent="handleMinting">
      <!-- Image Upload -->
      <label for="assetFile">Asset File:</label>
      <input id="assetFile" type="file" @change="handleFileChange" />

      <!-- Mint Button -->
      <button type="submit" id="mintNFTButton">Mint NFT</button>
    </form>

    <hr />

    <!-- Transfer Section -->
    <h2 id="transferTitle">Transfer Your NFT</h2>
    <form @submit.prevent="handleTransfer">
      <!-- Token ID -->
      <label for="tokenId">Token ID:</label>
      <input id="tokenId" type="text" placeholder="Enter the Token ID of your NFT" v-model="tokenId" />

      <!-- Recipient Address -->
      <label for="recipientAddress">Recipient Address:</label>
      <input
        id="recipientAddress"
        type="text"
        placeholder="Enter the recipient's wallet address"
        v-model="recipientAddress"
      />

      <!-- Transfer Button -->
      <button type="submit" id="transferNFTButton">Transfer NFT</button>
    </form>

    <hr />

    <!-- Owned NFTs Section -->
    <h2 id="ownedNftsTitle">Your NFTs</h2>
    <button @click="fetchMyNFTs">Load My NFTs</button>
    <div class="owned-nfts" v-if="ownedNfts && ownedNfts.length > 0">
      <div class="nft" v-for="nft in ownedNfts" :key="nft.tokenId">
        <img :src="nft.tokenURI" />
        <p>Token ID: {{ nft.tokenId }}</p>
      </div>
    </div>
    <p v-else>No NFTs found for this wallet.</p>
    <!-- Transaction Status -->
    <p id="transactionStatus" v-if="statusMessage" :style="{ color: 'red' }">
      {{ statusMessage }}
    </p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintToken,
  transferNFT,
  fetchOwnedNFTs,
} from "../lib/web3-interact";

export default {
  setup() {
    const walletAddress = ref(null);
    const statusMessage = ref("");

    const assetFile = ref(null);
    const tokenId = ref("");
    const recipientAddress = ref("");
    const ownedNfts = ref([]);

    onMounted(async () => {
      const { address, status } = await getCurrentWalletConnected();
      walletAddress.value = address;
      statusMessage.value = status;

      if (walletAddress.value) {
        await fetchMyNFTs();
      }
      listenForAccountChanges();
    });

    function listenForAccountChanges() {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            walletAddress.value = accounts[0];
            statusMessage.value = "You can now mint, transfer, or view your NFTs.";
          } else {
            walletAddress.value = null;
            statusMessage.value = "Please connect to Metamask.";
          }
        });
      } else {
        statusMessage.value = `Metamask is not installed. <a target="_blank" href="https://metamask.io/download.html">Get Metamask</a>`;
      }
    }

    const handleWalletConnection = async () => {
      const { address, status } = await connectWallet();
      walletAddress.value = address;
      statusMessage.value = status;
      if (walletAddress.value) {
        await fetchMyNFTs();
      }
    };

    const handleFileChange = (event) => {
      assetFile.value = event.target.files[0];
    };

    const handleMinting = async () => {
      if (!assetFile.value) {
        statusMessage.value = "Please upload an image file.";
        return;
      }

      const { success, status } = await mintToken(assetFile.value);
      statusMessage.value = status;
      if (success) {
        resetMintForm();
        await fetchMyNFTs(); // Refresh the list after minting
      }
    };

    const handleTransfer = async () => {
      if (!tokenId.value.trim() || !recipientAddress.value.trim()) {
        statusMessage.value = "Please provide a valid Token ID and Recipient Address.";
        return;
      }

      const { success, status } = await transferNFT(tokenId.value, recipientAddress.value);
      statusMessage.value = status;
      if (success) {
        resetTransferForm();
      }
    };

    const fetchMyNFTs = async () => {
      if (!walletAddress.value) {
        statusMessage.value = "Connect your wallet to view your NFTs.";
        return;
      }

      const { nfts, status } = await fetchOwnedNFTs(walletAddress.value);
      ownedNfts.value = nfts;
      statusMessage.value = status;
    };

    function resetMintForm() {
      assetFile.value = null;
    }

    function resetTransferForm() {
      tokenId.value = "";
      recipientAddress.value = "";
    }

    return {
      walletAddress,
      statusMessage,
      assetFile,
      tokenId,
      recipientAddress,
      ownedNfts,
      handleWalletConnection,
      handleMinting,
      handleFileChange,
      handleTransfer,
      fetchMyNFTs,
    };
  },
};
</script>

<style>
/* Your styles will go here */
.owned-nfts {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}
</style>
