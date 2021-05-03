const ShrugToken = artifacts.require("ShrugToken");
const ShrugSale = artifacts.require("ShrugSale");

module.exports = async function (deployer) {
    await deployer.deploy(
        ShrugSale,
        ShrugToken.address,
    );

    const shrugtoken_contract = await ShrugToken.deployed();

    await shrugtoken_contract.addMinter(ShrugSale.address);
};
