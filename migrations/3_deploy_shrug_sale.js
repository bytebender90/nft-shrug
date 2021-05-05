const ShrugToken = artifacts.require("ShrugToken");
const ShrugSale = artifacts.require("ShrugSale");
const secret = require("../secret.json");
const secretTestnet = require("../secret.testnet.json");

module.exports = async function (deployer, network) {
    await deployer.deploy(
        ShrugSale,
        ShrugToken.address,
    );

    const shrugtoken_contract = await ShrugToken.deployed();
    const shrugsale_contract = await ShrugSale.deployed();

    await shrugtoken_contract.addMinter(ShrugSale.address);

    if (network == "mainnet") {
        await shrugsale_contract.setRecipients(
            [
                secret.recipient1_address,
                secret.recipient2_address,
            ]
        );
    } else {
        await shrugsale_contract.setRecipients(
            [
                secretTestnet.recipient1_address,
                secretTestnet.recipient2_address,
            ]
        );
    }
};
