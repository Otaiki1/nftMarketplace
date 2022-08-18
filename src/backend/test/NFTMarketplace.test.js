
const { expect } = require('chai');

describe("NFTMarketplace", async() =>{
    let deployer, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    let URI = "SampleURI"
    beforeEach(async function(){
        

        //get Contract Fcactories
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");
    
        //Get Signers
        [deployer, addr1, addr2] = await ethers.getSigners();
        
        //Deploy Contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deployment", () => {
        it("Should track name and symbol of collection", async() => {
            expect(await nft.name()).to.equal("Dapp NFT");
            expect(await nft.symbol()).to.equal('DFT');
        })
        it("Should track feeAccount and feePercent of the collection", async() => {
            expect(await marketplace.feePercent()).to.equal(feePercent);
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
        })
    })
    describe("Minting NFTs", () => {
        it('should track each minted NFTs', async() =>{
            //when addr1 mints an nft
            await nft.connect(addr1).mint(URI);

            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            //when addr2 mints an nft
            await nft.connect(addr2).mint(URI);

            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })


})