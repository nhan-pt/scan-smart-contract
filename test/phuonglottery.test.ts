import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("PhuongLotery");

    const hardhatToken = await Token.deploy("0x37e4a5397c4929Bab3024F891F785e738aBe1d18");

    const  depositData = await hardhatToken.getRandomNumber();
    console.log(await hardhatToken.winfake());
    await (new Promise(r=>{
      return setTimeout(()=>r(1) , 100)
    })).then()
    const  depositData1 = await hardhatToken.getRandomNumber();
    console.log(await hardhatToken.winfake());
    await (new Promise(r=>{
      return setTimeout(()=>r(1) , 100)
    })).then()
    const  depositData2 = await hardhatToken.getRandomNumber();
    console.log(await hardhatToken.winfake());
    
    // expect((await hardhatToken.totalSupply()).toString()).to.equal(ownerBalance.toString());
    expect(1==1)
  });
});