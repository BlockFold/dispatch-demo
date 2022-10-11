import { Bot } from "@blockfold/dispatch";
import fetch from "node-fetch";

let bot = new Bot();

// USDT: https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7
let contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

bot.onEvent((event, state): Promise<any> => {
  // Initialize our state (if its not ready)
  if (!state.usdt) {
    state.usdt = 0;
  }

  if (event.eventName == "Transfer") {
    var value = bot.fromBigNum(event.data["value"], 6);
    state.usdt += value;
    bot.logMessage("INFO", `tally.onEvent.Transfer: ${value}, ${state.tally}`);
  }

  return Promise.resolve(state);
});


export default bot;
