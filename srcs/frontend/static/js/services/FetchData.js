export default class FetchData {
  constructor() {}

  // used only with mocked data
  static getMockedData() {
    return fetch("/static/js/db.json")
      .then((response) => response.json())
      .catch((error) => console.log(error.message));
  }

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
