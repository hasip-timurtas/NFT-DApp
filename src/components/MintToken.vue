<template>
  <div class="nft-minter">
    <button id="walletButton" @click="handleWalletConnection">
      {{
        walletAddress
          ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
              -4
            )}`
          : "Connect Wallet"
      }}
    </button>

    <h1 id="pageTitle">NFT Minting Tool</h1>
    <p>
      Provide the asset link, name, and description below, then click "Mint" to
      create your NFT.
    </p>
    <form @submit.prevent="handleMinting">
      <label for="assetLink">Asset URL:</label>
      <input
        id="assetLink"
        type="text"
        placeholder="Enter the URL of your asset"
        v-model="assetUrl"
      />

      <label for="nftName">NFT Name:</label>
      <input
        id="nftName"
        type="text"
        placeholder="Enter the name of your NFT"
        v-model="nftName"
      />

      <label for="nftDescription">Description:</label>
      <input
        id="nftDescription"
        type="text"
        placeholder="Provide a description for your NFT"
        v-model="nftDescription"
      />

      <button type="submit" id="mintNFTButton">Mint NFT</button>
    </form>

    <hr />

    <h2 id="transferTitle">Transfer Your NFT</h2>
    <form @submit.prevent="handleTransfer">
      <label for="tokenId">Token ID:</label>
      <input
        id="tokenId"
        type="text"
        placeholder="Enter the Token ID of your NFT"
        v-model="tokenId"
      />

      <label for="recipientAddress">Recipient Address:</label>
      <input
        id="recipientAddress"
        type="text"
        placeholder="Enter the recipient's wallet address"
        v-model="recipientAddress"
      />

      <button type="submit" id="transferNFTButton">Transfer NFT</button>
    </form>

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
} from "../lib/web3-interact";

export default {
  setup() {
    const walletAddress = ref(null);
    const statusMessage = ref("");

    const nftName = ref("");
    const nftDescription = ref("");
    const assetUrl = ref("");

    const tokenId = ref("");
    const recipientAddress = ref("");

    onMounted(async () => {
      const { address, status } = await getCurrentWalletConnected();
      walletAddress.value = address;
      statusMessage.value = status;

      listenForAccountChanges();
    });

    function listenForAccountChanges() {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            walletAddress.value = accounts[0];
            statusMessage.value = "You can now mint or transfer your NFT.";
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
    };

    const handleMinting = async () => {
      const { success, status } = await mintToken(
        assetUrl.value,
        nftName.value,
        nftDescription.value
      );
      statusMessage.value = status;
      if (success) {
        resetMintForm();
      }
    };

    const handleTransfer = async () => {
      const { success, status } = await transferNFT(
        tokenId.value,
        recipientAddress.value
      );
      statusMessage.value = status;
      if (success) {
        resetTransferForm();
      }
    };

    function resetMintForm() {
      nftName.value = "";
      nftDescription.value = "";
      assetUrl.value = "";
    }

    function resetTransferForm() {
      tokenId.value = "";
      recipientAddress.value = "";
    }

    return {
      walletAddress,
      statusMessage,
      nftName,
      nftDescription,
      assetUrl,
      tokenId,
      recipientAddress,
      handleWalletConnection,
      handleMinting,
      handleTransfer,
    };
  },
};
</script>

<style>
/* Your styles will go here */
</style>
