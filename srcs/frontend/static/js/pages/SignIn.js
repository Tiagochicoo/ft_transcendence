import { Abstract } from "/static/js/components/index.js";
import { navigateTo } from "/static/js/services/index.js";

export default class extends Abstract {
    constructor(props) {
        super(props);
        this.params = props;
    }

    async addFunctionality() {
        const form = document.getElementById("form-sign-in");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            form.querySelectorAll('.invalid-feedback').forEach(element => {
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
                    const response = await fetch('http://localhost:8000/api/sign-in/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': this.getCSRFToken()
                        },
                        body: JSON.stringify(data)
                    });

                    const responseData = await response.json();
                    console.log("Server response:", responseData);

                    if (!response.ok) {
                        this.handleErrors(responseData);
                    } else {
                        localStorage.setItem('accessToken', responseData.access);
                        localStorage.setItem('refreshToken', responseData.refresh);
                        console.log('Login successful:', responseData);
                        navigateTo('/dashboard/general');
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

    handleErrors(responseData) {
        const form = document.getElementById("form-sign-in");

        if (responseData.username_email) {
          const errorKey = `signIn.validation.${responseData.username_email[0]}`;
          const errorMessage = i18next.t(errorKey);
          form.querySelector('#usernameEmailError').textContent = errorMessage;
          form.querySelector('#usernameEmailError').style.display = 'block';
        }
        if (responseData.password) {
          const errorKey = `signIn.validation.${responseData.password[0]}`;
          const errorMessage = i18next.t(errorKey);
          const passwordError = form.querySelector('#passwordError');
          if (passwordError) {
            passwordError.textContent = errorMessage;
            passwordError.style.display = 'block';
          }
        }
        if (responseData.non_field_errors) {
          const errorKey = `signIn.validation.${responseData.non_field_errors[0]}`;
          const errorMessage = i18next.t(errorKey);
          const generalError = form.querySelector('#generalLoginError');
          if (generalError) {
            generalError.textContent = errorMessage;
            generalError.style.display = 'block';
          }
        }
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
                <button type="submit" class="btn btn-primary">${i18next.t('signIn.submitButton')}</button>
            </form>
        `;
    }    
}
