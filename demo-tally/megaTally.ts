import { Bot } from "@blockfold/dispatch";

let bot = new Bot();

bot.onEvent((event, state): Promise<any> => {
  // Initialize our state (if its not ready)
  if (!state.tally) {
    state.tally = 0;
  }

  if (event.eventName == "Transfer") {
    var value = bot.fromBigNum(event.data["value"], 6);
    state.tally += value;
    bot.logMessage("INFO", `tally.onEvent.Transfer: ${value}, ${state.tally}`);
  }

  return Promise.resolve(state);
});

bot.onCron("* * * * *", (event, state): Promise<any> => {
  // Initialize our state (if its not ready)
  if (!state.tally) {
    state.tally = 0;
  }
  // Reset the state:
  bot.logMessage("INFO", `tally.onCron: ${state.tally}`);
  state.tally = 0;

  return Promise.resolve(state);
});

export default bot;
