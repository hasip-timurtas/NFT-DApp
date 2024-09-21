async function main() {
    const MhtNFT = await ethers.getContractFactory("MhtNFT");
    const mhtNFT = await MhtNFT.deploy();
    console.log("MhtNFT deployed to:", mhtNFT.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
