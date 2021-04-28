const ShrugToken = artifacts.require("ShrugToken");

module.exports = function (deployer) {
    deployer.deploy(
        ShrugToken,
        "Shrug Token",
        "Shrug",
        "https://ipfs.stormx.co/",
    );
};
