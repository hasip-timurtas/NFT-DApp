<template>
  <div class="nft-minter">
    <WalletButton :walletAddress="walletAddress" @connect-wallet="handleWalletConnection" />
    <MintForm @file-change="handleFileChange" @mint-nft="handleMinting" />
    <hr />
    <OwnedNfts :nfts="ownedNfts" @load-nfts="fetchMyNFTs" @transfer-nft="openTransferModal" />
    <hr />
    <p id="transactionStatus" v-if="statusMessage" :style="{ color: 'red' }">
      {{ statusMessage }}
    </p>
    <TransferModal :show="showModal" :tokenId="selectedTokenId" @confirm-transfer="confirmTransfer"
      @close-modal="closeTransferModal" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import WalletButton from "./WalletButton.vue";
import MintForm from "./MintForm.vue";
import OwnedNfts from "./OwnedNfts.vue";
import TransferModal from "./TransferModal.vue";

import {
  connectWallet,
  getCurrentWalletConnected,
  mintToken,
  transferNFT,
  fetchOwnedNFTs,
} from "../lib/web3-interact";

export default {
  components: {
    WalletButton,
    MintForm,
    OwnedNfts,
    TransferModal,
  },
  setup() {
    const walletAddress = ref(null);
    const statusMessage = ref("");

    const assetFile = ref(null);
    const ownedNfts = ref([]);

    const showModal = ref(false);
    const selectedTokenId = ref(null);

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
        window.ethereum.on("accountsChanged", async (accounts) => {
          if (accounts.length > 0) {
            walletAddress.value = accounts[0];
            statusMessage.value = "Wallet changed. Fetching your NFTs...";
            await fetchMyNFTs(); // Fetch NFTs when wallet changes
          } else {
            walletAddress.value = null;
            ownedNfts.value = []; // Clear NFTs when no wallet is connected
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

    const handleFileChange = (file) => {
      assetFile.value = file;
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

    const openTransferModal = (tokenId) => {
      selectedTokenId.value = tokenId;
      showModal.value = true;
    };

    const closeTransferModal = () => {
      showModal.value = false;
      selectedTokenId.value = null;
    };

    const confirmTransfer = async (recipientAddress) => {
      if (!recipientAddress.trim()) {
        statusMessage.value = "Please provide a valid recipient address.";
        return;
      }

      const { success, status } = await transferNFT(selectedTokenId.value, recipientAddress);
      statusMessage.value = status;
      if (success) {
        await fetchMyNFTs(); // Refresh the list after transfer
        closeTransferModal();
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

    return {
      walletAddress,
      statusMessage,
      ownedNfts,
      showModal,
      selectedTokenId,
      handleWalletConnection,
      handleMinting,
      handleFileChange,
      openTransferModal,
      closeTransferModal,
      confirmTransfer,
      fetchMyNFTs,
    };
  },
};
</script>
