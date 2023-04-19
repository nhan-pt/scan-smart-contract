import * as fs from "fs";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();


const smartcontractAddress = [
  "0x8D983cb9388EaC77af0474fA441C4815500Cb7BB",
  "0x4a220e6096b25eadb88358cb44068a3248254675",
  "0x5c147e74D63B1D31AA3Fd78Eb229B65161983B2b",
  "0x3506424f91fd33084466f402d5d97f05f8e3b4af",
];

const scanKey = process.env.SCANNER_PRIVATE_KEY

async function getSmartContractCode() {
  for (let i = 0; i < smartcontractAddress.length; i++) {
    const address = smartcontractAddress[i];
    console.log(i, "--", address);
    const config = {
      method: "get",
      url: `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${scanKey}`,
      headers: {},
    };
    try {
      const response = await axios(config);
      const smartContractInfo = response.data.result[0];
      if (!smartContractInfo.SourceCode) {
        console.log("Smart contract not verify", address);
      }
      const fileName = smartContractInfo.ContractName.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );

      fs.writeFileSync(
        `./sm-contracts/${fileName}.sol`,
        response.data.result[0].SourceCode
      );
    } catch (error) {
      console.error(error);
    }
  }
}

getSmartContractCode();
