const ShrugToken = artifacts.require("ShrugToken");
const ShrugSale = artifacts.require("ShrugSale");
const USDT = artifacts.require("USDT");
const STMX = artifacts.require("STMX");
const ETHUSDTAggregator = artifacts.require("ETHUSDTAggregator");
const ETHSTMXAggregator = artifacts.require("ETHSTMXAggregator");
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
            await shrugsale_contract.setETHUSDTAggregatorContract(secretMainnet.eth_usdt_aggregator_address);
            await shrugsale_contract.setETHSTMXAggregatorContract(secretMainnet.eth_stmx_aggregator_address);
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
            await shrugsale_contract.setETHUSDTAggregatorContract(secretTestnet.eth_usdt_aggregator_address);
            await shrugsale_contract.setETHSTMXAggregatorContract(secretTestnet.eth_stmx_aggregator_address);
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
                ETHUSDTAggregator
            );
            await deployer.deploy(
                ETHSTMXAggregator
            );

            const usdt_contract = await USDT.deployed();
            const stmx_contract = await STMX.deployed();
            const eth_usdt_aggregator_contract = await ETHUSDTAggregator.deployed();
            const eth_stmx_aggregator_contract = await ETHSTMXAggregator.deployed();

            await shrugsale_contract.setUSDTTokenContract(usdt_contract.address);
            await shrugsale_contract.setSTMXTokenContract(stmx_contract.address);
            await shrugsale_contract.setETHUSDTAggregatorContract(eth_usdt_aggregator_contract.address);
            await shrugsale_contract.setETHSTMXAggregatorContract(eth_stmx_aggregator_contract.address);
    }
};
