const ShrugToken = artifacts.require("ShrugToken");

contract("ShrugToken", (accounts) => {
    var shrugtoken_contract;

    before(async () => {
        await ShrugToken.new(
            "Shrug Token",
            "Shrug",
            "https://ipfs.stormx.co/",
            { from: accounts[0] }
        ).then((instance) => {
            shrugtoken_contract = instance;
        });
    });

    const mint = async (minter, tokenId) => {
        await shrugtoken_contract.mint(
            minter,
            tokenId,
            { from: minter }
        );
    };

    describe("Mint", () => {
        it("mint", async () => {
            await shrugtoken_contract.addMinter(accounts[1], {from: accounts[0]});
            await mint(accounts[1], 5);
            console.log(await shrugtoken_contract.getBaseURI());
            console.log(await shrugtoken_contract.tokenURI(5));
        });
    });
});
