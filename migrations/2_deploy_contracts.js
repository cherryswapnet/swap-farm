const SmartChef = artifacts.require("./SmartChef.sol");
//这里的"./Test.sol"其实还可以换成合约的名字
module.exports = function(deployer) {
  deployer.deploy(SmartChef);
};