import { Abstract } from "/static/js/components/index.js";
import { getCSRFToken, navigateTo } from "/static/js/services/index.js";

export default class extends Abstract {
    constructor(props) {
        super(props);
        this.params = props;
    }

    async addFunctionality() {
        const form = document.getElementById("form-sign-up");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            form.querySelectorAll('.invalid-feedback').forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
            });

            if (form.checkValidity()) {
                const formData = new FormData(form);
                formData.append('preferred_language', i18next.language || 'en');

                try {
                    const response = await fetch('http://localhost:8000/api/users', {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': getCSRFToken()
                        },
                        body: formData
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

    handleErrors(errors) {
        const form = document.getElementById("form-sign-up");

        const handleError = (key, errors) => {
            const errorField = form.querySelector(`#${key}Error`);
            if (!errorField) return;

            if (errors?.length) {
                const errorKey = `signUp.validation.${errors[0].includes(' ') ? 'default_error' : errors[0]}`;
                const errorMessage = i18next.t(errorKey);
                errorField.textContent = errorMessage;
                errorField.style.display = 'block';
            }
        }

        handleError('email', errors.email);
        handleError('username', errors.username);
        handleError('avatar', errors.avatar);
        handleError('password', errors.password);
    }    

    async getHtml() {
        return `
            <h1 class="mb-4">${i18next.t('signUp.title')}</h1>
            <form id="form-sign-up" class="needs-validation" novalidate>
                <div class="mb-4">
                    <label for="email" class="form-label">${i18next.t('signUp.fields.email')}</label>
                    <input type="text" class="form-control" id="email" name="email">
                    <div id="emailError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4">
                    <label for="username" class="form-label">${i18next.t('signUp.fields.username')}</label>
                    <input type="text" class="form-control" id="username" name="username">
                    <div id="usernameError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4">
                    <label for="avatar" class="form-label">${i18next.t('signUp.fields.avatar')}</label>
                    <input type="file" accept="image/png, image/jpg, image/jpeg" class="form-control" id="avatar" name="avatar">
                    <div id="avatarError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4">
                    <label for="password" class="form-label">${i18next.t('signUp.fields.password')}</label>
                    <input type="password" class="form-control" id="password" name="password">
                    <div id="passwordError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <button type="submit" class="btn btn-primary">${i18next.t('signUp.submitButton')}</button>
            </form>
        `;
    }
}
