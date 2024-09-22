<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <h3 id="modalTitle">Transfer NFT</h3>
            <p>Token ID: {{ tokenId }}</p>
            <label for="recipientAddress">Recipient Address:</label>
            <input id="recipientAddress" type="text" placeholder="Enter recipient's wallet address"
                v-model="recipientAddress" @input="validateAddress" :aria-invalid="!isAddressValid"
                aria-describedby="addressError" />
            <p v-if="!isAddressValid" id="addressError" class="error-message">
                Please enter a valid Ethereum address.
            </p>
            <button @click="confirmTransfer" :disabled="!isAddressValid">Confirm Transfer</button>
            <button @click="closeModal">Cancel / Done</button>
        </div>
    </div>
</template>

<script>
export default {
    /**
     * Component for transferring an NFT to another wallet.
     * @component
     * @prop {boolean} show - Determines whether the modal is visible.
     * @prop {string|number} tokenId - The ID of the token to transfer.
     * @emits confirm-transfer - Emitted when the user confirms the transfer.
     * @emits close-modal - Emitted when the user closes the modal.
     */
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        tokenId: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            recipientAddress: '',
            isAddressValid: true,
        };
    },
    methods: {
        /**
         * Validates the recipient Ethereum address.
         * Sets the isAddressValid flag accordingly.
         */
        validateAddress() {
            const regex = /^(0x)?[0-9a-fA-F]{40}$/;
            this.isAddressValid = regex.test(this.recipientAddress.trim());
        },
        /**
         * Emits the 'confirm-transfer' event with the recipient address.
         * Validates the address before emitting.
         */
        confirmTransfer() {
            if (this.isAddressValid) {
                this.$emit('confirm-transfer', this.recipientAddress.trim());
            } else {
                // Additional error handling if necessary
            }
        },
        /**
         * Emits the 'close-modal' event to close the modal.
         * Resets the form fields.
         */
        closeModal() {
            this.recipientAddress = '';
            this.isAddressValid = true;
            this.$emit('close-modal');
        },
    },
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    text-align: center;
}

.modal h3 {
    margin-bottom: 20px;
}

.modal button {
    margin-top: 20px;
    margin-right: 10px;
    padding: 10px 20px;
}

.modal input {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    box-sizing: border-box;
}

.error-message {
    color: red;
    font-size: 0.9em;
}
</style>