<template>
    <button id="walletButton" @click="handleWalletConnection"
        :aria-label="walletAddress ? 'Wallet connected' : 'Connect wallet'">
        {{ buttonText }}
    </button>
</template>

<script>
export default {
    /**
     * Component for displaying and handling wallet connection.
     * @component
     * @prop {string|null} walletAddress - The connected wallet address, or null if not connected.
     * @emits connect-wallet - Emitted when the user clicks the button to connect the wallet.
     */
    props: {
        walletAddress: {
            type: String,
            default: null,
        },
    },
    computed: {
        /**
         * Computes the button text based on the wallet connection status.
         * @returns {string} The button text.
         */
        buttonText() {
            if (this.walletAddress) {
                const start = this.walletAddress.slice(0, 6);
                const end = this.walletAddress.slice(-4);
                return `Connected: ${start}...${end}`;
            }
            return 'Connect Wallet';
        },
    },
    methods: {
        /**
         * Emits the 'connect-wallet' event when the button is clicked.
         */
        handleWalletConnection() {
            this.$emit('connect-wallet');
        },
    },
};
</script>

<style scoped></style>