import { ChatRooms, Friends } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";
import ChatBox from "/static/js/components/ChatBox/index.js";

export default class extends Abstract {
	constructor(props) {
		super(props);

		this.params = props;
	}

	doDataUpdate(data) {
		if (this.data.find(el => el.id == data.id)) {
			this.data = this.data.map(el => (el.id == data.id) ? data : el);
		} else {
			this.data.push(data);
		}
	}

	async addFunctionality() {
		const wrapper = document.getElementById('friends-wrapper');

		const handleClick = async (target) => {
			const {
				action,
				id
			} = target;

			let response;
			switch (action) {
				case 'message':
					const chatRoomId = this.data.find(el => el.id === parseInt(id))?.chat_room_id;
					const chatBox = new ChatBox(chatRoomId);
					document.getElementById('chat-box').innerHTML = await chatBox.getHtml();
					await chatBox.addFunctionality();
					break;

				case 'refuse':
					response = await Friends.refuse(id);
					if (response.success) {
						this.doDataUpdate(response.data);
						wrapper.querySelector('#friends-accepted').innerHTML = this.getFriendsAccepted();
						wrapper.querySelector('#friends-received').innerHTML = this.getFriendsReceived();
					}
					break;

				case 'accept':
					response = await Friends.accept(id);
					if (response.success) {
						SOCKET.emit('friend_accept', response.data);
						this.doDataUpdate(response.data);
						wrapper.querySelector('#friends-accepted').innerHTML = this.getFriendsAccepted();
						wrapper.querySelector('#friends-received').innerHTML = this.getFriendsReceived();
					}
					break;

				case 'cancel':
					response = await Friends.cancel(id);
					if (response.success) {
						SOCKET.emit('friend_cancel', response.data);
						this.doDataUpdate(response.data);
						wrapper.querySelector('#friends-sent').innerHTML = this.getFriendsSent();
					}
					break;
			}
		}

		const friendAddSocketListener = () => {
			// Remove 'friend_add_id' listener
			SOCKET.off(`friend_add_${USER_ID}`);

			// Listen to the 'friend_add_id' event
			SOCKET.on(`friend_add_${USER_ID}`, (data) => {
				this.doDataUpdate(data);
				wrapper.querySelector('#friends-received').innerHTML = this.getFriendsReceived();
			});
		}

		const friendAcceptSocketListener = () => {
			// Remove 'friend_accept_id' listener
			SOCKET.off(`friend_accept_${USER_ID}`);

			// Listen to the 'friend_accept_id' event
			SOCKET.on(`friend_accept_${USER_ID}`, (data) => {
				this.doDataUpdate(data);
				wrapper.querySelector('#friends-accepted').innerHTML = this.getFriendsAccepted();
				wrapper.querySelector('#friends-sent').innerHTML = this.getFriendsSent();
			});
		}

		const friendCancelSocketListener = () => {
			// Remove 'friend_cancel_id' listener
			SOCKET.off(`friend_cancel_${USER_ID}`);

			// Listen to the 'friend_cancel_id' event
			SOCKET.on(`friend_cancel_${USER_ID}`, (data) => {
				this.doDataUpdate(data);
				wrapper.querySelector('#friends-received').innerHTML = this.getFriendsReceived();
			});
		}

		wrapper.addEventListener('click', (event) => {
			if (event.target.closest('button')) {
				handleClick(event.target.closest('button').dataset);
			}
		});

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
				wrapper.querySelector('#friends-sent').innerHTML = this.getFriendsSent();
			} else {
				usernameErrorEl.textContent = 'Invalid username';
				usernameErrorEl.style.display = 'block';
			}
		});

		friendAddSocketListener();
		friendAcceptSocketListener();
		friendCancelSocketListener();
	}

	getList(list, options) {
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

	getFriendsAddForm() {
		return `
			<form novalidate>
				<input type="text" class="form-control" id="username" name="username">
				<button type="submit" class="btn btn-primary">
					Add
				</button>
				<div id="usernameError" class="invalid-feedback" style="display: none;"></div>
			</form>
		`;
	}

	getFriendsAccepted() {
		const list = this.data.filter(({ was_accepted }) => was_accepted)
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

	getFriendsReceived() {
		const list = this.data.filter(({ was_accepted, was_canceled, was_refused, user2 }) => !was_accepted && !was_canceled && !was_refused && (user2.id == USER_ID))
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

	getFriendsSent() {
		const list = this.data.filter(({ was_accepted, was_canceled, was_refused, user1 }) => !was_accepted && !was_canceled && !was_refused && (user1.id == USER_ID))
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

	async getHtml() {
		const response = await Friends.getAll();
		this.data = response.success ? response.data : [];

		return `
			<div id="friends-wrapper" class="sidebar-section">
				<h4 class="text-white mb-0">
					Friends
				</h4>
				<div id="friends-add">
					${this.getFriendsAddForm()}
				</div>
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
