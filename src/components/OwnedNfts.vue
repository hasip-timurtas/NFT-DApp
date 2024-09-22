<template>
    <div>
        <h2 id="ownedNftsTitle">Your NFTs</h2>
        <button @click="loadNFTs">Load My NFTs</button>
        <div class="owned-nfts" v-if="nfts && nfts.length > 0">
            <div class="nft" v-for="nft in nfts" :key="nft.tokenId">
                <img :src="nft.tokenURI" :alt="`NFT Image ${nft.tokenId}`" @error="onImageError" />
                <p>Token ID: {{ nft.tokenId }}</p>
                <button @click="transferNFT(nft.tokenId)">Transfer</button>
            </div>
        </div>
        <p v-else>No NFTs found for this wallet.</p>
    </div>
</template>

<script>
export default {
    /**
     * Component to display the user's owned NFTs.
     * @component
     * @prop {Array} nfts - Array of NFT objects with tokenId and tokenURI.
     * @emits load-nfts - Emitted when the user clicks the 'Load My NFTs' button.
     * @emits transfer-nft - Emitted when the user clicks the 'Transfer' button for an NFT.
     */
    props: {
        nfts: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        /**
         * Emits the 'load-nfts' event to load NFTs.
         */
        loadNFTs() {
            this.$emit('load-nfts');
        },
        /**
         * Emits the 'transfer-nft' event with the specified tokenId.
         * @param {string|number} tokenId - The ID of the token to transfer.
         */
        transferNFT(tokenId) {
            this.$emit('transfer-nft', tokenId);
        },
        /**
         * Handles image load errors by setting a placeholder image.
         * @param {Event} event - The error event from the image.
         */
        onImageError(event) {
            event.target.src = 'path/to/placeholder/image.png'; // Replace with your placeholder image path
        },
    },
};
</script>

<style scoped>
.owned-nfts {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.nft {
    text-align: center;
    max-width: 150px;
}

.nft img {
    max-width: 100%;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 5px;
    background-color: #f9f9f9;
}
</style>