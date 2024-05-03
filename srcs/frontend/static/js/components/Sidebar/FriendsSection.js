import { Friends } from "/static/js/api/index.js";
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

			switch (action) {
				case 'message':
					alert(`message: ${id}`);
					break;

				case 'refuse':
					await Friends.refuse(id);
					break;

				case 'accept':
					await Friends.accept(id);
					break;

				case 'cancel':
					await Friends.cancel(id);
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
		return `
			<button class="btn btn-toggle d-flex gap-2 align-items-center text-start text-white opacity-75 w-100 p-0 border-0 mb-2" data-bs-toggle="collapse" data-bs-target="#${options.id}" aria-expanded="false">
				${options.title}

				<span class="badge text-bg-secondary">
					${list.length}
				</span>
			</button>

			<div id="${options.id}" class="collapse">
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
								`)}
							</div>
						</div>
					`).join("")}
				</ul>
			</div>
		`;
	}

	getFriendsAccepted(list) {
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

	getFriendsReceived(list) {
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

	getFriendsSent(list) {
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
		this.data = await Friends.getAll();

		const listAccepted = this.data.filter(({ was_accepted }) => was_accepted)
			.map(({ id, user1, user2 }) => ({ id, user: (user1.id == 1) ? user2 : user1 }));
		const listReceived = this.data.filter(({ was_accepted, was_canceled, was_refused, user2 }) => !was_accepted && !was_canceled && !was_refused && (user2.id == 1))
			.map(({ id, user1 }) => ({ id, user: user1 }));
		 const listSent = this.data.filter(({ was_accepted, was_canceled, was_refused, user1 }) => !was_accepted && !was_canceled && !was_refused && (user1.id == 1))
			.map(({ id, user2 }) => ({ id, user: user2 }));

		return `
			<div>
				<div id="friends-accepted">
					${this.getFriendsAccepted(listAccepted)}
				</div>

				<div id="friends-received">
					${this.getFriendsReceived(listReceived)}
				</div>

				<div id="friends-sent">
					${this.getFriendsSent(listSent)}
				</div>
			</div>
		`;
	}
}
