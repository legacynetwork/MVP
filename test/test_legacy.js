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

  it("should check set PoL timer length be correctly set", async () => {
    let instance = await Legacy.deployed();
    // let tPoLBefore = await instance.tPoL();
    await instance.setPoLTimerLength(120);
    let expected_tPoL = 120 * 24 * 3600;
    let tPoLAfter = await instance.tPoL();
    assert.equal(tPoLAfter.toNumber(), expected_tPoL);
  });

});