const { expectRevert, time } = require('@openzeppelin/test-helpers');
const CherryToken = artifacts.require('CherryToken');
const SyrupBar = artifacts.require('SyrupBar');
const MasterChef = artifacts.require('MasterChef');
const MockBEP20 = artifacts.require('libs/MockBEP20');

contract('MasterChef', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.cherry = await CherryToken.new({ from: minter });
        this.syrup = await SyrupBar.new(this.cherry.address, { from: minter });
        this.lp1 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
        this.lp2 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
        this.lp3 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
        this.chef = await MasterChef.new(this.cherry.address, this.syrup.address, dev, '1000', '100', { from: minter });
        await this.cherry.transferOwnership(this.chef.address, { from: minter });
        await this.syrup.transferOwnership(this.chef.address, { from: minter });

        await this.lp1.transfer(bob, '2000', { from: minter });
        await this.lp2.transfer(bob, '2000', { from: minter });
        await this.lp3.transfer(bob, '2000', { from: minter });

        await this.lp1.transfer(alice, '2000', { from: minter });
        await this.lp2.transfer(alice, '2000', { from: minter });
        await this.lp3.transfer(alice, '2000', { from: minter });
    });
    it('real case', async () => {
      this.lp4 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
      this.lp5 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
      this.lp6 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
      this.lp7 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
      this.lp8 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
      this.lp9 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
      await this.chef.add('2000', this.lp1.address, true, { from: minter });
      await this.chef.add('1000', this.lp2.address, true, { from: minter });
      await this.chef.add('500', this.lp3.address, true, { from: minter });
      await this.chef.add('500', this.lp4.address, true, { from: minter });
      await this.chef.add('500', this.lp5.address, true, { from: minter });
      await this.chef.add('500', this.lp6.address, true, { from: minter });
      await this.chef.add('500', this.lp7.address, true, { from: minter });
      await this.chef.add('100', this.lp8.address, true, { from: minter });
      await this.chef.add('100', this.lp9.address, true, { from: minter });
      assert.equal((await this.chef.poolLength()).toString(), "10");

      await time.advanceBlockTo('170');
      await this.lp1.approve(this.chef.address, '1000', { from: alice });
      assert.equal((await this.cherry.balanceOf(alice)).toString(), '0');
      await this.chef.deposit(1, '20', { from: alice });
      await this.chef.withdraw(1, '20', { from: alice });
      //每个区块产出1000个币,总共170-100个区块,那用户alice应该收到多少che?
      assert.equal((await this.cherry.balanceOf(alice)).toString(), '1403');
      // assert.equal((await this.cherry.balanceOf(alice)).toString(), '263');
      let aliceReward = await this.chef.getTotalProfit(alice);
      let allReward = await this.chef.getTotalProfit(alice);
      console.log('------------------alice reward is:',aliceReward.toString());
      //获取所有用户的统计数据.
      let allUserStaticData = await this.chef.getAccountsMinerList({ from: minter });
      console.log('统计产出数据!!!!!!!');
      console.log(allUserStaticData);
      await this.cherry.approve(this.chef.address, '1000', { from: alice });
      await this.chef.enterStaking('20', { from: alice });
      await this.chef.enterStaking('0', { from: alice });
      await this.chef.enterStaking('0', { from: alice });
      await this.chef.enterStaking('0', { from: alice });
      assert.equal((await this.cherry.balanceOf(alice)).toString(), '1383');
      // assert.equal((await this.cherry.balanceOf(alice)).toString(), '993');
      // assert.equal((await this.chef.getPoolPoint(0, { from: minter })).toString(), '1900');
    })


    // it('deposit/withdraw', async () => {
    //   await this.chef.add('1000', this.lp1.address, true, { from: minter });
    //   await this.chef.add('1000', this.lp2.address, true, { from: minter });
    //   await this.chef.add('1000', this.lp3.address, true, { from: minter });

    //   await this.lp1.approve(this.chef.address, '100', { from: alice });
    //   await this.chef.deposit(1, '20', { from: alice });
    //   await this.chef.deposit(1, '0', { from: alice });
    //   await this.chef.deposit(1, '40', { from: alice });
    //   await this.chef.deposit(1, '0', { from: alice });
    //   assert.equal((await this.lp1.balanceOf(alice)).toString(), '1940');
    //   await this.chef.withdraw(1, '10', { from: alice });
    //   assert.equal((await this.lp1.balanceOf(alice)).toString(), '1950');
    //   assert.equal((await this.cherry.balanceOf(alice)).toString(), '5331');
    //   // assert.equal((await this.cherry.balanceOf(alice)).toString(), '999');
    //   assert.equal((await this.cherry.balanceOf(dev)).toString(), '532');
    //   // assert.equal((await this.cherry.balanceOf(dev)).toString(), '100');

    //   await this.lp1.approve(this.chef.address, '100', { from: bob });
    //   assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
    //   await this.chef.deposit(1, '50', { from: bob });
    //   assert.equal((await this.lp1.balanceOf(bob)).toString(), '1950');
    //   await this.chef.deposit(1, '0', { from: bob });
    //   assert.equal((await this.cherry.balanceOf(bob)).toString(), '125');
    //   await this.chef.emergencyWithdraw(1, { from: bob });
    //   assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
    // })

    // it('staking/unstaking', async () => {
    //   await this.chef.add('1000', this.lp1.address, true, { from: minter });
    //   await this.chef.add('1000', this.lp2.address, true, { from: minter });
    //   await this.chef.add('1000', this.lp3.address, true, { from: minter });

    //   await this.lp1.approve(this.chef.address, '10', { from: alice });
    //   await this.chef.deposit(1, '2', { from: alice }); //0
    //   await this.chef.withdraw(1, '2', { from: alice }); //1

    //   await this.cherry.approve(this.chef.address, '250', { from: alice });
    //   await this.chef.enterStaking('240', { from: alice }); //3
    //   assert.equal((await this.syrup.balanceOf(alice)).toString(), '240');
    //   assert.equal((await this.cherry.balanceOf(alice)).toString(), '1093');
    //   // assert.equal((await this.cherry.balanceOf(alice)).toString(), '10');
    //   await this.chef.enterStaking('10', { from: alice }); //4
    //   assert.equal((await this.syrup.balanceOf(alice)).toString(), '250');
    //   assert.equal((await this.cherry.balanceOf(alice)).toString(), '1083');
    //   // assert.equal((await this.cherry.balanceOf(alice)).toString(), '249');
    //   await this.chef.leaveStaking(250);
    //   assert.equal((await this.syrup.balanceOf(alice)).toString(), '0');
    //   assert.equal((await this.cherry.balanceOf(alice)).toString(), '749');

    // });


    // it('updaate multiplier', async () => {
    //   await this.chef.add('1000', this.lp1.address, true, { from: minter });
    //   await this.chef.add('1000', this.lp2.address, true, { from: minter });
    //   await this.chef.add('1000', this.lp3.address, true, { from: minter });

    //   await this.lp1.approve(this.chef.address, '100', { from: alice });
    //   await this.lp1.approve(this.chef.address, '100', { from: bob });
    //   await this.chef.deposit(1, '100', { from: alice });
    //   await this.chef.deposit(1, '100', { from: bob });
    //   await this.chef.deposit(1, '0', { from: alice });
    //   await this.chef.deposit(1, '0', { from: bob });

    //   await this.cherry.approve(this.chef.address, '100', { from: alice });
    //   await this.cherry.approve(this.chef.address, '100', { from: bob });
    //   await this.chef.enterStaking('50', { from: alice });
    //   await this.chef.enterStaking('100', { from: bob });

    //   await this.chef.updateMultiplier('0', { from: minter });

    //   await this.chef.enterStaking('0', { from: alice });
    //   await this.chef.enterStaking('0', { from: bob });
    //   await this.chef.deposit(1, '0', { from: alice });
    //   await this.chef.deposit(1, '0', { from: bob });

    //   assert.equal((await this.cherry.balanceOf(alice)).toString(), '2616');
    //   // assert.equal((await this.cherry.balanceOf(alice)).toString(), '700');
    //   assert.equal((await this.cherry.balanceOf(bob)).toString(), '1233');
    //   // assert.equal((await this.cherry.balanceOf(bob)).toString(), '150');

    //   await time.advanceBlockTo('265');

    //   await this.chef.enterStaking('0', { from: alice });
    //   await this.chef.enterStaking('0', { from: bob });
    //   await this.chef.deposit(1, '0', { from: alice });
    //   await this.chef.deposit(1, '0', { from: bob });

    //   assert.equal((await this.cherry.balanceOf(alice)).toString(), '700');
    //   assert.equal((await this.cherry.balanceOf(bob)).toString(), '150');

    //   await this.chef.leaveStaking('50', { from: alice });
    //   await this.chef.leaveStaking('100', { from: bob });
    //   await this.chef.withdraw(1, '100', { from: alice });
    //   await this.chef.withdraw(1, '100', { from: bob });

    // });

    // it('should allow dev and only dev to update dev', async () => {
    //     assert.equal((await this.chef.devaddr()).valueOf(), dev);
    //     await expectRevert(this.chef.dev(bob, { from: bob }), 'dev: wut?');
    //     await this.chef.dev(bob, { from: dev });
    //     assert.equal((await this.chef.devaddr()).valueOf(), bob);
    //     await this.chef.dev(alice, { from: bob });
    //     assert.equal((await this.chef.devaddr()).valueOf(), alice);
    // })
});
