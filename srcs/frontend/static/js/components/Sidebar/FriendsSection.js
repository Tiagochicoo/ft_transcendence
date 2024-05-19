import { Friends } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";
import ChatBox from "/static/js/components/ChatBox/index.js";
import { sendNotification } from "/static/js/services/index.js";

// Utility Class
export default class extends Abstract {
	constructor(props) {
		super(props);

		this.params = props;
	}

	static data = [];

	static doDataUpdate(data) {
		if (this.data.find(el => el.id == data.id)) {
			this.data = this.data.map(el => (el.id == data.id) ? data : el);
		} else {
			this.data.push(data);
		}
	}

	static getList(list, options) {
		const element = document.querySelector(`#friends-wrapper [data-bs-target="#${options.id}"]`);
		const isExpanded = !options.title || (element && (element.getAttribute("aria-expanded") === 'true'));

		return `
			${options.title ? `
				<button class="btn btn-toggle d-flex gap-2 align-items-center text-start text-white opacity-75 w-100 p-0 border-0 ${isExpanded ? "" : "collapsed"}" data-bs-toggle="collapse" data-bs-target="#${options.id}" aria-expanded="${isExpanded ? "true" : "false"}">
					${options.title}

					<span class="badge text-bg-secondary">
						${list.length}
					</span>
				</button>
			` : ''}

			${list.length ? `
				<div id="${options.id}" class="collapse ${isExpanded ? "show" : ""} ${options.title ? 'mt-3' : ''}">
					<ul class="list-unstyled d-flex flex-column gap-2 mb-0">
						${list.map(({ id, user }) => `
							<div class="sidebar-section-element d-flex justify-content-between gap-1 p-1 bg-light rounded" data-friend-id="${id}">
								<div class="d-flex align-items-center gap-1">
									<img src="${user.avatar}" class="rounded-circle" />

									<span class="lh-1">
										${user.username}
									</span>
								</div>

								<div class="d-flex align-items-center gap-1">
									${options.actions.map(({ action, icon }) => `
										<button class="bg-transparent p-1 border-0" data-action="${action}" data-id="${id}">
											${icon}
										</button>
									`).join("")}
								</div>
							</div>
						`).join("")}
					</ul>
				</div>
			` : ''}
		`;
	}

	static getFriendsAccepted() {
		const list = this.data.filter(el => el.was_accepted && !el.was_canceled && !el.was_refused)
			.map(({ id, user1, user2 }) => ({ id, user: (user1.id == USER_ID) ? user2 : user1 }));

		const htmlList = this.getList(list, {
			id: 'friends-accepted-list',
			actions: [
				{
					action: 'message',
					icon: '<i class="bi bi-chat-left-dots-fill"></i>'
				}
			]
		});

		return `
			<div>
				${htmlList}
			</div>
		`;
	}

	static updateFriendsAccepted() {
		const wrapper = document.querySelector('#friends-wrapper #friends-accepted');
		if (wrapper) {
			wrapper.innerHTML = this.getFriendsAccepted();
		}
	}

	static getFriendsReceived() {
		const list = this.data.filter(el => !el.was_accepted && !el.was_canceled && !el.was_refused && (el.user2.id == USER_ID))
			.map(({ id, user1 }) => ({ id, user: user1 }));

		const htmlList = this.getList(list, {
			id: 'friends-received-list',
			title: 'Invitations Received',
			actions: [
				{
					action: 'refuse',
					icon: '<i class="bi bi-x-circle-fill"></i>'
				},
				{
					action: 'accept',
					icon: '<i class="bi bi-check-circle-fill"></i>'
				}
			]
		});

		return `
			<div class="mt-1">
				${htmlList}
			</div>
		`;
	}

	static updateFriendsReceived() {
		const wrapper = document.querySelector('#friends-wrapper #friends-received');
		if (wrapper) {
			wrapper.innerHTML = this.getFriendsReceived();
		}
	}

