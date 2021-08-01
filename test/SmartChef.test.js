const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const CakeToken = artifacts.require('CakeToken');
const SmartChef = artifacts.require('SmartChef');
const MockBEP20 = artifacts.require('libs/MockBEP20');
const WOKT = artifacts.require('libs/WOKT');


contract('SmartStaking.......', async ([alice, bob, admin, dev, minter]) => {
  beforeEach(async () => {
    this.rewardToken = await CakeToken.new({ from: minter });
    this.lpToken = await MockBEP20.new('LPToken', 'LP1', '1000000', {
      from: minter,
    });

    this.wOKT = await WOKT.new({ from: minter });
    this.smartChef = await SmartChef.new(
      this.wOKT.address,//存入的币

      this.rewardToken.address,//产出的币
      1000,//每个区块产出,生产需要填1000*1e18
      10,//开始奖励区块
      1010,//结束奖励区块
      { from: minter }
    );
    //增发奖励币给智能合约100000个
    await this.rewardToken.mint(this.smartChef.address, 100000, { from: minter });
  });

  it('deposit/withdraw', async () => {
    //走到前第十区块
    await time.advanceBlockTo('10');
    await this.wOKT.approve(this.smartChef.address, '100', { from: alice });
    await this.smartChef.deposit('100',{from: alice});
    await this.smartChef.deposit('100',{from: bob});
    assert.equal(
      (await this.wOKT.balanceOf(this.smartChef.address)).toString(),
      '300'
    );
    assert.equal((await this.smartChef.pendingReward(alice)).toString(), '1000');
    await this.smartChef.deposit({ from: alice, value: 300 });
    assert.equal((await this.smartChef.pendingReward(alice)).toString(), '0');
    assert.equal((await this.rewardToken.balanceOf(alice)).toString(), '1333');
    await this.smartChef.withdraw('100', { from: alice });
    assert.equal(

      (await this.wOKT.balanceOf(this.smartChef.address)).toString(),
      '500'
    );
    await this.smartChef.emergencyRewardWithdraw(1000, { from: minter });
    assert.equal((await this.smartChef.pendingReward(bob)).toString(), '1399');
  });

  it('should block man who in blanklist', async () => {
    await this.smartChef.setBlackList(alice, { from: admin });
    await expectRevert(
      this.smartChef.deposit({ from: alice, value: 100 }),
      'in black list'
    );
    await this.smartChef.removeBlackList(alice, { from: admin });
    await this.smartChef.deposit({ from: alice, value: 100 });
    await this.smartChef.setAdmin(dev, { from: minter });
    await expectRevert(
      this.smartChef.setBlackList(alice, { from: admin }),
      'admin: wut?'
    );
  });

  it('emergencyWithdraw', async () => {
    await this.smartChef.deposit({ from: alice, value: 100 });
    await this.smartChef.deposit({ from: bob, value: 200 });
    assert.equal(

      (await this.wOKT.balanceOf(this.smartChef.address)).toString(),
      '300'
    );
    await this.smartChef.emergencyWithdraw({ from: alice });
    assert.equal(
      (await this.wOKT.balanceOf(this.smartChef.address)).toString(),
      '200'
    );
    assert.equal((await this.wOKT.balanceOf(alice)).toString(), '100');
  });

  it('emergencyRewardWithdraw', async () => {
    await expectRevert(
      this.smartChef.emergencyRewardWithdraw(100, { from: alice }),
      'caller is not the owner'
    );
    await this.smartChef.emergencyRewardWithdraw(1000, { from: minter });
    assert.equal((await this.rewardToken.balanceOf(minter)).toString(), '1000');
  });

  it('setLimitAmount', async () => {
    await this.smartChef.setLimitAmount('1000000', { from: minter });
    await expectRevert(
      this.smartChef.deposit({ from: alice, value: 100000000 }),
      'exceed the to'
    );
  });
});
