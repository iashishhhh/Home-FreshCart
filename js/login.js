document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const checkboxInput = document.getElementById('checkbox');
    const loginButton = document.querySelector('button[type="submit"]');

    // Function to show error
    function showError(input, message) {
        const formControl = input.parentElement;
        const existingError = formControl.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger mt-1';
        errorDiv.innerText = message;
        formControl.appendChild(errorDiv);

        input.classList.add('is-invalid');
        input.style.borderColor = 'red';
    }

    // Function to remove error
    function removeError(input) {
        const formControl = input.parentElement;
        const errorDiv = formControl.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('is-invalid');
        input.style.borderColor = '';
    }

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function validateInputs() {
        let isValid = true;

        // Validate email
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            removeError(emailInput);
        }

        // Validate password
        if (passwordInput.value.trim() === '') {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            removeError(passwordInput);
        }

        // Validate checkbox
        if (!checkboxInput.checked) {
            showError(checkboxInput, 'You must accept the terms and conditions');
            isValid = false;
        } else {
            removeError(checkboxInput);
        }

        return isValid;
    }

    async function loginApi(email, password) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                console.log('Login successful:', data);
                // alert('Login successful');
                window.location.href = 'index.html';
            } else {
                const error = await response.json();
                console.error('Login failed:', error);
                alert(error.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again later.');
        }
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

            if (validateInputs()) {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            loginApi(email, password);
        } else {
            // Focus on the first invalid input
            const firstInvalid = loginForm.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
});



//password hide and show

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const toggleButton = this;

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleButton.textContent = '🙈';
    } else {
        passwordField.type = 'password';
        toggleButton.textContent = '👁️';
    }
});