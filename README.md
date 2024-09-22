# MhtNFT - Customizable ERC721 NFT Smart Contract

## Project Overview

**MhtNFT** is a decentralized application (dApp) that allows users to mint, transfer, and view their own Non-Fungible Tokens (NFTs) on the Ethereum blockchain. The project includes a Solidity smart contract leveraging OpenZeppelin libraries and a Vue.js frontend for user interaction.

## Features

- **Mint NFTs**: Users can mint new NFTs by uploading an image, which gets stored on IPFS, and the token metadata is linked via a token URI.
- **Transfer NFTs**: Users can transfer their owned NFTs to another wallet address directly from the UI.
- **View Owned NFTs**: Users can view a gallery of NFTs they own, complete with images and token IDs.
- **Wallet Integration**: Seamless integration with MetaMask for Ethereum wallet connectivity.

## Technologies Used

- **Solidity**: Smart contract programming language.
- **OpenZeppelin Contracts**: Secure smart contract libraries for Ethereum.
- **Ethereum Blockchain**: Deployment platform for the smart contract.
- **Vue.js**: JavaScript framework for building the frontend user interface.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **Pinata/IPFS**: Decentralized storage for NFT assets.
- **MetaMask**: Ethereum wallet for interacting with the dApp.

## Prerequisites

- **Node.js** and **npm** installed on your machine.
- **MetaMask** extension installed in your browser.
- **Sepolia Test Network** ETH in your MetaMask wallet for testing.
- **Git** installed for cloning the repository.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hasip-timurtas/NFT-DApp.git
cd NFT-DApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setting Up Environment Variables
#### Blockchain Configuration

Create a .env file in the blockchain directory with the following content (For smart contract deployment):


```ini
ETH_PRIVATE_KEY=your_metamask_private_key
INFURA_API_KEY=your_infura_project_id
```
* PRIVATE_KEY: Your MetaMask account's private key (ensure this is a test account).
* INFURA_API_KEY: Your Infura project ID for connecting to the Ethereum network.

#### Frontend Configuration

Create a .env file in the frontend directory with the following content:

```ini
VUE_APP_PINATA_API_KEY=your_pinata_api_key
VUE_APP_PINATA_SECRET_API_KEY=your_pinata_secret_api_key
```

* VUE_APP_PINATA_API_KEY and VUE_APP_PINATA_SECRET_API_KEY: Your Pinata API credentials for uploading files to IPFS.

### 4. Deploying the Smart Contract

#### Using Hardhat

1. **Test the Contract**

   Navigate to the `blockchain` directory and compile the contract:

   ```bash
   npx hardhat test
   ```
1. **Compile the Contract**

   Navigate to the `blockchain` directory and compile the contract:

   ```bash
   npx hardhat compile
   ```
1. **deploy the Contract**

    Navigate to the `blockchain` directory and compile the contract:
     ```bash
   npx hardhat run deploy.js --network sepolia
   ```
   Note the contract address output after deployment.


#### Using Remix (Alternative)

1. Open [Remix IDE](https://remix.ethereum.org/).

2. Create a new file and paste your smart contract code.

3. Compile the contract using the compiler set to Solidity `0.8.0` (or the version used in your contract).

4. Deploy the contract:
   - Select **Injected Web3** as the environment to connect MetaMask.
   - Ensure MetaMask is connected to the Sepolia test network.
   - Click **Deploy** and confirm the transaction in MetaMask.

5. After deployment, copy the contract address.

### 5. Running the Frontend Application

Navigate to the `frontend` directory and start the development server:

```bash
npm run serve
```
Open your browser and navigate to http://localhost:8080 to view the application.

## Usage

### 1. Connect Your Wallet

- Click on the **Connect Wallet** button.
- MetaMask will prompt you to connect your account.

### 2. Minting an NFT

- Upload an image file using the **Asset File** input.
- Click the **Mint NFT** button.
- Wait for the transaction to be confirmed.
- Your NFT will appear in the **Your NFTs** section after minting.

### 3. Viewing Owned NFTs

- Click on **Load My NFTs** to fetch and display NFTs owned by your connected wallet.

### 4. Transferring an NFT

- In the **Your NFTs** section, click the **Transfer** button below the NFT you wish to transfer.
- A modal will appear prompting you to enter the recipient's wallet address.
- Enter the address and click **Confirm Transfer**.
- Wait for the transaction to be confirmed.

## Potential Improvements

- **Enhanced UI/UX**: Improve the frontend design for a better user experience.
- **Error Handling**: Implement more robust error handling and user notifications.
- **Batch Minting**: Add functionality to mint multiple NFTs in a single transaction.
- **Marketplace Integration**: Integrate with NFT marketplaces for listing and selling NFTs.
- **Smart Contract Optimization**: Optimize the contract for gas efficiency.

## License

This project is licensed under the **MIT License**.

---

Feel free to contribute to this project by submitting issues or pull requests.
