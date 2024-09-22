<template>
    <div>
        <h1 id="pageTitle">NFT Minting Tool</h1>
        <p>Upload an image and click "Mint" to create your NFT.</p>

        <form @submit.prevent="handleMinting">
            <label for="assetFile">Asset File:</label>
            <input id="assetFile" type="file" @change="handleFileChange" accept="image/*" required />
            <button type="submit" id="mintNFTButton">Mint NFT</button>
        </form>

        <p v-if="statusMessage">{{ statusMessage }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            file: null,
            statusMessage: '',
        };
    },
    methods: {
        /**
         * Handles the file input change event.
         * @param {Event} event - The file input change event.
         */
        handleFileChange(event) {
            this.file = event.target.files[0];
            this.$emit('file-change', this.file);
        },
        /**
         * Handles the form submission to mint the NFT.
         */
        handleMinting() {
            if (!this.file) {
                this.statusMessage = 'Please select a file before minting.';
                return;
            }

            this.statusMessage = '';
            // Emit the 'mint-nft' event with the selected file
            this.$emit('mint-nft', this.file);
        },
    },
};
</script>

<style scoped>
/* Add your styles here */
</style>