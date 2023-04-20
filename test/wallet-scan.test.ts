// test/Box.test.js
// Load dependencies
import chai from 'chai'
// import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { abiUsd } from "../src/common-abi";
import dotenv from 'dotenv'
import { ethers } from "hardhat"
dotenv.config()

const expect = chai.expect
chai.use(chaiAsPromised)


const smartContract = process.env.SM_ADDRESS?.toString()
const holder = process.env.HOLDER_ADDRESS?.toString()
const testAmount = 10000
// Start test block
describe("Scan listing token", function () {
  // Use large integers ('big numbers')
  
  const web3 = new Web3("http://127.0.0.1:8545");
  const contract = new web3.eth.Contract(abiUsd as AbiItem[], smartContract);
  let zeroAddress = ''

  beforeEach(async () => {
    
    const signers = await web3.eth.getAccounts();
    
    zeroAddress = signers[0]
    // prepare begin method

    // send all balance from Zero.
    
    try {

      await web3.eth.sendTransaction({ from: zeroAddress, to: holder, value: 1 * 10**18 });
      const zlSMBalan = await contract.methods.balanceOf(zeroAddress).call();
      await contract.methods
        .transfer(holder, zlSMBalan)
        .send({
          from: zeroAddress,
        });
      const allowance = await contract.methods.allowance(holder, zeroAddress).call();
      await contract.methods.transferFrom(holder, '0x0000000000000000000000000000000000000000', allowance).send({
        from: zeroAddress
      });
    } catch (error) {
      console.log(error);
    }

    

  });

  it("Balance valid", async function () {
    
    
    const balance = await contract.methods
      .balanceOf(holder)
      .call();
    console.log('Valid balance:', balance);
    expect(Number(balance)).gt(0);
  });

  it("Balance inValid", async function () {
    const zeroBalance = await contract.methods
      .balanceOf(zeroAddress)
      .call();
    console.log('Zero balance:', zeroBalance);
    expect(Number(zeroBalance)).eq(0);
  });

  it("transfer from zeroAddress to holder", async function () {
    const [holderBalance, zeroBalance] = await Promise.all([
      contract.methods.balanceOf(holder).call(),
      contract.methods.balanceOf(zeroAddress).call(),
    ]); 
    console.log("zero Balance:", zeroBalance);
    expect(Number(zeroBalance)).lt(testAmount);

    const transferMethod = contract.methods.transfer(holder, testAmount).send({
        from: zeroAddress
    })
    await expect(transferMethod).to.be.rejectedWith()
  });


  it("transfer from holder to zero Address", async function () {
    const [holderBalance, zeroBalance] = await Promise.all([
      contract.methods.balanceOf(holder).call(),
      contract.methods.balanceOf(zeroAddress).call(),
    ]); 
    console.log('balance1:', zeroBalance);
    expect(holderBalance > 0)
    const transaction = await contract.methods.transfer(zeroAddress, testAmount).send({
        from: holder
    })
    const balanceAfter = await contract.methods
    .balanceOf(zeroAddress)
    .call();
    console.log(balanceAfter);
    
    const tx = await web3.eth.getTransactionReceipt(transaction.transactionHash)
    
    expect(Number(balanceAfter)).eq(Number(zeroBalance) + testAmount);
    expect(tx.logs.length).gt(0)
  });

  it("TransferFrom by not approve address", async function () {
    const allowance = await contract.methods
      .allowance(holder, zeroAddress)
      .call();
    console.log("allowance:", allowance);

    const sendTransferFrom = contract.methods
      .transferFrom(holder, zeroAddress, Number(allowance) + 1)
      .send({
        from: holder,
      });

    await expect(sendTransferFrom).to.be.rejectedWith();
  });

  it("Approve and allowce from holder", async function () {
    const allowance = await contract.methods
      .allowance(holder, zeroAddress)
      .call();
    console.log("allowance:", allowance);

    expect(Number(allowance)).gt(Number(allowance));
    await contract.methods.approve(zeroAddress, testAmount).send({
      from: holder,
    });
    const allowAfter = await contract.methods
      .allowance(holder, zeroAddress)
      .call();

    expect(Number(testAmount)).eq(Number(allowAfter));
  });

  it("TransferFrom zero address to zero", async function () {
    let approveAmount = testAmount;
    
    let approveResule = false;
    try {
      await contract.methods.approve(zeroAddress, approveAmount).send({
        from: holder,
      });
      approveResule = true;
    } catch (error) {
    }
    
    const allowance = await contract.methods
      .allowance(holder, zeroAddress)
      .call();
    console.log("allowance:", allowance);
    if (approveResule) {
      expect(Number(allowance)).eq(approveAmount);
    } else {
      approveAmount = Number(allowance);
    }
    
    const [ holderBalance,zeroBalance]= await Promise.all([
      contract.methods.balanceOf(holder).call(),
      contract.methods.balanceOf(zeroAddress).call(),
    ])

    await contract.methods
      .transferFrom(holder, zeroAddress, approveAmount)
      .send({
        from: zeroAddress,
      });
    const [holderBlAfter, zeroBlAfter, alAfter] = await Promise.all([
      contract.methods.balanceOf(holder).call(),
      contract.methods.balanceOf(zeroAddress).call(),
      contract.methods
      .allowance(holder, zeroAddress)
      .call()
    
    ]);
    console.log("allowance After transfer:", alAfter);
    expect(Number(holderBlAfter)).eq(Number(holderBalance) - approveAmount);
    expect(Number(zeroBlAfter)).eq(Number(zeroBalance) + approveAmount);
    expect(Number(alAfter)).eq(0);

  });

});
