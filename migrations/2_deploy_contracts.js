var CarteBlanche = artifacts.require('../contracts/CarteBlanche.sol')
var CarteBlancheSale = artifacts.require('../contracts/CarteBlancheSale.sol')


module.exports = function (deployer) {
  deployer.deploy(CarteBlanche, 1000000)
    .then(() => {
      const tokenPrice = 1000000000000000;
      return deployer.deploy(CarteBlancheSale, CarteBlanche.address, tokenPrice);
    })
}