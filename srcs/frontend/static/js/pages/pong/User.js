import { Users } from "/static/js/api/index.js";

export default class User {
  constructor(username, id) {
    this.id = id;
    this.username = username;
    this.score = 0;
  }

  async update(result) {
    const data = {
      "userId": this.id,
      "numGames": 1,
      "numGamesWon": result === 'win' ? 1 : 0
    };

    await Users.updateUser(data);
  }

}
