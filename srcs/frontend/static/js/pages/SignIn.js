import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
    constructor(props) {
        super(props);
        this.params = props;
    }

    async addFunctionality() {
        const form = document.querySelector("form");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

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
                        console.log('Login successful:', responseData);
                        form.reset();
                        window.location.href = '/dashboard';
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
    
        if (responseData.username_email) {
            document.getElementById('usernameEmailError').textContent = responseData.username_email[0];
            document.getElementById('usernameEmailError').style.display = 'block';
        }
    
        if (responseData.password) {
            const passwordError = document.getElementById('passwordError');
            if (passwordError) {
                passwordError.textContent = responseData.password[0];
                passwordError.style.display = 'block';
            }
        }
    
        if (responseData.non_field_errors) {
            const generalError = document.getElementById('generalLoginError');
            if (generalError) {
                generalError.textContent = responseData.non_field_errors.join(', ');
                generalError.style.display = 'block';
            }
        }
    }
    
    async getHtml() {
        return `
            <h1 class="mb-4">Sign In</h1>
            <form class="needs-validation" novalidate>
                <div class="mb-4">
                    <label for="username_email" class="form-label">Email or Username:</label>
                    <input type="text" class="form-control" id="username_email" name="username_email">
                    <div id="usernameEmailError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4">
                    <label for="password" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="password" name="password">
                    <div id="passwordError" class="invalid-feedback" style="display: none;"></div>
                    <div id="generalLoginError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <button type="submit" class="btn btn-primary">Sign In</button>
            </form>
        `;
    }
}    