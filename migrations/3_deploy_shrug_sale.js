const ShrugToken = artifacts.require("ShrugToken");
const ShrugSale = artifacts.require("ShrugSale");
const USDT = artifacts.require("USDT");
const STMX = artifacts.require("STMX");
const ETHUSDAggregator = artifacts.require("ETHUSDAggregator");
const STMXUSDAggregator = artifacts.require("STMXUSDAggregator");
const USDTUSDAggregator = artifacts.require("USDTUSDAggregator");
const secretMainnet = require("../secret.mainnet.json");
const secretTestnet = require("../secret.testnet.json");
const secretLocalnet = require("../secret.localnet.json");

module.exports = async function (deployer, network) {
    await deployer.deploy(
        ShrugSale,
        ShrugToken.address,
    );

    const shrugtoken_contract = await ShrugToken.deployed();
    const shrugsale_contract = await ShrugSale.deployed();

    await shrugtoken_contract.addMinter(ShrugSale.address);

    switch(network) {
        case "mainnet":
            await shrugsale_contract.setRecipients(
                [
                    secretMainnet.recipient1_address,
                    secretMainnet.recipient2_address,
                ]
            );
            await shrugsale_contract.setUSDTTokenContract(secretMainnet.usdt_token_address);
            await shrugsale_contract.setSTMXTokenContract(secretMainnet.stmx_token_address);
            await shrugsale_contract.setETHUSDAggregatorContract(secretMainnet.eth_usd_aggregator_address);
            await shrugsale_contract.setSTMXUSDAggregatorContract(secretMainnet.stmx_usd_aggregator_address);
            await shrugsale_contract.setUSDTUSDAggregatorContract(secretMainnet.usdt_usd_aggregator_address);
            break;
        case "testnet":
            await shrugsale_contract.setRecipients(
                [
                    secretTestnet.recipient1_address,
                    secretTestnet.recipient2_address,
                ]
            );
            await shrugsale_contract.setUSDTTokenContract(secretTestnet.usdt_token_address);
            await shrugsale_contract.setSTMXTokenContract(secretTestnet.stmx_token_address);
            await shrugsale_contract.setETHUSDAggregatorContract(secretTestnet.eth_usd_aggregator_address);

            await deployer.deploy(
                USDTUSDAggregator
            );
            await deployer.deploy(
                STMXUSDAggregator
            );

            const usdt_usd_aggregator_contract = await USDTUSDAggregator.deployed();
            const stmx_usd_aggregator_contract = await STMXUSDAggregator.deployed();

            await shrugsale_contract.setUSDTUSDAggregatorContract(usdt_usd_aggregator_contract.address);
            await shrugsale_contract.setSTMXUSDAggregatorContract(stmx_usd_aggregator_contract.address);
            break;
        default:
            await shrugsale_contract.setRecipients(
                [
                    secretLocalnet.recipient1_address,
                    secretLocalnet.recipient2_address,
                ]
            );
            
            await deployer.deploy(
                USDT
            );
            await deployer.deploy(
                STMX
            );
            await deployer.deploy(
                ETHUSDAggregator
            );
            await deployer.deploy(
                STMXUSDAggregator
            );
            await deployer.deploy(
                USDTUSDAggregator
            );

            const usdt_contract = await USDT.deployed();
            const stmx_contract = await STMX.deployed();

            const local_eth_usd_aggregator_contract = await ETHUSDAggregator.deployed();
            const local_stmx_usd_aggregator_contract = await STMXUSDAggregator.deployed();
            const local_usdt_usd_aggregator_contract = await USDTUSDAggregator.deployed();

            await shrugsale_contract.setUSDTTokenContract(usdt_contract.address);
            await shrugsale_contract.setSTMXTokenContract(stmx_contract.address);
            await shrugsale_contract.setETHUSDAggregatorContract(local_eth_usd_aggregator_contract.address);
            await shrugsale_contract.setUSDTUSDAggregatorContract(local_usdt_usd_aggregator_contract.address);
            await shrugsale_contract.setSTMXUSDAggregatorContract(local_stmx_usd_aggregator_contract.address);
    }
};
