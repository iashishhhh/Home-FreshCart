async function validateSignupForm(event) {
    event.preventDefault(); // Prevent the default form submission 

    // Get form elements
    const fullname = document.getElementById('fullname');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const terms = document.getElementById('terms');
    const fullnameError = document.getElementById('fullnameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Clear previous error messages
    fullnameError.textContent = '';
    phoneError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';

    let isValid = true;

    // Split full name into first and last names
    const nameParts = fullname.value.trim().split(' ');
    let firstName = nameParts[0] || '';
    let lastName = nameParts.slice(1).join(' ') || '';

    // Validate Full Name
    if (fullname.value.trim() === '') {
        fullnameError.textContent = 'Full name is required';
        isValid = false;
    }

    // Validate Phone Number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.value.trim())) {
        phoneError.textContent = 'Please enter a valid 10-digit phone number';
        isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }

    // Validate Password
    if (password.value.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long';
        isValid = false;
    }

    // Validate Terms and Conditions
    if (!terms.checked) {
        alert('Please agree to the Terms and Conditions');
        isValid = false;
    }

    // If the form is valid, send data to the external API
    if (isValid) {
        const userData = {
            fullname: {
                firstname: firstName,
                lastname: lastName
            },
            mobile: phone.value.trim(),
            email: email.value.trim(),
            password: password.value.trim()
        };

        try {
            const response = await fetch('http://localhost:3000/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Signup successful:', data);
                alert("User created Successfully");
                localStorage.setItem("token", data.token);
                window.location.href = "loginsite.html";
            } else {
                const error = await response.json();
                console.error('Signup failed:', error);
            }
        } catch (error) {
            console.error('Error during signup:', error); 
            alert('An error occurred during signup. Please try again later.');
        }
    }

    return isValid;
}

document.getElementById('signupForm').addEventListener('submit', validateSignupForm);