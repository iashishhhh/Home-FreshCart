const form = document.querySelector('form');
const inputs = form.querySelectorAll('input[required]');

form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    inputs.forEach(input => input.style.borderColor = '');
    inputs.forEach(input => {
        const value = input.value.trim();

        if (!value) {
            showError(input, `${getLabelText(input)} is required.`);
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(value)) {
            showError(input, 'Please enter a valid email address.');
            isValid = false;
        } else if (input.type === 'password' && value.length < 6) {
            showError(input, 'Password must be at least 6 characters long.');
            isValid = false;
        }
    });

    if (isValid) {
        alert('Form submitted successfully!');
        form.submit();
    }
});

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function showError(input, message) {
    input.style.borderColor = 'red';

    const parent = input.closest('.col-12');
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '5px';
    errorElement.textContent = message;
    parent.appendChild(errorElement);
}

function getLabelText(input) {
    const label = input.closest('.col-12').querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : 'This field';
}