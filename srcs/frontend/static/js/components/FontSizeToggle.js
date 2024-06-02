import { Abstract } from "./index.js";

export default class extends Abstract {
	constructor(props) {
		super(props);

		this.params = props;
		this.defaultFontSize = localStorage.getItem('fontSize') || 'large';
	}

	async addFunctionality() {
		const doAction = (size, callback) => {
			const toggles = document.querySelectorAll(`#font-size-toggle [data-font-size="${size}"]`);
			toggles.forEach(toggle => {
				if (toggle) {
					callback(toggle);
				}
			});
		}

		const setFontSmall = () => {
			document.body.classList.remove('font-large');
			localStorage.setItem('fontSize', 'small');

			doAction('small', (smallToggle) => smallToggle.classList.add("active"));
			doAction('large', (largeToggle) => largeToggle.classList.remove("active"));
		}

		const setFontLarge = () => {
			document.body.classList.add('font-large');
			localStorage.setItem('fontSize', 'large');

			doAction('small', (smallToggle) => smallToggle.classList.remove("active"));
			doAction('large', (largeToggle) => largeToggle.classList.add("active"));
		}

		if (localStorage.getItem('fontSize')) {
			if (localStorage.getItem('fontSize') == 'large') {
				setFontLarge();
			} else {
				setFontSmall();
			}
		}

		doAction('small', (smallToggle) => smallToggle.addEventListener('click', setFontSmall));
		doAction('large', (largeToggle) => largeToggle.addEventListener('click', setFontLarge));
	}

	async getHtml() {
		return `
			<div id="font-size-toggle" class="btn-group font-size-toggle__wrapper" role="group">
				<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
					${i18next.t("navbar.font")}
				</button>

				<ul class="dropdown-menu dropdown-menu-end">
					<li>
						<button class="dropdown-item ${this.defaultFontSize == "small" ? "active" : ""}" type="button" data-font-size="small">
							${i18next.t("navbar.small")}
						</button>
					</li>
					<li>
						<button class="dropdown-item ${this.defaultFontSize == "large" ? "active" : ""}" type="button" data-font-size="large">
							${i18next.t("navbar.large")}
						</button>
					</li>
				</ul>
			</div>
		`;
	}
}
