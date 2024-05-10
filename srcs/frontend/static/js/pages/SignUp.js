import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
    constructor(props) {
        super(props);
        this.params = props;
    }

    async addFunctionality() {
        document.querySelector("form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;

            // Clear previous errors
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
                    const response = await fetch('http://localhost:8000/api/create_user/', {
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
                        console.log('User registered successfully:', responseData);
                        // Optional: Redirect or clear form here
                        form.reset(); // Clear the form after successful registration
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
        if (responseData.email) {
            document.getElementById('emailError').textContent = responseData.email[0];
            document.getElementById('emailError').style.display = 'block';
        }
        if (responseData.username) {
            document.getElementById('usernameError').textContent = responseData.username[0];
            document.getElementById('usernameError').style.display = 'block';
        }
        if (responseData.password) {
            document.getElementById('passwordError').textContent = responseData.password[0];
            document.getElementById('passwordError').style.display = 'block';
        }
    }

    async getHtml() {
        return `
            <h1 class="mb-4">Sign Up</h1>
            <form class="needs-validation" novalidate>
                <div class="mb-4">
                    <label for="email" class="form-label">Email:</label>
                    <input type="text" class="form-control" id="email" name="email">
                    <div id="emailError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4">
                    <label for="username" class="form-label">Username:</label>
                    <input type="text" class="form-control" id="username" name="username">
                    <div id="usernameError" class="invalid-feedback" style="display: none;"></div>
                </div>
                <div class="mb-4">
                    <label for="password" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="password" name="password">
                    <div id="passwordError" class="invalid-feedback">Please enter a valid password.</div>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
            </form>
        `;
    }
}
