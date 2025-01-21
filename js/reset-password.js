function validateForm(event) {
    event.preventDefault();
    
    // Get form elements
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Get error elements
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    
    newPasswordError.textContent = '';
    confirmPasswordError.textContent = '';
    
    let isValid = true;
    
    if (!newPassword) {
        newPasswordError.textContent = 'Password is required';
        isValid = false;
    } else if (newPassword.length < 8) {
        newPasswordError.textContent = 'Password must be at least 8 characters long';
        isValid = false;
    }
    
    if (!confirmPassword) {
        confirmPasswordError.textContent = 'Please confirm your password';
        isValid = false;
    } else if (confirmPassword !== newPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        isValid = false;
    }
    
    if (isValid) {
        alert('Password reset successful!');
        window.location.href = 'loginsite.html'; 
    }
    
    return false;
}

function updateButtonState() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitButton = document.getElementById('submitButton'); 

    submitButton.disabled = !newPassword || !confirmPassword;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('newPassword').addEventListener('input', updateButtonState);
    document.getElementById('confirmPassword').addEventListener('input', updateButtonState);
    // Initialize button state
    updateButtonState();
}); 

document.addEventListener('DOMContentLoaded', function () {
    const resetpasswordForm = document.getElementById('resetPasswordForm');
    const newpasswordInput = document.getElementById('newPassword');
    const confirmpasswordInput = document.getElementById('confirmPassword');
    const resetError = document.getElementById('resetError');

    resetpasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newpassword = newpasswordInput.value.trim();
        const confirmpassword = confirmpasswordInput.value.trim();

        // Validate passwords
        if (newpassword !== confirmpassword) {
            resetError.textContent = 'Passwords do not match. Please try again.';
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            resetError.textContent = 'No token found. Please log in again.';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/user/updatepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ newpassword,confirmpassword }),
            });

            if (response.status === 200) {
                resetError.textContent = '';
                alert('Password reset successful!');
                window.location.href = 'login.html';  // Redirect to login page after reset
            } else {
                const data = await response.json();
                resetError.textContent = data.message || 'Failed to reset password. Please try again.';
            }
        } catch (error) {
            resetError.textContent = 'Error occurred while resetting password. Please try again.';
            console.error(error);
        }
    });
});