<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal">
            <h3>Transfer NFT</h3>
            <p>Token ID: {{ tokenId }}</p>
            <label for="recipientAddress">Recipient Address:</label>
            <input id="recipientAddress" type="text" placeholder="Enter recipient's wallet address"
                v-model="recipientAddress" />
            <button @click="confirmTransfer">Confirm Transfer</button>
            <button @click="$emit('close-modal')">Cancel</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["show", "tokenId"],
    data() {
        return {
            recipientAddress: "",
        };
    },
    methods: {
        confirmTransfer() {
            this.$emit("confirm-transfer", this.recipientAddress);
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
</style>