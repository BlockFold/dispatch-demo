import { DispatchAgent } from "@blockfold/dispatch";

let agent = new DispatchAgent();

agent.onEvent("tally", (context, event, state): Promise<any> => {
	// Initialize our state (if its not ready)
	if (!state.tally) {
		state.tally = 0;
	}

	if (event.eventName == "Transfer") {
		var value = agent.fromERC20BigNum(event.data["value"]);
		state.tally += value;
		context.agent.logMessage("INFO", `tally.onEvent.Transfer: ${value}, ${state.tally}`);
	}

	return Promise.resolve(state);
});

agent.onCron("tally", "* * * * *", (context, event, state): Promise<any> => {
	// Initialize our state (if its not ready)
	if (!state.tally) {
		state.tally = 0;
	}
	// Reset the state:
	context.agent.logMessage("INFO", `tally.onCron: ${state.tally}`);
	state.tally = 0;

	return Promise.resolve(state);
});

export default agent;
