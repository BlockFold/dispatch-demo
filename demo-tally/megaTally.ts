import { DispatchAgent } from "@blockfold/dispatch";

let agent = new DispatchAgent();

agent.onEvent("tally", (proj, agent, event, state): Promise<any> => {
	// Initialize our state (if its not ready)
	if (!state.tally) {
		state.tally = 0;
	}

	if (event.eventName == "Transfer") {
		var value = agent.fromERC20BigNum(event.data["value"]);
		state.tally += value;
		console.log("tally.onEvent.Transfer", value, state.tally);
	}

	return Promise.resolve(state);
});

agent.onCron("tally", "* * * * *", (proj, agent, event, state): Promise<any> => {
	// Initialize our state (if its not ready)
	if (!state.tally) {
		state.tally = 0;
	}
	// Reset the state:
	console.log("tally.onCron.(each minute)", state.tally);
	state.tally = 0;

	return Promise.resolve(state);
});

export default agent;
