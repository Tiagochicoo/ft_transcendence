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
						${list.map(({ id, user, tournament }) => `
							<div class="sidebar-section-element d-flex align-items-center justify-content-between gap-1 p-1 bg-light rounded" data-tournament-id="${tournament.id}" ${isAccepted ? `href="/pong/tournament/${tournament.id}/rounds" data-link` : ''}>
								${User.getBadge(user)}

								${isAccepted ? `
									<strong class="px-2">
										#${tournament.id}
									</strong>
								` : ''}

								${!tournament.has_started ? `
									<div class="d-flex align-items-center gap-1">
										${options.actions.map(({ action, icon }) => `
											<button class="bg-transparent p-1 border-0" data-action="${action}" data-id="${id}">
												${icon}
											</button>
										`).join("")}
									</div>
								` : ''}
							</div>
						`).join("")}
					</ul>
				</div>
			` : ''}
		`;
	}

	static getTournamentsAccepted() {
		const list = this.data.filter(el => el.was_accepted && !el.was_canceled && !el.was_refused)
			.map(({ id, tournament }) => ({ id, tournament }));

		const htmlList = this.getList(list, {
			id: 'tournaments-accepted-list',
			actions: [
				{
					action: 'none',
					icon: '<i class="bi bi-hourglass-split"></i>'
				},
			]
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
		const list = this.data.filter(el => !el.was_accepted && !el.was_canceled && !el.was_refused && (el.user.id == USER_ID) && (el.tournament.creator.id != USER_ID) && !el.tournament.has_started && !el.tournament.has_finished)
			.map(({ id, tournament }) => ({ id, user: tournament.creator, tournament }));

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

	static tournamentCreateNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsAccepted();
		sendNotification({
			body: i18next.t("sidebar.tournaments.notification_messages.create")
		});
		navigateTo(`/pong/tournament/${data.tournament.id}/rounds`);
	}

	static tournamentInviteNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsReceived();
		sendNotification({
			user: data.tournament.creator,
			body: i18next.t("sidebar.tournaments.notification_messages.sent")
		});
	}

	static tournamentRefuseNotification(data) {
		sendNotification({
			user: data.user,
			body: i18next.t("sidebar.tournaments.notification_messages.refused")
		});
	}

	static tournamentAcceptNotification(data) {
		sendNotification({
			user: data.user,
			body: i18next.t("sidebar.tournaments.notification_messages.accepted")
		});
	}

	static tournamentStartNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsAccepted();
		sendNotification({
			user: data.tournament.creator.id,
			body: i18next.t("sidebar.tournaments.notification_messages.start")
		});
		navigateTo(`/pong/tournament/${data.tournament.id}/rounds`);
	}

	static tournamentFinishlNotification(data) {
		this.doDataUpdate(data);
		this.updateTournamentsAccepted();
	}

	static async tournamentCreate(invited_user_ids) {
		const response = await Tournaments.create(invited_user_ids);

		if (response.success) {
			SOCKET.emit('tournament_invite', response.data.tournament.id);
			this.tournamentCreateNotification(response.data);
		}

		return response;
	}

	static async tournamentOpenMatch(matchId) {
		sendNotification({
			body: i18next.t("sidebar.tournaments.notification_messages.match_start")
		});
		navigateTo(`/pong/tournament/match/${matchId}`);
	}

	static async tournamentMatchFinish(tournamentUser) {
		this.updateTournamentsPageContent(tournamentUser.tournament.id);
	}

	static async tournamentRoundStart(match) {
		sendNotification({
			body: i18next.t("sidebar.tournaments.notification_messages.round_start")
		});
		navigateTo(`/pong/tournament/${match.tournament.id}/rounds`);
	}

	static async tournamentFinish(tournament) {
		sendNotification({
			body: i18next.t("sidebar.tournaments.notification_messages.finish")
		});
		navigateTo(`/pong/tournament/${tournament.id}/rounds`);
	}

	static async getTournamentsPageContent(tournamentId) {
		try {
			let tournamentUsers = [];
			let matches = [];
			let rounds = new Array(7).fill(null).map(() => ({
				user1: {},
				user2: {},
				winner: {},
			}));;
			let winner;

			const generateRounds = () => {
				// Quarterfinals
				for (let i = 0, j = 0; i < 4; i++) {
					rounds[i].user1 = tournamentUsers[j++].user;
					rounds[i].user2 = tournamentUsers[j++].user;
					const match = matches.find(({ user1, user2 }) => (
						(user1.id == rounds[i].user1.id) && (user2.id == rounds[i].user2.id) ||
						(user1.id == rounds[i].user2.id) && (user2.id == rounds[i].user1.id)
					));
					if (match && match.winner?.id) {
						rounds[i].winner = match.winner;
					}
				}

				// Semifinals
				for (let i = 4, j = 0; i < 6; i++, j += 2) {
					if (rounds[j].winner) {
						rounds[i].user1 = rounds[j].winner;
					}
					if (rounds[j + 1].winner) {
						rounds[i].user2 = rounds[j + 1].winner;
					}
					const match = matches.find(({ user1, user2 }) => (
						(user1.id == rounds[i].user1.id) && (user2.id == rounds[i].user2.id) ||
						(user1.id == rounds[i].user2.id) && (user2.id == rounds[i].user1.id)
					));
					if (match && match.winner?.id) {
						rounds[i].winner = match.winner;
					}
				}

				// Finals
				if (rounds[4].winner) {
					rounds[6].user1 = rounds[4].winner;
				}
				if (rounds[5].winner) {
					rounds[6].user2 = rounds[5].winner;
				}
				const match = matches.find(({ user1, user2 }) => (
					(user1.id == rounds[6].user1.id) && (user2.id == rounds[6].user2.id) ||
					(user1.id == rounds[6].user2.id) && (user2.id == rounds[6].user1.id)
				));
				if (match && match.winner?.id) {
					rounds[6].winner = match.winner;
					winner = match.winner;
				}
			}

			const getRound = (round) => {
				return `
					<div class="match">
						<div class="player ${round.winner.id ? ((round.user1.id == round.winner.id) ? "round-winner" : "round-looser") : ""}">
							${User.getBadge(round.user1)}
						</div>
						<div class="player ${round.winner.id ? ((round.user2.id == round.winner.id) ? "round-winner" : "round-looser") : ""}">
							${User.getBadge(round.user2)}
						</div>
					</div>
				`;
			}

			const getBrackets = () => {
				return `
					<div class='bracket'>
						<div class='round'>
							${rounds.slice(0, 4).map(round => getRound(round)).join("")}
						</div>
						<div class='round'>
							${rounds.slice(4, 6).map(round => getRound(round)).join("")}
						</div>
						<div class='round'>
							${getRound(rounds[6])}
						</div>

						<div class='round'>
							<div class="match winner">
								<div class="player">
									${i18next.t("pong.winner")}
								</div>
								<div class="player">
									${User.getBadge(winner)}
								</div>
							</div>
						</div>
					</div>
				`;
			}

			let response = await Tournaments.getAllTournamentUsers(tournamentId);
			tournamentUsers = response.data;

			response = await Tournaments.getAllMatches(tournamentId);
			matches = response.data;

			generateRounds();

			return getBrackets();
		} catch(e) {
			return '';
		}
	}

	static async updateTournamentsPageContent(tournamentId) {
		const tournamentPageBracket = document.getElementById("tournament-bracket");
		if (tournamentPageBracket) {
			tournamentPageBracket.innerHTML = await this.getTournamentsPageContent(tournamentId);
		}
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
						navigateTo(`/pong/tournament/${response.data.tournament.id}/rounds`);
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
			</div>
		`;
	}
}
