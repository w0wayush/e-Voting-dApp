var Evoting = artifacts.require("./Migrations.sol");

module.exports = function (deployer) {
  deployer.deploy(Evoting);
};
