async function main() {
    const MhtNFT = await ethers.getContractFactory("MhtNFT");
    await MhtNFT.deploy();
    const address = await MhtNFT.getAddress()
    console.log("MhtNFT deployed to:", address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
