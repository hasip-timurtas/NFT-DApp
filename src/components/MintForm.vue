<template>
    <div>
        <h1 id="pageTitle">NFT Minting Tool</h1>
        <p>Upload an image and click "Mint" to create your NFT.</p>

        <form @submit.prevent="handleMinting">
            <label for="assetFile">Asset File:</label>
            <input id="assetFile" type="file" @change="handleFileChange" />
            <button type="submit" id="mintNFTButton">Mint NFT</button>
        </form>
    </div>
</template>

<script>
export default {
    methods: {
        handleFileChange(event) {
            this.$emit("file-change", event.target.files[0]);
        },
        handleMinting() {
            this.$emit("mint-nft");
        },
    },
};
</script>