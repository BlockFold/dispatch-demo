import { Bot, ContractEvent } from "@blockfold/dispatch";

let bot = new Bot();

let resetCron = bot.getSecret("RESET_CRON") as string;
let valueKey = bot.getSecret("VALUE_KEY") as string;

bot.onInit("init-state", async (state: any) => {
  if (!state.tally) {
    state.tally = 0;
    state.count = 0;
  }
  return Promise.resolve(state);
});

bot.onDispatchEvent("on-event", "*", async (msg, state: any) => {
  if (typeof msg.data.value === "number") {
    state.tally += msg.data.value;
    state.count++;
  }

  return Promise.resolve(state);
});

bot.onCron("reset-and-emit", resetCron, async (event, state): Promise<any> => {
  let payload = {
    value: state.tally,
  };

  bot.emitEvent("blockfold/cron-tally", payload);
  state.tally = 0;
  return Promise.resolve(state);
});

export default bot;
