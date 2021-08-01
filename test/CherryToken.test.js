const { assert } = require("chai");

const CherryToken = artifacts.require('CherryToken');

contract('CherryToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.cherry = await CherryToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.cherry.mint(alice, 1000, { from: minter });
        assert.equal((await this.cherry.balanceOf(alice)).toString(), '1000');
    })
});
