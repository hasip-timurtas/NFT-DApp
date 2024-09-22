<template>
    <div>
        <h2 id="ownedNftsTitle">Your NFTs</h2>
        <button @click="$emit('load-nfts')">Load My NFTs</button>
        <div class="owned-nfts" v-if="nfts && nfts.length > 0">
            <div class="nft" v-for="nft in nfts" :key="nft.tokenId">
                <img :src="nft.tokenURI" />
                <p>Token ID: {{ nft.tokenId }}</p>
                <button @click="$emit('transfer-nft', nft.tokenId)">Transfer</button>
            </div>
        </div>
        <p v-else>No NFTs found for this wallet.</p>
    </div>
</template>

<script>
export default {
    props: ["nfts"],
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