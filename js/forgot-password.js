document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('email');
    const submitButton = document.querySelector('button[type="submit"]');

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

        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            removeError(emailInput);
        }

        submitButton.disabled = !isValid;
        return isValid;
    }

    forgotPasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateInputs()) {
            try {
                const response = await fetch('http://localhost:3000/user/forgotpassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: emailInput.value.trim() })
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert('Password reset link has been sent to your email');
                    window.location.href = 'reset-password.html'; // Redirect to reset password page
                } else {
                    showError(emailInput, data.message || 'Email not found in our records');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Something went wrong. Please try again later.');
            }
        }
    });

    emailInput.addEventListener('input', validateInputs);

    validateInputs();
});