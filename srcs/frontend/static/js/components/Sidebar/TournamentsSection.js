import { Tournaments } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";
import { User } from "/static/js/generators/index.js";
import { navigateTo, sendNotification } from "/static/js/services/index.js";

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
		const element = document.querySelector(`#tournaments-wrapper [data-bs-target="#${options.id}"]`);
		const isExpanded = !options.title || (element && (element.getAttribute("aria-expanded") === 'true'));
		const isAccepted = (options.id == 'tournaments-accepted-list');

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
							<div class="sidebar-section-element d-flex justify-content-between gap-1 p-1 bg-light rounded" data-tournament-id="${id}" ${isAccepted ? `href="/pong/single/tournament/${id}" data-link` : ''}>
								${User.getBadge(user)}

								<div class="d-flex align-items-center gap-1">
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

	static getTournamentsAccepted() {
		const list = this.data.filter(el => el.was_accepted && !el.was_canceled && !el.was_refused && !el.has_finished)
			.map(({ id, user1, user2 }) => ({ id, user: (user1.id == USER_ID) ? user2 : user1 }));

		const htmlList = this.getList(list, {
			id: 'tournaments-accepted-list',
			actions: []
		});

		return `
			<div>
				${htmlList}
			</div>
		`;
	}

	static updateTournamentsAccepted() {
		const wrapper = document.querySelector('#tournaments-wrapper #tournaments-accepted');
		if (wrapper) {
			wrapper.innerHTML = this.getTournamentsAccepted();
		}
	}

	static getTournamentsReceived() {
		const list = this.data.filter(el => !el.was_accepted && !el.was_canceled && !el.was_refused && (el.user2.id == USER_ID))
			.map(({ id, user1 }) => ({ id, user: user1 }));

		const htmlList = this.getList(list, {
			id: 'tournaments-received-list',
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

	static updateTournamentsReceived() {
		const wrapper = document.querySelector('#tournaments-wrapper #tournaments-received');
		if (wrapper) {
			wrapper.innerHTML = this.getTournamentsReceived();
		}
	}

	static getTournamentsSent() {
		const list = this.data.filter(el => !el.was_accepted && !el.was_canceled && !el.was_refused && (el.user1.id == USER_ID))
			.map(({ id, user2 }) => ({ id, user: user2 }));

		const htmlList = this.getList(list, {
			id: 'tournaments-sent-list',
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

	static updateTournamentsSent() {
		const wrapper = document.querySelector('#tournaments-wrapper #tournaments-sent');
		if (wrapper) {
			wrapper.innerHTML = this.getTournamentsSent();
		}
	}

	static tournamentCreateNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsSent();
		sendNotification({
			user: data.user2,
			body: i18next.t("sidebar.tournaments.notification_messages.create")
		});
		navigateTo(`/pong/single/tournament/${data.id}`);
	}

	static tournamentInviteNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsReceived();
		sendNotification({
			user: data.user1,
			body: i18next.t("sidebar.tournaments.notification_messages.sent")
		});
	}

	static tournamentRefuseNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsAccepted();
		this.updateTournamentsSent();
		sendNotification({
			user: data.user2,
			body: i18next.t("sidebar.tournaments.notification_messages.refused")
		});
	}

	static tournamentAcceptNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsAccepted();
		this.updateTournamentsSent();
		sendNotification({
			user: data.user2,
			body: i18next.t("sidebar.tournaments.notification_messages.accepted")
		});
		navigateTo(`/pong/single/tournament/${data.id}`);
	}

	static tournamentCancelNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsReceived();
		sendNotification({
			user: data.user1,
			body: i18next.t("sidebar.tournaments.notification_messages.canceled")
		});
	}

	static tournamentFinishlNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsAccepted();
	}

	static async tournamentCreate(invited_user_id) {
		const response = await Tournaments.create(invited_user_id);

		if (response.success) {
			SOCKET.emit('tournament_invite', response.data);
			this.tournamentCreateNotification(response.data);
		}

		return response;
	}

	static async addFunctionality() {
		const wrapper = document.getElementById('tournaments-wrapper');

		const handleClick = async (target) => {
			const {
				action,
				id
			} = target;

			let response;
			switch (action) {
				case 'refuse':
					response = await Tournaments.refuse(id);
					if (response.success) {
						SOCKET.emit('tournament_refuse', response.data);
						this.doDataUpdate(response.data);
						this.updateTournamentsAccepted();
						this.updateTournamentsReceived();
					}
					break;

				case 'accept':
					response = await Tournaments.accept(id);
					if (response.success) {
						SOCKET.emit('tournament_accept', response.data);
						this.doDataUpdate(response.data);
						this.updateTournamentsAccepted();
						this.updateTournamentsReceived();
						sendNotification({
							user: response.data.user1,
							body: i18next.t("sidebar.tournaments.notification_messages.start")
						});
						navigateTo(`/pong/single/tournament/${response.data.id}`);
					}
					break;

				case 'cancel':
					response = await Tournaments.cancel(id);
					if (response.success) {
						SOCKET.emit('tournament_cancel', response.data);
						this.doDataUpdate(response.data);
						this.updateTournamentsSent();
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
		const response = await Tournaments.getAll();
		this.data = response.success ? response.data : [];

		return `
			<div id="tournaments-wrapper" class="sidebar-section">
				<h4 class="text-white mb-0">
					${i18next.t("sidebar.tournaments.title")}
				</h4>

				<div id="tournaments-accepted">
					${this.getTournamentsAccepted()}
				</div>

				<div id="tournaments-received">
					${this.getTournamentsReceived()}
				</div>

				<div id="tournaments-sent">
					${this.getTournamentsSent()}
				</div>
			</div>
		`;
	}
}
