document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const checkboxInput = document.getElementById('checkbox');
    const loginButton = document.querySelector('button[type="submit"]');

    // Function to show error
    function showError(input, message) {
        const formControl = input.parentElement;
        // Remove existing error message if any
        const existingError = formControl.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger mt-1';
        errorDiv.innerText = message;
        formControl.appendChild(errorDiv);
        
        // Add error class to input
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

    // Function to validate email format
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Function to validate form on input
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

        // Enable/disable login button based on validation
        loginButton.disabled = !isValid;
        return isValid;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateInputs()) {
            window.location.href = 'loginsite.html';
        }
    });

    // Validate on input
    emailInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);
    checkboxInput.addEventListener('change', validateInputs);

    // Initial validation
    validateInputs();
});