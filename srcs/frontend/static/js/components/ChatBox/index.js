import { ChatRooms } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";

// Utility Class
export default class extends Abstract {
	constructor() {
		throw new Error("Cannot be instantiated");
	}

	static chatRoomId = null;
	static chatRoom = {};
	static messages = [];

	static scrollMessagesToBottom() {
		const messagesWrapper = document.querySelector('#chat-box .chat-box-messages');
		if (messagesWrapper) {
			messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
		}
	}

	static getMessageHtml({ content, sender }) {
		return `
			<div class="chat-box-message ${sender.id == USER_ID ? "left" : "right"}">
				${content}
			</div>
		`;
	}

	static appendMessage(data) {
		if (data.chat_room.id == this.chatRoomId) {
			const messagesWrapper = document.querySelector('#chat-box .chat-box-messages');
			if (messagesWrapper) {
				messagesWrapper.insertAdjacentHTML('beforeend', this.getMessageHtml(data));
				this.scrollMessagesToBottom();
				return true;
			}
		}
		return false;
	}

	static async open(newChatRoomId) {
		this.chatRoomId = newChatRoomId;
		document.getElementById('chat-box').innerHTML = await this.getHtml();
		await this.addFunctionality();
	}

	static async addFunctionality() {
		const wrapper = document.querySelector("#chat-box .chat-box-wrapper");

		// Close Button
		wrapper.addEventListener("click", (e) => {
			let currentElement = e.target;

			while (
				currentElement.tagName &&
				(currentElement.matches("[data-action=\"close\"]") || currentElement.parentNode)
			) {
				if (currentElement.matches("[data-action=\"close\"]")) {
					e.preventDefault();
					wrapper.parentNode.innerHTML = '';
					return;
				}
				currentElement = currentElement.parentNode;
			}
		});

		// Send Message
		wrapper.addEventListener("submit", async (e) => {
			e.preventDefault();

			const data = new FormData(e.target);
			const response = await ChatRooms.sendMessage(this.chatRoomId, data.get('content'));
			if (response.success) {
				SOCKET.emit('chat_message', response.data);
				e.target.querySelector('#content').value = '';
			}
		});

		// Scroll the messages thread to the bottom by default
		this.scrollMessagesToBottom();
	}

	static async getHtml() {
		let response = await ChatRooms.get(this.chatRoomId);
		this.chatRoom = response.data;

		response = await ChatRooms.getMessages(this.chatRoomId);
		this.messages = response.data;

		const otherUser = (this.chatRoom.user1.id === USER_ID) ? this.chatRoom.user2 : this.chatRoom.user1;

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
					${this.messages.map(message => this.getMessageHtml(message)).join("")}
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
