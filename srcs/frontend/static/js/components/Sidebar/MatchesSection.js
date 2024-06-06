import { Matches } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";
import { User } from "/static/js/generators/index.js";
import { navigateTo, sendNotification, variables } from "/static/js/services/index.js";

// Utility Class
export default class extends Abstract {
	constructor() {
		throw new Error("Cannot be instantiated");
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
		const element = document.querySelector(`#matches-wrapper [data-bs-target="#${options.id}"]`);
		const isExpanded = !options.title || (element && (element.getAttribute("aria-expanded") === 'true'));
		const isAccepted = (options.id == 'matches-accepted-list');

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
							<div class="sidebar-section-element d-flex justify-content-between gap-1 p-1 bg-light rounded" data-match-id="${id}" ${isAccepted ? `href="/pong/single/match/${id}" data-link` : ''}>
								${User.getBadge(user)}

								<div class="d-flex align-items-center">
									${options.actions.map(({ action, icon }) => `
										<button class="bg-transparent p-1 border-0" data-action="${action}" data-id="${id}">
											${icon}
										</button>
									`).join("")}

									${isAccepted ? `
										<strong class="px-2">
											#${id}
										</strong>
									` : ''}
								</div>
							</div>
						`).join("")}
					</ul>
				</div>
			` : ''}
		`;
	}

	static getMatchesAccepted() {
		const list = this.data.filter(el => el.was_accepted && !el.was_canceled && !el.was_refused && !el.has_finished)
			.map(({ id, user1, user2 }) => ({ id, user: (user1.id == USER_ID) ? user2 : user1 }));

		const htmlList = this.getList(list, {
			id: 'matches-accepted-list',
			actions: []
		});

		return `
			<div>
				${htmlList}
			</div>
		`;
	}

	static updateMatchesAccepted() {
		const wrapper = document.querySelector('#matches-wrapper #matches-accepted');
		if (wrapper) {
			wrapper.innerHTML = this.getMatchesAccepted();
		}
	}

	static getMatchesReceived() {
		const list = this.data.filter(el => !el.was_accepted && !el.was_canceled && !el.was_refused && (el.user2.id == USER_ID))
			.map(({ id, user1 }) => ({ id, user: user1 }));

		const htmlList = this.getList(list, {
			id: 'matches-received-list',
			title: i18next.t("sidebar.invitations_received"),
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

	static updateMatchesReceived() {
		const wrapper = document.querySelector('#matches-wrapper #matches-received');
		if (wrapper) {
			wrapper.innerHTML = this.getMatchesReceived();
		}
	}

	static getMatchesSent() {
		const list = this.data.filter(el => !el.was_accepted && !el.was_canceled && !el.was_refused && (el.user1.id == USER_ID))
			.map(({ id, user2 }) => ({ id, user: user2 }));

		const htmlList = this.getList(list, {
			id: 'matches-sent-list',
			title: i18next.t("sidebar.invitations_sent"),
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

	static updateMatchesSent() {
		const wrapper = document.querySelector('#matches-wrapper #matches-sent');
		if (wrapper) {
			wrapper.innerHTML = this.getMatchesSent();
		}
	}

	static matchCreateNotification(data) {
		this.doDataUpdate(data);
		this.updateMatchesSent();
		sendNotification({
			user: data.user2,
			body: i18next.t("sidebar.matches.notification_messages.create")
		});
		navigateTo(`/pong/single/match/${data.id}`);
	}

	static matchInviteNotification(data) {
		this.doDataUpdate(data);
		this.updateMatchesReceived();
		sendNotification({
			user: data.user1,
			body: i18next.t("sidebar.matches.notification_messages.sent")
		});
	}

	static matchRefuseNotification(data) {
		this.doDataUpdate(data);
		this.updateMatchesAccepted();
		this.updateMatchesSent();
		sendNotification({
			user: data.user2,
			body: i18next.t("sidebar.matches.notification_messages.refused")
		});
	}

	static matchAcceptNotification(data) {
		this.doDataUpdate(data);
		this.updateMatchesAccepted();
		this.updateMatchesSent();
		sendNotification({
			user: data.user2,
			body: i18next.t("sidebar.matches.notification_messages.accepted")
		});
		navigateTo(`/pong/single/match/${data.id}`);
	}

	static matchCancelNotification(data) {
		this.doDataUpdate(data);
		this.updateMatchesReceived();
		sendNotification({
			user: data.user1,
			body: i18next.t("sidebar.matches.notification_messages.canceled")
		});
	}

	static matchFinishlNotification(data) {
		this.doDataUpdate(data);
		this.updateMatchesAccepted();
	}

	static async matchCreate(invited_user_id) {
		const response = await Matches.create(invited_user_id);

		if (response.success) {
			variables.socket.emit('match_invite', response.data);
			this.matchCreateNotification(response.data);
		}

		return response;
	}

	static async addFunctionality() {
		const wrapper = document.getElementById('matches-wrapper');

		const handleClick = async (target) => {
			const {
				action,
				id
			} = target;

			let response;
			switch (action) {
				case 'refuse':
					response = await Matches.refuse(id);
					if (response.success) {
						variables.socket.emit('match_refuse', response.data);
						this.doDataUpdate(response.data);
						this.updateMatchesAccepted();
						this.updateMatchesReceived();
					}
					break;

				case 'accept':
					response = await Matches.accept(id);
					if (response.success) {
						variables.socket.emit('match_accept', response.data);
						this.doDataUpdate(response.data);
						this.updateMatchesAccepted();
						this.updateMatchesReceived();
						sendNotification({
							user: response.data.user1,
							body: i18next.t("sidebar.matches.notification_messages.start")
						});
						navigateTo(`/pong/single/match/${response.data.id}`);
					}
					break;

				case 'cancel':
					response = await Matches.cancel(id);
					if (response.success) {
						variables.socket.emit('match_cancel', response.data);
						this.doDataUpdate(response.data);
						this.updateMatchesSent();
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
	}

	static async getHtml() {
		const response = await Matches.getAll();
		this.data = response.success ? response.data : [];

		return `
			<div id="matches-wrapper" class="sidebar-section">
				<h4 class="text-white mb-0">
					${i18next.t("sidebar.matches.title")}
				</h4>

				<div id="matches-accepted">
					${this.getMatchesAccepted()}
				</div>

				<div id="matches-received">
					${this.getMatchesReceived()}
				</div>

				<div id="matches-sent">
					${this.getMatchesSent()}
				</div>
			</div>
		`;
	}
}
