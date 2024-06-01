import { ChatRooms } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";
import MatchesSection from "/static/js/components/Sidebar/MatchesSection.js";
import { User } from "/static/js/generators/index.js";

// Utility Class
export default class extends Abstract {
	constructor() {
		throw new Error("Cannot be instantiated");
	}

	static chatRoomId = null;
	static otherUser = {};
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

	static async block() {
		const response = await ChatRooms.block(this.chatRoom.id);
		if (response.success) {
			SOCKET.emit('chat_block', response.data);
		}
	}

	static async unblock() {
		const response = await ChatRooms.unblock(this.chatRoom.id);
		if (response.success) {
			SOCKET.emit('chat_unblock', response.data);
		}
	}

	static async update(data) {
		console.log(data);
	}

	static async addFunctionality() {
		const wrapper = document.querySelector("#chat-box .chat-box-wrapper");

		// Close Button
		wrapper.addEventListener("click", (e) => {
			let currentElement = e.target;

			while (
				currentElement.tagName &&
				(currentElement.matches("[data-action]") || currentElement.parentNode)
			) {
				if (currentElement.matches("[data-action=\"close\"]")) {
					e.preventDefault();
					wrapper.parentNode.innerHTML = '';
					return;
				} else if (currentElement.matches("[data-action=\"match\"]")) {
					e.preventDefault();
					MatchesSection.matchCreate(this.otherUser.id);
					return;
				} else if (currentElement.matches("[data-action=\"block\"]")) {
					e.preventDefault();
					if (!this.chatRoom.was_blocked) {
						this.block();
					} else if (this.chatRoom.block_user.id == USER_ID) {
						this.unblock();
					}
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

		this.otherUser = (this.chatRoom.user1.id === USER_ID) ? this.chatRoom.user2 : this.chatRoom.user1;

		return `
			<div class="chat-box-wrapper" data-chat-room-id="${this.chatRoomId}">
				<div class="chat-box-header">
					${User.getBadge(this.otherUser)}

					<div class="chat-box-actions-wrapper">
						<button class="chat-box-block" data-action="block">
							<i class="bi bi-slash-circle"></i>
						</button>

						<button class="chat-box-block" data-action="match">
							<i class="bi bi-controller"></i>
						</button>

						<button class="chat-box-close" data-action="close">
							<i class="bi bi-x-circle-fill"></i>
						</button>
					</div>
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
