const nftContractAddress = '0x4eac82370f75f1b1d29b0fbdba0710e995a7d14b'; // the contract I uploaded to Sepolia testnet
const infuraProjectId = process.env.VUE_APP_INFURA_PROJECT_ID;
const pinataKey = process.env.VUE_APP_PINATA_KEY;
const pinataSecret = process.env.VUE_APP_PINATA_SECRET;

export {
  infuraProjectId,
  nftContractAddress,
  pinataKey,
  pinataSecret
}