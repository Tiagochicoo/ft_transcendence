import { Abstract } from "/static/js/components/index.js";
import { getCSRFToken, getUserIDfromToken, checkUserPreferredLanguage, navigateTo } from "/static/js/services/index.js";

export default class extends Abstract {
    constructor(props) {
        super(props);
        this.params = props;
        this.state = {
            is2FARequired: false,
            userId: null
        };
    }

    async addFunctionality() {
        const form = document.getElementById("form-sign-in");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            form.querySelectorAll('.invalid-feedback').forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
            });

            const formData = new FormData(form);
            const data = {};
            for (const key of formData.keys()) {
                data[key] = formData.get(key);
            }

            if (this.state.is2FARequired) {
                // Handle 2FA code submission
                try {
                    const response = await fetch('http://localhost:8000/api/verify-2fa/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCSRFToken()
                        },
                        body: JSON.stringify({
                            user_id: this.state.userId,
                            two_factor_code: data.two_factor_code
                        })
                    });

                    const responseData = await response.json();
                    console.log("2FA verification response:", responseData);

                    if (!response.ok) {
                        this.handleErrors(responseData.errors);
                    } else {
                        localStorage.setItem('accessToken', responseData.data.access);
                        localStorage.setItem('refreshToken', responseData.data.refresh);
                        console.log('2FA verification successful:', responseData);

                        // Update the language with the one the user preferes
                        const userId = getUserIDfromToken(responseData.data.access);
                        checkUserPreferredLanguage(userId);

                        navigateTo('/dashboard/general');
                    }
                } catch (error) {
                    console.error('Network or other error:', error);
                }
            } else {
                // Initial login request
                try {
                    const response = await fetch('http://localhost:8000/api/sign-in', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCSRFToken()
                        },
                        body: JSON.stringify(data)
                    });

                    const responseData = await response.json();
                    console.log("Server response:", responseData);

                    if (!responseData.success) {
                        this.handleErrors(responseData.errors);
                        form.classList.add("was-validated"); // Add this line to indicate validation failure
                    } else if (responseData['2fa_required']) {
                        this.setState({ is2FARequired: true, userId: responseData.user_id });
                        document.getElementById('2fa-code').style.display = 'block';
                    } else {
                        localStorage.setItem('accessToken', responseData.data.access);
                        localStorage.setItem('refreshToken', responseData.data.refresh);
                        console.log('Login successful:', responseData);

                        const userId = getUserIDfromToken(responseData.data.access);
                        checkUserPreferredLanguage(userId);

                        navigateTo('/dashboard/general');
                    }
                } catch (error) {
                    console.error('Network or other error:', error);
                }
            }
        });
    }

    handleErrors(errors) {
        const form = document.getElementById("form-sign-in");

        if (errors.username_email) {
            const errorKey = `signIn.validation.${errors.username_email[0]}`;
            const errorMessage = i18next.t(errorKey);
            form.querySelector('#usernameEmailError').textContent = errorMessage;
            form.querySelector('#usernameEmailError').style.display = 'block';
        }
        if (errors.password) {
            const errorKey = `signIn.validation.${errors.password[0]}`;
            const errorMessage = i18next.t(errorKey);
            const passwordError = form.querySelector('#passwordError');
            if (passwordError) {
                passwordError.textContent = errorMessage;
                passwordError.style.display = 'block';
            }
        }
        if (errors.non_field_errors) {
            const errorKey = `signIn.validation.${errors.non_field_errors[0]}`;
            const errorMessage = i18next.t(errorKey);
            const generalError = form.querySelector('#generalLoginError');
            if (generalError) {
                generalError.textContent = errorMessage;
                generalError.style.display = 'block';
            }
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    async getHtml() {
        return `
            <h1 class="mb-4">${i18next.t('signIn.title')}</h1>
            <form id="form-sign-in" class="needs-validation" novalidate>
                <div class="mb-4">
                    <label for="username_email" class="form-label">${i18next.t('signIn.fields.email.label')}</label>
                    <input type="text" class="form-control" id="username_email" name="username_email">
                    <div id="usernameEmailError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4">
                    <label for="password" class="form-label">${i18next.t('signIn.fields.password.label')}</label>
                    <input type="password" class="form-control" id="password" name="password">
                    <div id="passwordError" class="invalid-feedback" style="display: none;"></div>
                    <div id="generalLoginError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4" id="2fa-code" style="display: none;">
                    <label for="two_factor_code" class="form-label">Two-Factor Authentication Code</label>
                    <input type="text" class="form-control" id="two_factor_code" name="two_factor_code">
                    <div id="twoFactorCodeError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <button type="submit" class="btn btn-primary">${i18next.t('signIn.submitButton')}</button>
            </form>
        `;
    }
}