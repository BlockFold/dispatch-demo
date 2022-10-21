import { Bot, ContractEvent } from "@blockfold/dispatch";

let bot = new Bot();

let valueKey = bot.getSecret("VALUE_KEY") as string;
let comparison = bot.getSecret("COMPARISON") as string;
let compareValue = parseFloat(bot.getSecret("COMPARE_VALUE") as string);

bot.onInit("init-state", async (state: any) => {
  if (!state.tally) {
    state.tally = 0;
    state.count = 0;
  }
  return Promise.resolve(state);
});

bot.onDispatchEvent("on-event", "*", async (msg, state: any) => {
  if (typeof msg.data[valueKey] !== "number") {
    bot.logError(
      `The value of msg.data['${valueKey}] is not a number, no comparison made`,
      msg.data
    );
    return Promise.resolve(state);
  }

  var value = msg.data[valueKey];

  if (comparison == ">") {
    if (value > compareValue) {
      bot.emitEvent(msg.messageType, msg.data);
      return Promise.resolve(state);
    }
  }
  if (comparison == ">=") {
    if (value >= compareValue) {
      bot.emitEvent(msg.messageType, msg.data);
      return Promise.resolve(state);
    }
  }
  if (comparison == "=") {
    if (value == compareValue) {
      bot.emitEvent(msg.messageType, msg.data);
      return Promise.resolve(state);
    }
  }
  if (comparison == "<") {
    if (value < compareValue) {
      bot.emitEvent(msg.messageType, msg.data);
      return Promise.resolve(state);
    }
  }
  if (comparison == "<=") {
    if (value <= compareValue) {
      bot.emitEvent(msg.messageType, msg.data);
      return Promise.resolve(state);
    }
  }
  if (comparison == "!=") {
    if (value != compareValue) {
      bot.emitEvent(msg.messageType, msg.data);
      return Promise.resolve(state);
    }
  }
  // This is a problem, Unknown comparison...
});

export default bot;
