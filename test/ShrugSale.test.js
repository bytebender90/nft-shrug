const ShrugToken = artifacts.require("ShrugToken");
const ShrugSale = artifacts.require("ShrugSale");
const USDT = artifacts.require("USDT");
const STMX = artifacts.require("STMX");
const ETHUSDTAggregator = artifacts.require("ETHUSDTAggregator");
const ETHSTMXAggregator = artifacts.require("ETHSTMXAggregator");

const { BN } = require("web3-utils");

contract("ShrugSale", (accounts) => {
    let shrugtoken_contract, shrugsale_contract, usdt_contract, stmx_contract, eth_usdt_aggregator_contract, eth_stmx_aggregator_contract;

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

        await USDT.new(
            { from: accounts[0] }
        ).then((instance) => {
            usdt_contract = instance;
        });
        await STMX.new(
            { from: accounts[0] }
        ).then((instance) => {
            stmx_contract = instance;
        });
        await ETHUSDTAggregator.new(
            { from: accounts[0] }
        ).then((instance) => {
            eth_usdt_aggregator_contract = instance;
        });
        await ETHSTMXAggregator.new(
            { from: accounts[0] }
        ).then((instance) => {
            eth_stmx_aggregator_contract = instance;
        });

        await shrugsale_contract.setUSDTTokenContract(usdt_contract.address);
        await shrugsale_contract.setSTMXTokenContract(stmx_contract.address);
        await shrugsale_contract.setETHUSDTAggregatorContract(eth_usdt_aggregator_contract.address);
        await shrugsale_contract.setETHSTMXAggregatorContract(eth_stmx_aggregator_contract.address);
    });

    describe("Sale", () => {
        it("buy is not working with insuffient balance", async () => {
            let value = new BN('10');
            let thrownError;
            try {
                await shrugsale_contract.buyInETH(
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
            let value = new BN(await shrugsale_contract.getPrice(2,0));

            const recipient1BeforeBalance = new BN(await web3.eth.getBalance(accounts[8]));
            const recipient2BeforeBalance = new BN(await web3.eth.getBalance(accounts[9]));

            await shrugsale_contract.buyInETH(
                2,
                { from: accounts[1], value }
            );

            const recipient1Balance = new BN(await web3.eth.getBalance(accounts[8]));
            const recipient2Balance = new BN(await web3.eth.getBalance(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(2), accounts[1]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')).toString());
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')).toString());
        });
        it("buy is working with correct balance", async () => {
            let value = new BN(await shrugsale_contract.getPrice(1,0));

            const recipient1BeforeBalance = new BN(await web3.eth.getBalance(accounts[8]));
            const recipient2BeforeBalance = new BN(await web3.eth.getBalance(accounts[9]));

            await shrugsale_contract.buyInETH(
                1,
                { from: accounts[3], value }
            );

            const recipient1Balance = new BN(await web3.eth.getBalance(accounts[8]));
            const recipient2Balance = new BN(await web3.eth.getBalance(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(3), accounts[3]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')).toString());
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')).toString());
        });
        it("buy is working with insuffient USDT", async () => {
            let value = new BN(await shrugsale_contract.getPrice(1,1));

            await usdt_contract.approve(shrugsale_contract.address, value, {from: accounts[1]});

            let thrownError;
            try {
                await shrugsale_contract.buyInUSDT(
                    1,
                    { from: accounts[1] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'ShrugSale: Caller does not have enough USDT balance',
            )
        });
        it("buy is working without approval", async () => {
            let thrownError;
            try {
                await shrugsale_contract.buyInUSDT(
                    1,
                    { from: accounts[0] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'ShrugSale: Caller has not allowed enough USDT balance',
            )
        });
        it("buy is working with USDT", async () => {
            let value = new BN(await shrugsale_contract.getPrice(1,1));

            const recipient1BeforeBalance = new BN(await usdt_contract.balanceOf(accounts[8]));
            const recipient2BeforeBalance = new BN(await usdt_contract.balanceOf(accounts[9]));

            await usdt_contract.approve(shrugsale_contract.address, value, {from: accounts[0]});
            await shrugsale_contract.buyInUSDT(
                1,
                { from: accounts[0] }
            );

            const recipient1Balance = new BN(await usdt_contract.balanceOf(accounts[8]));
            const recipient2Balance = new BN(await usdt_contract.balanceOf(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(4), accounts[0]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')));
        });
        it("buy is working with insuffient USDT", async () => {
            let value = new BN(await shrugsale_contract.getPrice(1,2));

            await stmx_contract.approve(shrugsale_contract.address, value, {from: accounts[1]});

            let thrownError;
            try {
                await shrugsale_contract.buyInSTMX(
                    1,
                    { from: accounts[1] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'ShrugSale: Caller does not have enough STMX balance',
            )
        });
        it("buy is working without approval", async () => {
            let thrownError;
            try {
                await shrugsale_contract.buyInSTMX(
                    1,
                    { from: accounts[0] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'ShrugSale: Caller has not allowed enough STMX balance',
            )
        });
        it("buy is working with STMX", async () => {
            let value = new BN(await shrugsale_contract.getPrice(5,2));

            const recipient1BeforeBalance = new BN(await stmx_contract.balanceOf(accounts[8]));
            const recipient2BeforeBalance = new BN(await stmx_contract.balanceOf(accounts[9]));

            await stmx_contract.approve(shrugsale_contract.address, value, {from: accounts[0]});
            await shrugsale_contract.buyInSTMX(
                5,
                { from: accounts[0] }
            );

            const recipient1Balance = new BN(await stmx_contract.balanceOf(accounts[8]));
            const recipient2Balance = new BN(await stmx_contract.balanceOf(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(5), accounts[0]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')));
        });
    });
});
