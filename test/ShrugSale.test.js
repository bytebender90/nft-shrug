const ShrugToken = artifacts.require("ShrugToken");
const ShrugSale = artifacts.require("ShrugSale");
const USDT = artifacts.require("USDT");
const STMX = artifacts.require("STMX");
const ETHUSDAggregator = artifacts.require("ETHUSDAggregator");
const USDTUSDAggregator = artifacts.require("USDTUSDAggregator");
const STMXUSDAggregator = artifacts.require("STMXUSDAggregator");

const { BN } = require("web3-utils");

const calculatePrice = (
    totalSupply,
    currency
) => {
    const decimals = new BN('1000000000000000000');
    if(currency == 0)
        return  (decimals.mul(new BN(20477)).mul(new BN(totalSupply + 1).pow(new BN(11))).div(new BN('100000000000000000000000000000000'))).add(decimals.mul(new BN(2)).div(new BN(100)));

    if(currency == 1)
        return  ((decimals.mul(new BN(20477)).mul(new BN(totalSupply + 1).pow(new BN(11))).div(new BN('100000000000000000000000000000000'))).add(decimals.mul(new BN(2)).div(new BN(100)))).mul(new BN('250729030969')).div(new BN('100142638')).div(new BN('1000000000000'));
        
    return  (decimals.mul(new BN(20477)).mul(new BN(totalSupply + 1).pow(new BN(11))).div(new BN('100000000000000000000000000000000'))).add(decimals.mul(new BN(2)).div(new BN(100))).mul(new BN('250729030969')).div(new BN('2181088'));
}

