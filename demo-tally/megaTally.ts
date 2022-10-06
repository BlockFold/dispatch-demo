import { Bot } from "@blockfold/dispatch";
import fetch from "node-fetch";

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

bot.onCron("* * * * *", async (event, state): Promise<any> => {
  // Initialize our state (if its not ready)
  if (!state.tally) {
    state.tally = 0;
  }

  var slackHook = bot.getSecret("SLACK_NOTIFY_HOOK");
  if (!slackHook) {
    bot.logMessage("ERROR", "No SLACK_NOTIFY_HOOK secret was found");
  } else {
    var payload = {
      text: `USDT Transfers totalled ${state.tally} in the last minute`,
    };
    var deploymentResponse: any = await fetch(slackHook!, {
      method: "POST", // or 'PUT'
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  // Reset the state:
  bot.logMessage("INFO", `tally.onCron: ${state.tally}`);
  state.tally = 0;

  return Promise.resolve(state);
});

export default bot;
