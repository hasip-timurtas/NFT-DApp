async function main() {
    const MhtNFT = await ethers.getContractFactory("MhtNFT");
    const deployedContract = await MhtNFT.deploy();
    console.log("MhtNFT deployed to:", deployedContract.target);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
