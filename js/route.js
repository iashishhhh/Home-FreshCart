document.addEventListener('DOMContentLoaded', function () {
    // Get elements
    const forgotPasswordLink = document.querySelector('[data-bs-target="#forgotPasswordModal"]');
    const otpInputs = document.querySelectorAll('.otp-input');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendBtn = document.getElementById('resendBtn');
    const otpTimer = document.getElementById('otpTimer');
    const otpError = document.getElementById('otpError');

    let timeLeft = 120; // 2 minutes in seconds
    let timerId = null;

    // Function to send OTP
    async function sendOTP() {
        const token = localStorage.getItem('authToken');

        if (!token) {
            otpError.textContent = 'User not authenticated. Please log in first.';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/user/mail', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }

            // Start the timer
            startTimer();

            // Enable OTP inputs
            otpInputs.forEach(input => {
                input.disabled = false;
            });

        } catch (error) {
            otpError.textContent = 'Failed to send OTP. Please try again.';
            console.error(error);
        }
    }

    // Function to start timer
    function startTimer() {
        timeLeft = 120;
        resendBtn.disabled = true;

        if (timerId) {
            clearInterval(timerId);
        }

        timerId = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            otpTimer.textContent = `Time remaining: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timerId);
                resendBtn.disabled = false;
                otpTimer.textContent = 'Time expired';
            } else {
                timeLeft--;
            }
        }, 1000);
    }

    // Handle OTP input
    otpInputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.key >= 0 && e.key <= 9) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            } else if (e.key === 'Backspace') {
                if (index > 0) {
                    otpInputs[index - 1].focus();
                }
            }
        });
    });

    // Handle forgot password link click
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            otpError.textContent = 'No token found in localStorage. Please log in first.';
            return;
        }
        await sendOTP();
    });

    // Handle resend button click
    resendBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            await sendOTP();
        } else {
            otpError.textContent = 'No token found. Please log in again.';
        }
    });

    verifyBtn.addEventListener('click', async () => {
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/user/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ otp })
            });

            if (response.status === 200) {
                // Clear any previous error
                otpError.textContent = '';
                
                // Show success message
                alert('OTP verified successfully!');

                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
                if (modal) {
                    modal.hide();
                }

                // Reset form and timer
                otpInputs.forEach(input => {
                    input.value = '';
                });
                clearInterval(timerId);

                // Redirect to reset password page
                window.location.href = 'reset-password.html';
            } else {
                const data = await response.json();
                otpError.textContent = data.message || 'Invalid OTP. Please try again.';
                otpInputs.forEach(input => {
                    input.value = '';
                });
            }
        } catch (error) {
            otpError.textContent = 'Error occurred while verifying OTP. Please try again.';
            otpInputs.forEach(input => {
                input.value = '';
            });
        }
    });
});