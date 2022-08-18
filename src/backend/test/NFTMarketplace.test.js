
const { expect } = require('chai');
const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num.toString());

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
    describe("Making marketplace items", () => {
        beforeEach(async() => {
            //addr1 mints an nft
            await nft.connect(addr1).mint(URI);
            //addr1 approves marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
        })
        it("Should track newly created item, transfer nft from seller to market and emit offered event", async() => {
            //addr1 offers their nft at a price of 1 ether
            await expect(marketplace.connect(addr1).createItem(nft.address, 1, toWei(1))).
            to.emit(marketplace, "Offered").
            withArgs(
                1,
                nft.address,
                1,
                toWei(1),
                addr1.address
            )
            //New owner of the nft should be the marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            //Item count should now equal one
            expect(await marketplace.itemCount()).to.equal(1);
            //get Item form item mappings and check if it is correct
            const item =await marketplace.items(1);
            expect(item.itemId).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(1));
            expect(item.seller).to.equal(addr1.address);
            expect(item.sold).to.equal(false);
        })
        //write for failed scenario 
        it("Should revert if amount is zero", async() => {
            await expect(marketplace.connect(addr1).createItem(nft.address, 1, 0)).
            to.be.revertedWith("Price Must be greater than 0");
        })
        
    })


})