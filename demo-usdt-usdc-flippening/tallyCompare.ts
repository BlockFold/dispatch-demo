import { Bot } from "@blockfold/dispatch";
import fetch from "node-fetch";

let bot = new Bot();

bot.onCron("* * * * *", async (event, state): Promise<any> => {
  // Initialize our state (if its not ready)
  if (!state.usdc) {
    state.usdc = 0;
  }
  if (!state.usdt) {
    state.usdt = 0;
  }

  if (state.usdc > state.usdt) {
    var slackHook = bot.getSecret("SLACK_NOTIFY_HOOK");
    if (!slackHook) {
      bot.logMessage("ERROR", "No SLACK_NOTIFY_HOOK secret was found");
    } else {
      var payload = {
        text: `USDC Transfers were more than USDT over the last minute.  IS IT THE FLIPPENING!?!?!?`,
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
  }
  // Reset the state:
  bot.logMessage("INFO", `tally.onCron: ${state.tally}`);
  state.tally = 0;

  return Promise.resolve(state);
});

export default bot;
