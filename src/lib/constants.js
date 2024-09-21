const nftContractAddress = '0x1501c2505f4e3c99931a7aa593f5a102ba202c4e'; // the one I uploaded to Sepolia testnet
const infuraProjectId = process.env.VUE_APP_INFURA_PROJECT_ID;
const pinataKey = process.env.VUE_APP_PINATA_KEY;
const pinataSecret = process.env.VUE_APP_PINATA_SECRET;

export {
  infuraProjectId,
  nftContractAddress,
  pinataKey,
  pinataSecret
}