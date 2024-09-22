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
import { ref, onMounted, onUnmounted } from 'vue';
import WalletButton from './WalletButton.vue';
import MintForm from './MintForm.vue';
import OwnedNfts from './OwnedNfts.vue';
import TransferModal from './TransferModal.vue';

import {
  connectWallet,
  getCurrentWalletConnected,
  mintToken,
  transferNFT,
  fetchOwnedNFTs,
} from '../lib/web3-interact';

export default {
  components: {
    WalletButton,
    MintForm,
    OwnedNfts,
    TransferModal,
  },
  setup() {
    const walletAddress = ref(null);
    const statusMessage = ref('');

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

    /**
     * Listens for changes in the user's Ethereum accounts.
     * Updates the wallet address and fetches NFTs when the account changes.
     * Cleans up the event listener when the component is unmounted.
     */
    function listenForAccountChanges() {
      if (window.ethereum) {
        const handleAccountsChanged = async (accounts) => {
          if (accounts.length > 0) {
            walletAddress.value = accounts[0];
            statusMessage.value = 'Wallet changed. Fetching your NFTs...';
            await fetchMyNFTs(); // Fetch NFTs when wallet changes
          } else {
            walletAddress.value = null;
            ownedNfts.value = []; // Clear NFTs when no wallet is connected
            statusMessage.value = 'Please connect to MetaMask.';
          }
        };
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        onUnmounted(() => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        });
      } else {
        statusMessage.value =
          'MetaMask is not installed. Please install MetaMask from https://metamask.io/download.html';
      }
    }

    /**
     * Handles the wallet connection process.
     * Updates the wallet address and fetches NFTs if connection is successful.
     */
    const handleWalletConnection = async () => {
      try {
        const { address, status } = await connectWallet();
        walletAddress.value = address;
        statusMessage.value = status;
        if (walletAddress.value) {
          await fetchMyNFTs();
        }
      } catch (error) {
        statusMessage.value = `Error connecting wallet: ${error.message}`;
      }
    };

    /**
     * Handles file input change event from the MintForm component.
     * @param {File} file - The selected file.
     */
    const handleFileChange = (file) => {
      assetFile.value = file;
    };

    /**
     * Handles the minting of a new NFT.
     * Uses the selected file to mint a token and updates the status message.
     */
    const handleMinting = async () => {
      if (!assetFile.value) {
        statusMessage.value = 'Please upload an image file.';
        return;
      }
      try {
        const { success, status } = await mintToken(assetFile.value);
        statusMessage.value = status;
        if (success) {
          resetMintForm();
          await fetchMyNFTs(); // Refresh the list after minting
        }
      } catch (error) {
        statusMessage.value = `Error minting NFT: ${error.message}`;
      }
    };

    /**
     * Opens the transfer modal for a specific token ID.
     * @param {string|number} tokenId - The ID of the token to transfer.
     */
    const openTransferModal = (tokenId) => {
      selectedTokenId.value = tokenId;
      showModal.value = true;
    };

    /**
     * Closes the transfer modal and resets the selected token ID.
     */
    const closeTransferModal = () => {
      showModal.value = false;
      selectedTokenId.value = null;
    };

    /**
     * Confirms the transfer of the NFT to the specified recipient address.
     * @param {string} recipientAddress - The Ethereum address of the recipient.
     */
    const confirmTransfer = async (recipientAddress) => {
      if (!recipientAddress.trim()) {
        statusMessage.value = 'Please provide a valid recipient address.';
        return;
      }
      try {
        const { success, status } = await transferNFT(selectedTokenId.value, recipientAddress);
        statusMessage.value = status;
        if (success) {
          await fetchMyNFTs(); // Refresh the list after transfer
          closeTransferModal();
        }
      } catch (error) {
        statusMessage.value = `Error transferring NFT: ${error.message}`;
      }
    };

    /**
     * Fetches the NFTs owned by the connected wallet address.
     * Updates the list of owned NFTs and the status message.
     */
    const fetchMyNFTs = async () => {
      if (!walletAddress.value) {
        statusMessage.value = 'Connect your wallet to view your NFTs.';
        return;
      }
      try {
        const { nfts, status } = await fetchOwnedNFTs(walletAddress.value);
        ownedNfts.value = nfts;
        statusMessage.value = status;
      } catch (error) {
        statusMessage.value = `Error fetching NFTs: ${error.message}`;
      }
    };

    /**
     * Resets the minting form by clearing the selected asset file.
     * Optionally resets the MintForm component if necessary.
     */
    function resetMintForm() {
      assetFile.value = null;
      // Optionally, reset the MintForm component if it maintains internal state
      // This could be done via a ref or by emitting an event
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
