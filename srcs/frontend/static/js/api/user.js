export default class User {
	constructor() {}

	// request data from Django API
	static getUserList() {
	return fetch("/api/users")
		.then((response) => response.json())
		.catch((error) => console.log(error.message));
	}

	static getUser(id) {
	return fetch(`/api/users/${id}`)
		.then((response) => response.json())
		.catch((error) => console.log(error.message));
	}
}