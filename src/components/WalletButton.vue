<template>
    <button id="walletButton" @click="handleWalletConnection">
        {{
            walletAddress
                ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : "Connect Wallet"
        }}
    </button>
</template>

<script>
export default {
    props: ["walletAddress"],
    methods: {
        handleWalletConnection() {
            this.$emit("connect-wallet");
        },
    },
};
</script>