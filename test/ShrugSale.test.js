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
    });

    describe("Sale", () => {
        it("buy is not working with insuffient balance", async () => {
            let value = new BN('10');
            let thrownError;
            try {
                await shrugsale_contract.buy(
                    { from: accounts[1], value }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'ShrugSale.buy: Value is not same as the price',
            )
        });
        it("buy is working with correct balance", async () => {
            let value = new BN('1000000000000000000');

            await shrugsale_contract.buy(
                { from: accounts[1], value }
            );

            assert.equal(await shrugtoken_contract.ownerOf(0), accounts[1]);
        });
        it("buy is working with correct balance", async () => {
            let value = new BN('4000000000000000000');

            await shrugsale_contract.buy(
                { from: accounts[2], value }
            );

            assert.equal(await shrugtoken_contract.ownerOf(1), accounts[2]);
        });
        it("buy is working with correct balance", async () => {
            let value = new BN('9000000000000000000');

            await shrugsale_contract.buy(
                { from: accounts[3], value }
            );

            assert.equal(await shrugtoken_contract.ownerOf(2), accounts[3]);
        });
        it("sell is not working if caller is not the owner", async () => {
            let thrownError;
            try {
                await shrugsale_contract.sell(
                    0,
                    { from: accounts[9] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'ShrugSale.sell: Caller is not the owner',
            )
        });
        it("sell is working", async () => {
            let beforeBalance  = new BN(await web3.eth.getBalance(accounts[1]));

            const receipt = await shrugsale_contract.sell(
                0,
                { from: accounts[1] }
            );
            let afterBalance  = new BN(await web3.eth.getBalance(accounts[1]));
            const tx = await web3.eth.getTransaction(receipt.tx);
            const gasFee = new BN(receipt.receipt.gasUsed).mul(new BN(tx.gasPrice));

            assert.equal(afterBalance.sub(beforeBalance).add(gasFee).toString(), new BN('9000000000000000000').toString());
        });
        it("sell is working", async () => {
            let beforeBalance  = new BN(await web3.eth.getBalance(accounts[2]));
            
            const receipt = await shrugsale_contract.sell(
                1,
                { from: accounts[2] }
            );
            let afterBalance  = new BN(await web3.eth.getBalance(accounts[2]));
            const tx = await web3.eth.getTransaction(receipt.tx);
            const gasFee = new BN(receipt.receipt.gasUsed).mul(new BN(tx.gasPrice));

            assert.equal(afterBalance.sub(beforeBalance).add(gasFee).toString(), new BN('4000000000000000000').toString());
        });
        it("sell is working", async () => {
            let value = new BN('4000000000000000000');

            await shrugsale_contract.buy(
                { from: accounts[4], value }
            );

            assert.equal(await shrugtoken_contract.ownerOf(3), accounts[4]);
        });
    });
});
