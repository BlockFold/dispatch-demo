import { Bot } from "@blockfold/dispatch";
import fetch from "node-fetch";

let bot = new Bot();

// USDC: https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
let contractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

bot.onEvent(contractAddress, (event, state): Promise<any> => {
  // Initialize our state (if its not ready)
  if (!state.usdc) {
    state.usdc = 0;
  }

  if (event.eventName == "Transfer") {
    var value = bot.fromBigNum(event.data["value"], 6);
    state.usdc += value;
    bot.logMessage("INFO", `tally.onEvent.Transfer: ${value}, ${state.usdc}`);
  }

  return Promise.resolve(state);
});


export default bot;
