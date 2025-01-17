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

// Add new code for handling button state
function updateButtonState() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitButton = document.getElementById('submitButton'); // Make sure your button has this ID

    // Enable button only if both fields have values
    submitButton.disabled = !newPassword || !confirmPassword;
}

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('newPassword').addEventListener('input', updateButtonState);
    document.getElementById('confirmPassword').addEventListener('input', updateButtonState);
    // Initialize button state
    updateButtonState();
}); 