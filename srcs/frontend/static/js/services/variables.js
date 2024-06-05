// Singleton
export default class {
	constructor() {
		throw new Error("Cannot be instantiated");
	}

	static socket;

	getSocket() {
		return socket;
	}

	setSocket(newValue) {
		socket = newValue;
	}
}
