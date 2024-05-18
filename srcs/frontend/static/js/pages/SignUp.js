import { Abstract } from "/static/js/components/index.js";
import { navigateTo } from "/static/js/services/index.js";

export default class extends Abstract {
    constructor(props) {
        super(props);
        this.params = props;
    }

    async addFunctionality() {
        document.querySelector("form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;

            document.querySelectorAll('.invalid-feedback').forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
            });

            if (form.checkValidity()) {
                const formData = new FormData(form);
                const data = {};
                for (const key of formData.keys()) {
                    data[key] = formData.get(key);
                }
                console.log("Submitting data:", data);

                try {
                    const response = await fetch('http://localhost:8000/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': this.getCSRFToken()
                        },
                        body: JSON.stringify(data)
                    });

                    const responseData = await response.json();
                    console.log("Server response:", responseData);

                    if (!responseData.success) {
                        this.handleErrors(responseData.errors);
                    } else {
                        console.log('User registered successfully:', responseData);
                        navigateTo('/sign-in');
                    }
                } catch (error) {
                    console.error('Network or other error:', error);
                }
            } else {
                form.classList.add("was-validated");
            }
        });
    }

    getCSRFToken() {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; csrftoken=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : '';
    }

    handleErrors(errors) {
        if (errors.email) {
            const emailErrorKey = `signUp.validation.${errors.email[0]}`;
            const emailErrorMessage = i18next.t(emailErrorKey);
            document.getElementById('emailError').textContent = emailErrorMessage;
            document.getElementById('emailError').style.display = 'block';
        }
        if (errors.username) {
            const usernameErrorKey = `signUp.validation.${errors.username[0]}`;
            const usernameErrorMessage = i18next.t(usernameErrorKey);
            document.getElementById('usernameError').textContent = usernameErrorMessage;
            document.getElementById('usernameError').style.display = 'block';
        }
        if (errors.password) {
            const passwordErrorKey = `signUp.validation.${errors.password[0]}`;
            const passwordErrorMessage = i18next.t(passwordErrorKey);
            document.getElementById('passwordError').textContent = passwordErrorMessage;
            document.getElementById('passwordError').style.display = 'block';
        }
    }    

    async getHtml() {
        return `
            <h1 class="mb-4">${i18next.t('signUp.title')}</h1>
            <form class="needs-validation" novalidate>
                <div class="mb-4">
                    <label for="email" class="form-label">${i18next.t('signUp.fields.email.label')}</label>
                    <input type="text" class="form-control" id="email" name="email">
                    <div id="emailError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4">
                    <label for="username" class="form-label">${i18next.t('signUp.fields.username.label')}</label>
                    <input type="text" class="form-control" id="username" name="username">
                    <div id="usernameError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4">
                    <label for="password" class="form-label">${i18next.t('signUp.fields.password.label')}</label>
                    <input type="password" class="form-control" id="password" name="password">
                    <div id="passwordError" class="invalid-feedback" style="display: none;">${i18next.t('signUp.fields.password.invalidFeedback')}</div>
                </div>
                <button type="submit" class="btn btn-primary">${i18next.t('signUp.submitButton')}</button>
            </form>
        `;
    }
}    