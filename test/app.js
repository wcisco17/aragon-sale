const CarteBlanche = artifacts.require('../contracts/CarteBlanche.sol')

contract('CarteBlanche', (accounts) => {
  let admin = accounts[0]
  let receiver = accounts[1]
  let tokenInstance;


  it('Has The Correct Fields, Name, Symbol, and Standard', () => {
    return CarteBlanche.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return tokenInstance.name()
      })
      .then((name) => {
        assert.equal(name, "Carte Blanche Token", "Has the correct name")
        return tokenInstance.symbol()
      })
      .then((symbol) => {
        assert.equal(symbol, "CB", "Has the correct Symbol")
        return tokenInstance.standard()
      })
      .then((standard) => {
        assert.equal(standard, "Carte Blanche Token v1.0", "Has the correct Standard")
      })
  })

  it('it allocates upon deployment', () => {
    return CarteBlanche.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      })
      .then((totalSupply) => {
        assert.equal(totalSupply.toNumber(), 1000000, "Sets the Total Supply to 1,000,000");
        return tokenInstance.balanceOf(admin)
      })
      .then((adminBalance) => {
        assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account')
      })
  })

  it("Emits transfers", () => {
    return CarteBlanche.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return tokenInstance.transfer.call(receiver, 9999999999999999, {
          from: admin
        })
      })
      .then(assert.fail).catch((error) => {
        assert(error.message.indexOf('revert') >= 0, 'Error message must contain revert');
        return tokenInstance.transfer.call(receiver, 250000, {
          from: admin
        })
      })
      .then((success) => {
        assert.equal(success, true, "It returns true")
        return tokenInstance.transfer(receiver, 250000, {
          from: admin
        })
      })
      .then((receipt) => {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
        assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
        assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
        assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
        return tokenInstance.balanceOf(accounts[1])
      })
      .then((balance) => {
        assert.equal(balance.toNumber(), 250000, 'Adds the amount to the receiving account');
        return tokenInstance.balanceOf(accounts[0])
      })
      .then((balance) => {
        assert.equal(balance.toNumber(), 750000, 'Deducts amount from sending account');
      })
  })
})