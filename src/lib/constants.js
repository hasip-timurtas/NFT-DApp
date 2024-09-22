const nftContractAddress = '0xb97385e0cfc68acb0b0e70d4080ca3f747b9cd12'; // the contract I uploaded to Sepolia testnet
const infuraProjectId = process.env.VUE_APP_INFURA_PROJECT_ID;
const pinataKey = process.env.VUE_APP_PINATA_KEY;
const pinataSecret = process.env.VUE_APP_PINATA_SECRET;

export {
  infuraProjectId,
  nftContractAddress,
  pinataKey,
  pinataSecret
}