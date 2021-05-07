const ShrugToken = artifacts.require("ShrugToken");
const ShrugSale = artifacts.require("ShrugSale");

const { BN } = require("web3-utils");

contract("ShrugSale", (accounts) => {
    let shrugtoken_contract, shrugsale_contract;

    before(async () => {
        await ShrugToken.new(
            "Shrug Token",
            "Shrug",
            "https://ipfs.stormx.co/",
            { from: accounts[0] }
        ).then((instance) => {
            shrugtoken_contract = instance;
        });

        await ShrugSale.new(
            shrugtoken_contract.address,
            { from: accounts[0] }
        ).then((instance) => {
            shrugsale_contract = instance;
        });

        await shrugtoken_contract.addMinter(shrugsale_contract.address, {from: accounts[0]});
        await shrugsale_contract.setRecipients([
            accounts[8],
            accounts[9]
        ], {from: accounts[0]});
    });

    describe("Sale", () => {
        it("buy is not working with insuffient balance", async () => {
            let value = new BN('10');
            let thrownError;
            try {
                await shrugsale_contract.buy(
                    1,
                    { from: accounts[1], value }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'ShrugSale: Value is not same as the price',
            )
        });
        it("buy is working with correct balance", async () => {
            let value = new BN('21600000000000');

            const recipient1BeforeBalance = new BN(await web3.eth.getBalance(accounts[8]));
            const recipient2BeforeBalance = new BN(await web3.eth.getBalance(accounts[9]));

            await shrugsale_contract.buy(
                2,
                { from: accounts[1], value }
            );

            const recipient1Balance = new BN(await web3.eth.getBalance(accounts[8]));
            const recipient2Balance = new BN(await web3.eth.getBalance(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(2), accounts[1]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), new BN('10800000000000'));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), new BN('10800000000000'));
        });
        it("buy is working with correct balance", async () => {
            let value = new BN('64800000000000');

            const recipient1BeforeBalance = new BN(await web3.eth.getBalance(accounts[8]));
            const recipient2BeforeBalance = new BN(await web3.eth.getBalance(accounts[9]));

            await shrugsale_contract.buy(
                1,
                { from: accounts[3], value }
            );

            const recipient1Balance = new BN(await web3.eth.getBalance(accounts[8]));
            const recipient2Balance = new BN(await web3.eth.getBalance(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(3), accounts[3]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), new BN('32400000000000'));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), new BN('32400000000000'));
        });
    });
});
