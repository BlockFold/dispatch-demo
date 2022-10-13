import { Bot, ContractEvent } from "@blockfold/dispatch";

let bot = new Bot();
let threshold = parseFloat(bot.getSecret("LARGE_TX_THRESHOLD") as string);

bot.onDispatchEvent("ERC20-Transfer", async (msg, state) => {
	let transferValue = parseFloat(msg.data.parsedValue as string);
	if (transferValue > threshold) {
		bot.audit("large-transfer", `A large transfer greater than ${threshold} was detected`, msg);
	}
	return state;
});

export default bot;
