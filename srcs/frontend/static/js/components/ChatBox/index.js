import { ChatRooms } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
	constructor(props) {
		super(props);

		this.chatRoomId = props;
	}

	async getHtml() {
		let response = await ChatRooms.get(this.chatRoomId);
		this.chatRoom = response.data;

		response = await ChatRooms.getMessages(this.chatRoomId);
		this.messages = response.data;

		const otherUser = (this.chatRoom.user1.id === ChatRooms.USER_ID) ? this.chatRoom.user2 : this.chatRoom.user1;

		document.getElementById("chat-box").addEventListener("click", (e) => {
			let currentElement = e.target;

			while (
				currentElement.tagName &&
				(currentElement.matches("[data-action=\"close\"]") || currentElement.parentNode)
			) {
				if (currentElement.matches("[data-action=\"close\"]")) {
					e.preventDefault();
					document.getElementById("chat-box").innerHTML = '';
					return;
				}

				currentElement = currentElement.parentNode;
			}
		});

		document.querySelector("#chat-box").addEventListener("submit", async (e) => {
			e.preventDefault();

			const data = new FormData(e.target);
			const response = await ChatRooms.sendMessage(this.chatRoomId, data.get('content'));
			if (response.success) {
				socket.emit('chat_message', response.data.chat_room, response.data.content);
				e.target.querySelector('#content').value = '';
			}
		});

		// Scroll the messages thread to the bottom by default
		setTimeout(() => {
			const messagesWrapper = document.querySelector('#chat-box .chat-box-messages');
			if (messagesWrapper) {
				messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
			}
		}, 50);

		return `
			<div class="chat-box-wrapper" data-chat-room-id="${this.chatRoomId}">
				<div class="chat-box-header">
					<img src="${otherUser.avatar}" class="rounded-circle" />

					<span class="lh-1">
						${otherUser.username}
					</span>

					<button class="chat-box-close" data-action="close">
						<i class="bi bi-x-circle-fill"></i>
					</button>
				</div>

				<div class="chat-box-messages">
					${this.messages.map(({ content, sender }) => `
						<div class="chat-box-message ${sender.id == ChatRooms.USER_ID ? "left" : "right"}">
							${content}
						</div>
					`).join("")}
				</div>

				<div class="chat-box-footer">
					<form novalidate>
						<input type="text" class="form-control" id="content" name="content">
						<button type="submit" class="btn btn-primary">
							<i class="bi bi-send-fill"></i>
						</button>
					</form>
				</div>
			</div>
		`;
	}
}
