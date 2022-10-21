import { Bot, ContractEvent } from "@blockfold/dispatch";
import fetch from "node-fetch";

let bot = new Bot();

var slackHook = bot.getSecret("SLACK_WEBHOOK");
var template = bot.getSecret("TEMPLATE");

bot.onInit("init-state", async (state: any) => {
  if (!state.tally) {
    state.tally = 0;
    state.count = 0;
  }
  return Promise.resolve(state);
});

bot.onDispatchEvent("on-event", "*", async (msg, state: any) => {
  if (!slackHook) {
    bot.logError("No SLACK_WEBHOOK secret was found", null);
    return Promise.resolve(state);
  }
  if (!template) {
    bot.logError("No TEMPLATE secret was found", null);
    return Promise.resolve(state);
  }

  let message = template.replace(/\{([a-z]+)\}/g, (_, key) => msg.data[key]);
  var payload = {
    text: message,
  };

  var deploymentResponse: any = await fetch(slackHook!, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  bot.log("Send to slack: ", deploymentResponse);

  return Promise.resolve(state);
});

export default bot;
