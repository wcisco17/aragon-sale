const CarteBlancheSale = artifacts.require('../contracts/CarteBlancheSale.sol');
const CarteBlanche = artifacts.require('../contracts/CarteBlanche.sol');


contract("CarteBlancheSale", (accounts) => {
    let tokenSaleInstance;
    let tokenInstance;
    let admin = accounts[0];
    const buyer = accounts[1];
    let tokensAvailable = 750000;
    let tokenPrice = 1000000000000000; // wei
    let numberOfTokens;



    it("Initializes Contract with the correct values", () => {
        return CarteBlancheSale.deployed()
            .then((instance) => {
                tokenSaleInstance = instance;
                return tokenSaleInstance.address
            })
            .then((address) => {
                assert.notEqual(address, 0x0, "Has contract address")
                return tokenSaleInstance.tokenContract();
            })
            .then((address) => {
                assert.notEqual(address, 0x0, "Has tokenContract address")
                return tokenSaleInstance.tokenPrice();
            })
            .then((price) => {
                assert.equal(price, tokenPrice, "Token Price is correct");
            })
    })


    it("Token Purchases", () => {
        CarteBlanche.deployed()
            .then((instance) => {
                tokenInstance = instance;
                return CarteBlancheSale.deployed()
            })
            .then((instance) => {
                tokenSaleInstance = instance;
                // Allocates 75% of all tokens to token Sale
                return tokenInstance.transfer.call(tokenSaleInstance.address, tokensAvailable, {
                    from: admin
                })
            })
            .then((receipt) => {
                numberOfTokens = 10;
                return tokenSaleInstance.buyTokens(numberOfTokens, {
                    from: buyer,
                    value: numberOfTokens * tokenPrice
                })
            })
            .then((receipt) => {
                assert.equal(receipt.logs.length, 1, 'triggers one event');
                assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
                assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
                assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
                return tokenSaleInstance.tokensSold();
            })
            .then((amount) => {
                assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
                return tokenInstance.balanceOf(buyer);
            }).then((balance) => {
                assert.equal(balance.toNumber(), numberOfTokens);
                return tokenInstance.balanceOf(tokenSaleInstance.address);
            }).then((balance) => {
                assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
                // Try to buy tokens different from the ether value
                return tokenSaleInstance.buyTokens(numberOfTokens, {
                    from: buyer,
                    value: 1
                });
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
                return tokenSaleInstance.buyTokens(800000, {
                    from: buyer,
                    value: numberOfTokens * tokenPrice
                })
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
            });
    })

    it("Terminates Contract and Token Sale", () => {
        return CarteBlanche.deployed()
            .then((instance) => {
                tokenInstance = instance;
                return CarteBlancheSale.deployed();
            })
            .then((instance) => {
                tokenSaleInstance = instance;
                // Try to end sale other than admin
                return tokenSaleInstance.endSale({
                    from: buyer
                })
            })
            .then(assert.fail).catch((error) => {
                assert(error.message.indexOf("revert") >= 0, "Must be Admin to End Sale");
                //    End sale as admin
                return tokenSaleInstance.endSale({
                    from: admin
                })
            })
            .then((receipt) => {
                const bal = tokenInstance.balanceOf(admin)
                return bal
            })
            .then((receipt) => {
                return tokenInstance.balanceOf(admin)
            })
            .then((balance) => {
                assert(balance.toNumber() >= 999990, 'returns all unsold practice tokens to admin');
                // Check that the contract has no balance
                balance = web3.eth.getBalance(tokenSaleInstance.address)
                assert.equal(balance.toNumber(), 0)
            })
    })



})