contract("ShrugSale", (accounts) => {
    let shrugtoken_contract, shrugsale_contract, usdt_contract, stmx_contract, eth_usd_aggregator_contract,usdt_usd_aggregator_contract , stmx_usd_aggregator_contract;

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
        await ETHUSDAggregator.new(
            { from: accounts[0] }
        ).then((instance) => {
            eth_usd_aggregator_contract = instance;
        });
        await USDTUSDAggregator.new(
            { from: accounts[0] }
        ).then((instance) => {
            usdt_usd_aggregator_contract = instance;
        });
        await STMXUSDAggregator.new(
            { from: accounts[0] }
        ).then((instance) => {
            stmx_usd_aggregator_contract = instance;
        });
    });

    describe("Shrug Sale Setting", () => {
        it("setting USDT token contract is not working if the caller is not the owner", async () => {
            let thrownError;
            try {
                await shrugsale_contract.setUSDTTokenContract(
                    usdt_contract.address,
                    {from: accounts[1]}
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Ownable: caller is not the owner',
            )
        })
        it("setting USDT token contract is working if the caller is the owner", async () => {
            await shrugsale_contract.setUSDTTokenContract(
                usdt_contract.address,
                {from: accounts[0]}
            );
        })
        it("setting STMX token contract is not working if the caller is not the owner", async () => {
            let thrownError;
            try {
                await shrugsale_contract.setSTMXTokenContract(
                    stmx_contract.address,
                    {from: accounts[1]}
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Ownable: caller is not the owner',
            )
        })
        it("setting STMX token contract is working if the caller is the owner", async () => {
            await shrugsale_contract.setSTMXTokenContract(
                stmx_contract.address,
                {from: accounts[0]}
            );
        })
        it("setting ETH / USD aggregator contract is not working if the caller is not the owner", async () => {
            let thrownError;
            try {
                await shrugsale_contract.setETHUSDAggregatorContract(
                    eth_usd_aggregator_contract.address,
                    {from: accounts[1]}
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Ownable: caller is not the owner',
            )
        })
        it("setting ETH / USD aggregator contract is working if the caller is the owner", async () => {
            await shrugsale_contract.setETHUSDAggregatorContract(
                eth_usd_aggregator_contract.address,
                {from: accounts[0]}
            );
        })
        it("setting STMX / USD aggregator contract is not working if the caller is not the owner", async () => {
            let thrownError;
            try {
                await shrugsale_contract.setSTMXUSDAggregatorContract(
                    stmx_usd_aggregator_contract.address,
                    {from: accounts[1]}
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Ownable: caller is not the owner',
            )
        })
        it("setting STMX / USD aggregator contract is working if the caller is the owner", async () => {
            await shrugsale_contract.setSTMXUSDAggregatorContract(
                stmx_usd_aggregator_contract.address,
                {from: accounts[0]}
            );
        })
        it("setting USDT / USD aggregator contract is not working if the caller is not the owner", async () => {
            let thrownError;
            try {
                await shrugsale_contract.setUSDTUSDAggregatorContract(
                    usdt_usd_aggregator_contract.address,
                    {from: accounts[1]}
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Ownable: caller is not the owner',
            )
        })
        it("setting USDT / USD aggregator contract is working if the caller is the owner", async () => {
            await shrugsale_contract.setUSDTUSDAggregatorContract(
                usdt_usd_aggregator_contract.address,
                {from: accounts[0]}
            );
        })
        it("setting recipients is not working if the caller is not the owner", async () => {
            let thrownError;
            try {
                await shrugsale_contract.setRecipients([
                    accounts[8],
                    accounts[9]
                ], { from: accounts[1] });
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Ownable: caller is not the owner',
            )
        })
        it("setting recipients is working if the caller is the owner", async () => {
            await shrugsale_contract.setRecipients([
                accounts[8],
                accounts[9]
            ], { from: accounts[0] });
        })
        it("adding minter is not working if the caller is not the owner", async () => {
            let thrownError;
            try {
                await shrugtoken_contract.addMinter(shrugsale_contract.address, { from: accounts[1] });
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Ownable: caller is not the admin',
            )
        })
        it("adding minter is working if the caller is the owner", async () => {
            await shrugtoken_contract.addMinter(shrugsale_contract.address, { from: accounts[0] });;
        })
    })

    describe("Price List", () => {
        it("ETH", async () => {
            for (let i = 0; i < 500; i++) {
                let res = new BN(await shrugsale_contract.calculatePrice(i, 0));
                assert.equal(res.toString(), new BN(calculatePrice(i, 0)).toString())
            }
        });
        it("USDT", async () => {
            for (let i = 0; i < 500; i++) {
                let res = new BN(await shrugsale_contract.calculatePrice(i, 1));
                assert.equal(res.toString(), new BN(calculatePrice(i, 1)).toString())
            }
        });
        it("STMX", async () => {
            for (let i = 0; i < 500; i++) {
                let res = new BN(await shrugsale_contract.calculatePrice(i, 2));
                assert.equal(res.toString(), new BN(calculatePrice(i, 2)).toString())
            }
        });
    });

    describe("Shrug Token", () => {
        it("mint is not working if caller is not the sale contract", async () => {
            let thrownError;
            try {
                await shrugtoken_contract.mint(
                    accounts[9],
                    { from: accounts[8] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Ownable: caller is not the minter',
            )
        })
    })

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

            assert.equal(await shrugtoken_contract.ownerOf(500), accounts[1]);
            assert.equal(await shrugtoken_contract.ownerOf(499), accounts[1]);
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

            assert.equal(await shrugtoken_contract.ownerOf(498), accounts[3]);
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

            assert.equal(await shrugtoken_contract.ownerOf(497), accounts[0]);
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

            assert.equal(await shrugtoken_contract.ownerOf(496), accounts[0]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')));
        });
        it("buy is working with STMX", async () => {
            let value = new BN(await shrugsale_contract.getPrice(99,2));

            const recipient1BeforeBalance = new BN(await stmx_contract.balanceOf(accounts[8]));
            const recipient2BeforeBalance = new BN(await stmx_contract.balanceOf(accounts[9]));

            await stmx_contract.approve(shrugsale_contract.address, value, {from: accounts[0]});
            await shrugsale_contract.buyInSTMX(
                99,
                { from: accounts[0] }
            );

            const recipient1Balance = new BN(await stmx_contract.balanceOf(accounts[8]));
            const recipient2Balance = new BN(await stmx_contract.balanceOf(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(393), accounts[0]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')));
        });
        it("buy is working with STMX", async () => {
            let value = new BN(await shrugsale_contract.getPrice(99,2));

            const recipient1BeforeBalance = new BN(await stmx_contract.balanceOf(accounts[8]));
            const recipient2BeforeBalance = new BN(await stmx_contract.balanceOf(accounts[9]));

            await stmx_contract.approve(shrugsale_contract.address, value, {from: accounts[0]});
            await shrugsale_contract.buyInSTMX(
                99,
                { from: accounts[0] }
            );

            const recipient1Balance = new BN(await stmx_contract.balanceOf(accounts[8]));
            const recipient2Balance = new BN(await stmx_contract.balanceOf(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(294), accounts[0]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')));
        });
        it("buy is working with USDT", async () => {
            let value = new BN(await shrugsale_contract.getPrice(99,1));

            const recipient1BeforeBalance = new BN(await usdt_contract.balanceOf(accounts[8]));
            const recipient2BeforeBalance = new BN(await usdt_contract.balanceOf(accounts[9]));

            await usdt_contract.approve(shrugsale_contract.address, value, {from: accounts[0]});
            await shrugsale_contract.buyInUSDT(
                99,
                { from: accounts[0] }
            );

            const recipient1Balance = new BN(await usdt_contract.balanceOf(accounts[8]));
            const recipient2Balance = new BN(await usdt_contract.balanceOf(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(195), accounts[0]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')));
        });
        it("buy is working with USDT", async () => {
            let value = new BN(await shrugsale_contract.getPrice(99,1));

            const recipient1BeforeBalance = new BN(await usdt_contract.balanceOf(accounts[8]));
            const recipient2BeforeBalance = new BN(await usdt_contract.balanceOf(accounts[9]));

            await usdt_contract.approve(shrugsale_contract.address, value, {from: accounts[0]});
            await shrugsale_contract.buyInUSDT(
                99,
                { from: accounts[0] }
            );

            const recipient1Balance = new BN(await usdt_contract.balanceOf(accounts[8]));
            const recipient2Balance = new BN(await usdt_contract.balanceOf(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(96), accounts[0]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')));
        });
        it("buy is not working if there isn't enough token", async () => {
            let value = new BN(await shrugsale_contract.getPrice(96,1));

            await usdt_contract.approve(shrugsale_contract.address, value, {from: accounts[0]});

            let thrownError;
            try {
                await shrugsale_contract.buyInUSDT(
                    96,
                    { from: accounts[0] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'ShrugSale: All tokens are minted',
            )
        });
        it("buy is working with USDT", async () => {
            let value = new BN(await shrugsale_contract.getPrice(95,1));

            const recipient1BeforeBalance = new BN(await usdt_contract.balanceOf(accounts[8]));
            const recipient2BeforeBalance = new BN(await usdt_contract.balanceOf(accounts[9]));

            await usdt_contract.approve(shrugsale_contract.address, value, {from: accounts[0]});
            await shrugsale_contract.buyInUSDT(
                95,
                { from: accounts[0] }
            );

            const recipient1Balance = new BN(await usdt_contract.balanceOf(accounts[8]));
            const recipient2Balance = new BN(await usdt_contract.balanceOf(accounts[9]));

            assert.equal(await shrugtoken_contract.ownerOf(1), accounts[0]);
            assert.equal(recipient1Balance.sub(recipient1BeforeBalance).toString(), value.div(new BN('2')));
            assert.equal(recipient2Balance.sub(recipient2BeforeBalance).toString(), value.div(new BN('2')));
        });
    });
});
