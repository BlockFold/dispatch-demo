import { Bot, ContractEvent } from "@blockfold/dispatch";

let bot = new Bot();
let contractAddress = bot.getSecret("CONTRACT_ADDRESS") as string;

let decimals = NaN;
let contract = null;

bot.onInit("get-decimals", async () => {
  contract = await bot.getContract(contractAddress);
  let decimalBigNum = await contract.decimals();
  decimals = parseInt(decimalBigNum.toString());
  console.log("GOT DECIMALS: ", decimals);
  return true;
});

bot.onContractEvent(
  "on-transfer",
  contractAddress,
  (event: ContractEvent, state: any): Promise<any> => {
    if (event.eventName == "Transfer") {
      var parsedValue = bot.fromBigNum(event.data["value"], decimals);

      let payload = {
        rawValue: event.data["value"],
        parsedValue: parsedValue,
        contract: contractAddress,
        from: event.data["from"],
        to: event.data["to"],
        transactionHash: event.transactionHash,
        blockHash: event.blockHash,
      };

      bot.logInfo(
        `Transfer ${parsedValue} from ${payload.from} to ${payload.to} `,
        payload
      );

      // Send the event...
      bot.emitEvent("blockfold/erc20-transfer", payload);
    }

    return Promise.resolve(state);
  }
);

export default bot;
