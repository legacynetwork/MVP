const Legacy = artifacts.require("Legacy");


contract('Legacy basic test', async (accounts) => {

  it("should check PoL be true", async () => {
    let instance = await Legacy.deployed();
    let proof_of_life = await instance.getProofOfLife.call();
    assert.equal(proof_of_life.valueOf(), true);
  });

  it("should check PoL timer length be equivalent to 90 days (as set in deployment)", async () => {
    let instance = await Legacy.deployed();
    let tPoL = await instance.tPoL();
    let expected_tPoL = 90 * 24 * 3600;
    assert.equal(tPoL.valueOf(), expected_tPoL);
  });

  it("should check PoL timer reset", async () => {
    let instance = await Legacy.deployed();
    let tBefore = await instance.tZero();
    let tPoL = await instance.tPoL();
    let expected_tAfter = tBefore.toNumber() + tPoL.toNumber();
    await instance.giveProofOfLife();
    let tAfter = await instance.tZero();
    assert.equal(tAfter.toNumber(), expected_tAfter);
  });

  it("should check PoL timer length be correctly set", async () => {
    let instance = await Legacy.deployed();
    await instance.setPoLTimerLength(120); // sets tPoL to 120 days
    let expected_tPoL = 120 * 24 * 3600;
    let tPoLAfter = await instance.tPoL();
    assert.equal(tPoLAfter.toNumber(), expected_tPoL);
  });

  it("should not be able to claim funds", async () => {
    let instance = await Legacy.deployed();
    try {
      await instance.claimFunds(accounts[0]);
      assert.fail("Transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
  });

  // TODO: check claimFunds() when ProofOfLife = false (ie, when funds can actually be claimed)

  it("should be able to receive ether", async () => {
    let instance = await Legacy.deployed();
    let balanceBefore = await web3.eth.getBalance(instance.address);
    await instance.send(web3.toWei(1, "ether"));
    let balanceAfter = await web3.eth.getBalance(instance.address);
    assert.equal(balanceAfter.toNumber(), balanceBefore.toNumber() + web3.toWei(1, "ether"));
  });

  it("should be able to withdraw ether", async () => {
    let instance = await Legacy.deployed();
    await instance.send(web3.toWei(1, "ether"));
    let balanceBefore = await web3.eth.getBalance(accounts[0]);
    let txValue = web3.toWei(1, "ether");
    await instance.withdraw(txValue);
    let balanceAfter = await web3.eth.getBalance(accounts[0]);
    // balance is below because of gas usage
    assert.isBelow(balanceAfter.toNumber(), balanceBefore.toNumber() + parseInt(txValue, 10));
  });

  it("should be able to add beneficiaries", async () => {
    let instance = await Legacy.deployed();
    let messageAdds = ["0x7d5a99f603f231d53a4f39d1521f98d2e8bb279cf29bebfd0687dc98458e7f89",
    	"0x5d5a29f603f231d53a4f39d1521f98d2e8bb279cf29bebfd0687dc98458e7f80"];
    let beneficiaries = [accounts[1], accounts[2]];
    await instance.addBeneficiaries(beneficiaries, messageAdds);
    let newBenefAdd1  = await instance.beneficiaryData.call(accounts[1]);
    let newBenefAdd2  = await instance.beneficiaryData.call(accounts[2]);
    assert.equal(newBenefAdd1.valueOf(), messageAdds[0], "Unexpected message address");
    assert.equal(newBenefAdd2.valueOf(), messageAdds[1], "Unexpected message address");
  });  

  it("should check beneficiary exists", async () => {
    let instance = await Legacy.deployed();
    let isBeneficiary = await instance.isBeneficiary.call(accounts[1]);
    assert.equal(isBeneficiary, true); 
  });

  it("should be able to delete a beneficiary", async () => {
    let instance = await Legacy.deployed();
    await instance.deleteBeneficiary(accounts[1]);
    let isBeneficiary = await instance.isBeneficiary.call(accounts[1]);
    assert.equal(isBeneficiary, false, "This beneficiary address should no be registered anymore.");
  });  
  
});