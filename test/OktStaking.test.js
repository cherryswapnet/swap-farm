const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const CherryToken = artifacts.require('CherryToken');
<<<<<<< 01b062dac61ee1770d6bf00e6e2eb795773b1b53
const OktStaking = artifacts.require('OktStaking');
const MockBEP20 = artifacts.require('libs/MockBEP20');
const WOKT = artifacts.require('libs/WOKT');

contract('OktStaking.......', async ([alice, bob, admin, dev, minter]) => {
=======
const OktStaking = artifacts.require('OktStaking');
const MockBEP20 = artifacts.require('libs/MockBEP20');
const WOKT = artifacts.require('libs/WOKT');

contract('OktStaking.......', async ([alice, bob, admin, dev, minter]) => {
>>>>>>> second commit
  beforeEach(async () => {
    this.rewardToken = await CherryToken.new({ from: minter });
    this.lpToken = await MockBEP20.new('LPToken', 'LP1', '1000000', {
      from: minter,
    });
<<<<<<< 01b062dac61ee1770d6bf00e6e2eb795773b1b53
    this.wOKT = await WOKT.new({ from: minter });
    this.oktChef = await OktStaking.new(
      this.wOKT.address,
=======
    this.wOKT = await WOKT.new({ from: minter });
    this.oktChef = await OktStaking.new(
      this.wOKT.address,
>>>>>>> second commit
      this.rewardToken.address,
      1000,
      10,
      1010,
      admin,
<<<<<<< 01b062dac61ee1770d6bf00e6e2eb795773b1b53
      this.wOKT.address,
      { from: minter }
    );
    await this.rewardToken.mint(this.oktChef.address, 100000, { from: minter });
=======
      this.wOKT.address,
      { from: minter }
    );
    await this.rewardToken.mint(this.oktChef.address, 100000, { from: minter });
>>>>>>> second commit
  });

  it('deposit/withdraw', async () => {
    await time.advanceBlockTo('10');
<<<<<<< 01b062dac61ee1770d6bf00e6e2eb795773b1b53
    await this.oktChef.deposit({ from: alice, value: 100 });
    await this.oktChef.deposit({ from: bob, value: 200 });
    assert.equal(
      (await this.wOKT.balanceOf(this.oktChef.address)).toString(),
      '300'
    );
    assert.equal((await this.oktChef.pendingReward(alice)).toString(), '1000');
    await this.oktChef.deposit({ from: alice, value: 300 });
    assert.equal((await this.oktChef.pendingReward(alice)).toString(), '0');
    assert.equal((await this.rewardToken.balanceOf(alice)).toString(), '1333');
    await this.oktChef.withdraw('100', { from: alice });
    assert.equal(
      (await this.wOKT.balanceOf(this.oktChef.address)).toString(),
      '500'
    );
    await this.oktChef.emergencyRewardWithdraw(1000, { from: minter });
    assert.equal((await this.oktChef.pendingReward(bob)).toString(), '1399');
  });

  it('should block man who in blanklist', async () => {
    await this.oktChef.setBlackList(alice, { from: admin });
    await expectRevert(
      this.oktChef.deposit({ from: alice, value: 100 }),
      'in black list'
    );
    await this.oktChef.removeBlackList(alice, { from: admin });
    await this.oktChef.deposit({ from: alice, value: 100 });
    await this.oktChef.setAdmin(dev, { from: minter });
    await expectRevert(
      this.oktChef.setBlackList(alice, { from: admin }),
=======
    await this.oktChef.deposit({ from: alice, value: 100 });
    await this.oktChef.deposit({ from: bob, value: 200 });
    assert.equal(
      (await this.wOKT.balanceOf(this.oktChef.address)).toString(),
      '300'
    );
    assert.equal((await this.oktChef.pendingReward(alice)).toString(), '1000');
    await this.oktChef.deposit({ from: alice, value: 300 });
    assert.equal((await this.oktChef.pendingReward(alice)).toString(), '0');
    assert.equal((await this.rewardToken.balanceOf(alice)).toString(), '1333');
    await this.oktChef.withdraw('100', { from: alice });
    assert.equal(
      (await this.wOKT.balanceOf(this.oktChef.address)).toString(),
      '500'
    );
    await this.oktChef.emergencyRewardWithdraw(1000, { from: minter });
    assert.equal((await this.oktChef.pendingReward(bob)).toString(), '1399');
  });

  it('should block man who in blanklist', async () => {
    await this.oktChef.setBlackList(alice, { from: admin });
    await expectRevert(
      this.oktChef.deposit({ from: alice, value: 100 }),
      'in black list'
    );
    await this.oktChef.removeBlackList(alice, { from: admin });
    await this.oktChef.deposit({ from: alice, value: 100 });
    await this.oktChef.setAdmin(dev, { from: minter });
    await expectRevert(
      this.oktChef.setBlackList(alice, { from: admin }),
>>>>>>> second commit
      'admin: wut?'
    );
  });

  it('emergencyWithdraw', async () => {
<<<<<<< 01b062dac61ee1770d6bf00e6e2eb795773b1b53
    await this.oktChef.deposit({ from: alice, value: 100 });
    await this.oktChef.deposit({ from: bob, value: 200 });
    assert.equal(
      (await this.wOKT.balanceOf(this.oktChef.address)).toString(),
      '300'
    );
    await this.oktChef.emergencyWithdraw({ from: alice });
    assert.equal(
      (await this.wOKT.balanceOf(this.oktChef.address)).toString(),
      '200'
    );
    assert.equal((await this.wOKT.balanceOf(alice)).toString(), '100');
=======
    await this.oktChef.deposit({ from: alice, value: 100 });
    await this.oktChef.deposit({ from: bob, value: 200 });
    assert.equal(
      (await this.wOKT.balanceOf(this.oktChef.address)).toString(),
      '300'
    );
    await this.oktChef.emergencyWithdraw({ from: alice });
    assert.equal(
      (await this.wOKT.balanceOf(this.oktChef.address)).toString(),
      '200'
    );
    assert.equal((await this.wOKT.balanceOf(alice)).toString(), '100');
>>>>>>> second commit
  });

  it('emergencyRewardWithdraw', async () => {
    await expectRevert(
<<<<<<< 01b062dac61ee1770d6bf00e6e2eb795773b1b53
      this.oktChef.emergencyRewardWithdraw(100, { from: alice }),
      'caller is not the owner'
    );
    await this.oktChef.emergencyRewardWithdraw(1000, { from: minter });
=======
      this.oktChef.emergencyRewardWithdraw(100, { from: alice }),
      'caller is not the owner'
    );
    await this.oktChef.emergencyRewardWithdraw(1000, { from: minter });
>>>>>>> second commit
    assert.equal((await this.rewardToken.balanceOf(minter)).toString(), '1000');
  });

  it('setLimitAmount', async () => {
<<<<<<< 01b062dac61ee1770d6bf00e6e2eb795773b1b53
    // set limit to 1e-12 OKT
    await this.oktChef.setLimitAmount('1000000', { from: minter });
    await expectRevert(
      this.oktChef.deposit({ from: alice, value: 100000000 }),
=======
    // set limit to 1e-12 OKT
    await this.oktChef.setLimitAmount('1000000', { from: minter });
    await expectRevert(
      this.oktChef.deposit({ from: alice, value: 100000000 }),
>>>>>>> second commit
      'exceed the to'
    );
  });
});
