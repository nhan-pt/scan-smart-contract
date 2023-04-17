import * as fs from "fs";
import axios from "axios";

const smartcontractAddress = [
  "0x8D983cb9388EaC77af0474fA441C4815500Cb7BB",
  "0x4a220e6096b25eadb88358cb44068a3248254675",
  "0x5c147e74D63B1D31AA3Fd78Eb229B65161983B2b",
  "0x3506424f91fd33084466f402d5d97f05f8e3b4af",
  "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
  "0x93A62Ccfcf1EfCB5f60317981F71ed6Fb39F4BA2",
  "0x5283d291dbcf85356a21ba090e6db59121208b44",
  "0x3845badAde8e6dFF049820680d1F14bD3903a5d0",
  "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
  "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
  "0x4e15361fd6b4bb609fa63c81a2be19d873717870",
  "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
  "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206",
  "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
  "0xD533a949740bb3306d119CC777fa900bA034cd52",
  "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
  "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
  "0x111111111117dc0aa78b770fa6a738034120c302",
  "0x0C356B7fD36a5357E5A017EF11887ba100C9AB76",
  "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
  "0x6c6ee5e31d828de241282b9606c8e98ea48526e2",
  "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
  "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
  "0xd26114cd6ee289accf82350c8d8487fedb8a0c07",
  "0x7420B4b9a0110cdC71fB720908340C03F9Bc03EC",
];

async function getSmartContractCode() {
  for (let i = 0; i < smartcontractAddress.length; i++) {
    const address = smartcontractAddress[i];
    console.log(i, "--", address);
    const config = {
      method: "get",
      url: `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=2WG3A6XK1CQXY6BAV1UYFEHSAQQDUSJMQF`,
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
        `./contracts/${fileName}.sol`,
        response.data.result[0].SourceCode
      );
    } catch (error) {
      console.error(error);
    }
  }
}

getSmartContractCode();
