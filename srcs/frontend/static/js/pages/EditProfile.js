import { sendNotification } from "/static/js/services/index.js";
import { Users } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";

function getUserIDfromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
}

export default class extends Abstract {
    constructor(props) {
        super(props);
        this.params = props;
    }

    async addFunctionality() {
        const form = document.getElementById("form-edit-profile");

        // Fetch the current user data when the form loads
        await this.fetchUserData();

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
                    sendNotification({
                        body: 'The profile was successfully updated'
                    });
                    if (document.getElementById('is_2fa_enabled').checked) {
                        await this.generate2FAQRCode();
                        document.getElementById('2fa-text').textContent = "Disable Two-Factor Authentication";
                    } else {
                        this.clear2FAQRCode();
                        document.getElementById('2fa-text').textContent = "Enable Two-Factor Authentication";
                    }
                } else {
                    this.handleErrors(response.errors);
                }
            } else {
                form.classList.add("was-validated");
            }
        });
    }

    async fetchUserData() {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userId = getUserIDfromToken(accessToken);
            if (!userId) {
                console.error('User ID is not available in the token');
                return;
            }
            const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const responseData = await response.json();
            if (responseData.success) {
                const user = responseData.data;
                document.getElementById('is_2fa_enabled').checked = user.is_2fa_enabled;
                if (user.is_2fa_enabled) {
                    await this.generate2FAQRCode();
                    document.getElementById('2fa-text').textContent = "Disable Two-Factor Authentication";
                } else {
                    this.clear2FAQRCode();
                    document.getElementById('2fa-text').textContent = "Enable Two-Factor Authentication";
                }
            } else {
                console.error('Failed to fetch user data:', responseData);
            }
        } catch (error) {
            console.error('Network or other error:', error);
        }
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

    clear2FAQRCode() {
        document.getElementById('2fa-qrcode-section').style.display = 'none';
        document.getElementById('2fa-qrcode').src = '';
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
                    <label for="edit-email" class="form-label">
                        ${i18next.t('signUp.fields.email')}
                    </label>
                    <input type="text" class="form-control" id="edit-email" name="email">
                    <div id="emailError" class="invalid-feedback" style="display: none;"></div>
                </div>

                <div class="mb-4">
                    <label for="edit-username" class="form-label">
                        ${i18next.t('signUp.fields.username')}
                    </label>
                    <input type="text" class="form-control" id="edit-username" name="username">
                    <div id="usernameError" class="invalid-feedback" style="display: none;"></div>
                </div>

                <div class="mb-4">
                    <label for="edit-avatar" class="form-label">
                        ${i18next.t('signUp.fields.avatar')}
                    </label>
                    <input type="file" accept="image/png, image/jpg, image/jpeg" class="form-control" id="edit-avatar" name="avatar">
                    <div id="avatarError" class="invalid-feedback" style="display: none;"></div>
                </div>

                <div class="mb-4">
                    <label for="edit-password" class="form-label">
                        ${i18next.t('signUp.fields.password')}
                    </label>
                    <input type="password" class="form-control" id="edit-password" name="password">
                    <div id="passwordError" class="invalid-feedback" style="display: none;"></div>
                </div>

                <div class="mb-4">
                    <input type="checkbox" class="form-check-input" id="is_2fa_enabled" name="is_2fa_enabled">
                    <label for="is_2fa_enabled" class="form-check-label" id="2fa-text">
                        Enable Two-Factor Authentication
                    </label>
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