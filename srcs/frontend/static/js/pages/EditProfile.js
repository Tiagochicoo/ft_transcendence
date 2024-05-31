import { sendNotification } from "/static/js/services/index.js";
import { Users } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
    constructor(props) {
        super(props);
        this.params = props;
    }

    async addFunctionality() {
        const form = document.getElementById("form-edit-profile");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            form.querySelectorAll('.invalid-feedback').forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
            });

            if (form.checkValidity()) {
                const formData = new FormData(form);
                formData.append('is_2fa_enabled', document.getElementById('is_2fa_enabled').checked);

                const response = await Users.update(formData);

                if (response.success) {
                    this.clearFields();
                    sendNotification({
                        body: 'The profile was successfully updated'
                    });
                    if (document.getElementById('is_2fa_enabled').checked) {
                        this.generate2FAQRCode();
                    }
                } else {
                    this.handleErrors(response.errors);
                }
            } else {
                form.classList.add("was-validated");
            }
        });
    }

    async generate2FAQRCode() {
        try {
            const response = await fetch('http://localhost:8000/api/generate-2fa-secret', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const responseData = await response.json();
            if (response.ok) {
                document.getElementById('2fa-qrcode').src = `data:image/png;base64,${responseData.qr_code}`;
                document.getElementById('2fa-qrcode-section').style.display = 'block';
            } else {
                console.error('Failed to generate 2FA QR code:', responseData);
            }
        } catch (error) {
            console.error('Network or other error:', error);
        }
    }

    handleErrors(errors) {
        const form = document.getElementById("form-edit-profile");

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

    clearFields() {
        const form = document.getElementById("form-edit-profile");
        const formFields = form.querySelectorAll('input');
        formFields.forEach(field => field.value = '');
    }

    async getHtml() {
        return `
            <h1 class="mb-4">
                ${i18next.t('editProfile.title')}
            </h1>

            <form id="form-edit-profile" class="needs-validation" novalidate>
                <div class="mb-4">
                    <label for="email" class="form-label">
                        ${i18next.t('signUp.fields.email')}
                    </label>
                    <input type="text" class="form-control" id="email" name="email">
                    <div id="emailError" class="invalid-feedback" style="display: none;"></div>
                </div>

                <div class="mb-4">
                    <label for="username" class="form-label">
                        ${i18next.t('signUp.fields.username')}
                    </label>
                    <input type="text" class="form-control" id="username" name="username">
                    <div id="usernameError" class="invalid-feedback" style="display: none;"></div>
                </div>

                <div class="mb-4">
                    <label for="avatar" class="form-label">
                        ${i18next.t('signUp.fields.avatar')}
                    </label>
                    <input type="file" accept="image/png, image/jpg, image/jpeg" class="form-control" id="avatar" name="avatar">
                    <div id="avatarError" class="invalid-feedback" style="display: none;"></div>
                </div>

                <div class="mb-4">
                    <label for="password" class="form-label">
                        ${i18next.t('signUp.fields.password')}
                    </label>
                    <input type="password" class="form-control" id="password" name="password">
                    <div id="passwordError" class="invalid-feedback" style="display: none;"></div>
                </div>

                <div class="mb-4">
                    <label for="is_2fa_enabled" class="form-label">
                        Enable Two-Factor Authentication
                    </label>
                    <input type="checkbox" class="form-check-input" id="is_2fa_enabled" name="is_2fa_enabled">
                </div>

                <div class="mb-4" id="2fa-qrcode-section" style="display: none;">
                    <label for="2fa-qrcode" class="form-label">
                        Scan this QR code with your authenticator app
                    </label>
                    <img id="2fa-qrcode" src="" alt="2FA QR Code">
                </div>

                <button type="submit" class="btn btn-primary">
                    ${i18next.t('signUp.submitButton')}
                </button>
            </form>
        `;
    }
}