	static getFriendsSent() {
		const list = this.data.filter(el => !el.was_accepted && !el.was_canceled && !el.was_refused && (el.user1.id == USER_ID))
			.map(({ id, user2 }) => ({ id, user: user2 }));

		const htmlList = this.getList(list, {
			id: 'friends-sent-list',
			title: 'Invitations Sent',
			actions: [
				{
					action: 'cancel',
					icon: '<i class="bi bi-x-circle-fill"></i>'
				}
			]
		});

		return `
			<div class="mt-1">
				${htmlList}
			</div>
		`;
	}

	static updateFriendsSent() {
		const wrapper = document.querySelector('#friends-wrapper #friends-sent');
		if (wrapper) {
			wrapper.innerHTML = this.getFriendsSent();
		}
	}

	static friendAdd(data) {
		this.doDataUpdate(data);
		this.updateFriendsReceived();
		sendNotification({
			author: data.user1.username,
			body: 'Sent a friend request'
		});
	}

	static friendRefuse(data) {
		this.doDataUpdate(data);
		this.updateFriendsAccepted();
		this.updateFriendsSent();
		sendNotification({
			author: data.user2.username,
			body: 'Refused your friend request'
		});
	}

	static friendAccept(data) {
		this.doDataUpdate(data);
		this.updateFriendsAccepted();
		this.updateFriendsSent();
		sendNotification({
			author: data.user2.username,
			body: 'Accepted your friend request'
		});
	}

	static friendCancel(data) {
		this.doDataUpdate(data);
		this.updateFriendsReceived();
		sendNotification({
			author: data.user1.username,
			body: 'Canceled his friend request'
		});
	}

	static async addFunctionality() {
		const wrapper = document.getElementById('friends-wrapper');

		const handleClick = async (target) => {
			const {
				action,
				id
			} = target;

			let response;
			switch (action) {
				case 'message':
					const chatRoomId = this.data.find(el => el.id == id)?.chat_room_id;
					ChatBox.open(chatRoomId);
					break;

				case 'refuse':
					response = await Friends.refuse(id);
					if (response.success) {
						SOCKET.emit('friend_refuse', response.data);
						this.doDataUpdate(response.data);
						this.updateFriendsAccepted();
						this.updateFriendsReceived();
					}
					break;

				case 'accept':
					response = await Friends.accept(id);
					if (response.success) {
						SOCKET.emit('friend_accept', response.data);
						this.doDataUpdate(response.data);
						this.updateFriendsAccepted();
						this.updateFriendsReceived();
					}
					break;

				case 'cancel':
					response = await Friends.cancel(id);
					if (response.success) {
						SOCKET.emit('friend_cancel', response.data);
						this.doDataUpdate(response.data);
						this.updateFriendsSent();
					}
					break;
			}
		}

		// Handle Action
		wrapper.addEventListener('click', (event) => {
			if (event.target.closest('button')) {
				handleClick(event.target.closest('button').dataset);
			}
		});

		// Add Friend
		wrapper.addEventListener("submit", async (e) => {
			e.preventDefault();

			const data = new FormData(e.target);
			const response = await Friends.createByUsername(data.get('username'));
			const usernameInputEl = e.target.querySelector('#username');
			const usernameErrorEl = e.target.querySelector('#usernameError');
			if (response?.success) {
				SOCKET.emit('friend_add', response.data);
				usernameInputEl.value = '';
				usernameErrorEl.textContent = '';
				usernameErrorEl.style.display = 'none';
				this.doDataUpdate(response.data);
				this.updateFriendsSent();
			} else {
				usernameErrorEl.textContent = 'Invalid username';
				usernameErrorEl.style.display = 'block';
			}
		});
	}

	static async getHtml() {
		const response = await Friends.getAll();
		this.data = response.success ? response.data : [];

		return `
			<div id="friends-wrapper" class="sidebar-section">
				<h4 class="text-white mb-0">
					Friends
				</h4>

				<form id="friends-add" novalidate>
					<input type="text" class="form-control" id="username" name="username">
					<button type="submit" class="btn btn-primary">
						Add
					</button>
					<div id="usernameError" class="invalid-feedback" style="display: none;"></div>
				</form>

				<div id="friends-accepted">
					${this.getFriendsAccepted()}
				</div>

				<div id="friends-received">
					${this.getFriendsReceived()}
				</div>

				<div id="friends-sent">
					${this.getFriendsSent()}
				</div>
			</div>
		`;
	}
}
