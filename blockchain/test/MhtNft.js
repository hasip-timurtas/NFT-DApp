const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MhtNFT", function () {
    let MhtNFT;
    let mhtNFT;
    let addr1;
    let addr2;

    beforeEach(async function () {
        MhtNFT = await ethers.getContractFactory("MhtNFT");
        [owner, addr1, addr2] = await ethers.getSigners();
        mhtNFT = await MhtNFT.deploy(); // Kontratı deploy ediyoruz

        // Bu noktada deployed fonksiyonuna gerek yok, Hardhat/ethers.js kontratı deploy ettiğinde otomatik olarak işlem tamamlanmış oluyor.
    });

    it("Should mint a new NFT and assign it to addr1", async function () {
        const tokenURI = "https://my-nft-metadata.com/1";
        const newItemId = await mhtNFT.mintNFT(addr1.address, tokenURI);

        expect(await mhtNFT.ownerOf(1)).to.equal(addr1.address);
        expect(await mhtNFT.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should allow transfer of the NFT", async function () {
        const tokenURI = "https://my-nft-metadata.com/1";
        await mhtNFT.mintNFT(addr1.address, tokenURI);

        await mhtNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
        expect(await mhtNFT.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should check total supply after minting", async function () {
        await mhtNFT.mintNFT(addr1.address, "https://my-nft-metadata.com/1");
        await mhtNFT.mintNFT(addr1.address, "https://my-nft-metadata.com/2");

        expect(await mhtNFT.totalSupply()).to.equal(2);
    });
});
