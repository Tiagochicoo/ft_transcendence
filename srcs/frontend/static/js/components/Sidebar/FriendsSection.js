import { ChatRooms, Friends } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
	constructor(props) {
		super(props);

		this.params = props;
	}

	async addFunctionality() {
		const handleClick = async (target) => {
			const {
				action,
				id
			} = target;

			const doDataUpdate = async (doFunc) => {
				const response = await doFunc(id);
				if (response.success) {
					this.data = this.data.map(el => (el.id == response.data.id) ? response.data : el);
					return true;
				}
				return false;
			}

			switch (action) {
				case 'message':
					const chatRoomId = this.data.find(el => el.id === parseInt(id))?.chat_room_id;
					console.log('chatRoomId', chatRoomId);
					const chatRoom = await ChatRooms.get(chatRoomId);
					console.log('chatRoom', chatRoom);
					const chatRoomMessages = await ChatRooms.getMessages(chatRoomId);
					console.log('chatRoomMessages', chatRoomMessages);
					break;

				case 'refuse':
					if (await doDataUpdate(Friends.refuse)) {
						document.getElementById('friends-accepted').innerHTML = this.getFriendsAccepted();
						document.getElementById('friends-received').innerHTML = this.getFriendsReceived();
					}
					break;

				case 'accept':
					if (await doDataUpdate(Friends.accept)) {
						document.getElementById('friends-accepted').innerHTML = this.getFriendsAccepted();
						document.getElementById('friends-received').innerHTML = this.getFriendsReceived();
					}
					break;

				case 'cancel':
					if (await doDataUpdate(Friends.cancel)) {
						document.getElementById('friends-sent').innerHTML = this.getFriendsSent();
					}
					break;
			}
		}

		document.querySelector('#sidebar').addEventListener('click', (event) => {
			if (event.target.closest('button')) {
				handleClick(event.target.closest('button').dataset);
			}
		});
	}

	getList(list, options) {
		const element = document.querySelector(`[data-bs-target="#${options.id}"]`);
		const isExpanded = element && (element.getAttribute("aria-expanded") === 'true');

		return `
			<button class="btn btn-toggle d-flex gap-2 align-items-center text-start text-white opacity-75 w-100 p-0 border-0 mb-2 ${isExpanded ? "" : "collapsed"}" data-bs-toggle="collapse" data-bs-target="#${options.id}" aria-expanded="${isExpanded ? "true" : "false"}">
				${options.title}

				<span class="badge text-bg-secondary">
					${list.length}
				</span>
			</button>

			<div id="${options.id}" class="collapse ${isExpanded ? "show" : ""}">
				<ul class="list-unstyled d-flex flex-column gap-2">
					${list.map(({ id, user }) => `
						<div class="sidebar-section-element d-flex justify-content-between gap-1 p-1 bg-light rounded" data-friend-id="${id}">
							<div class="d-flex align-items-center gap-1">
								<img src="${user.avatar}" class="rounded-circle" />

								<span class="lh-1">
									${user.username}
								<span>
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
		`;
	}

	getFriendsAccepted() {
		const list = this.data.filter(({ was_accepted }) => was_accepted)
			.map(({ id, user1, user2 }) => ({ id, user: (user1.id == Friends.USER_ID) ? user2 : user1 }));

		return this.getList(list, {
			id: 'friends-accepted-list',
			title: 'Friends',
			actions: [
				{
					action: 'message',
					icon: '<i class="bi bi-chat-left-dots-fill"></i>'
				}
			]
		});
	}

	getFriendsReceived() {
		const list = this.data.filter(({ was_accepted, was_canceled, was_refused, user2 }) => !was_accepted && !was_canceled && !was_refused && (user2.id == Friends.USER_ID))
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
			<div class="mt-2">
				${htmlList}
			</div>
		`;
	}

	getFriendsSent() {
		const list = this.data.filter(({ was_accepted, was_canceled, was_refused, user1 }) => !was_accepted && !was_canceled && !was_refused && (user1.id == Friends.USER_ID))
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
			<div class="mt-2">
				${htmlList}
			</div>
		`;
	}

	async getHtml() {
		const response = await Friends.getAll();
		this.data = response.success ? response.data : [];

		return `
			<div>
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
