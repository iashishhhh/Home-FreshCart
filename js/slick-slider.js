$(document).ready(function () {
  // Slick slider initialization
  $('.custom-slider').slick({
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: false, // No default dots
    arrows: false, // Disable default arrows
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3     
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  })

  $('.custom-prev').on('click', function () {
    if ($('.custom-slider').slick) {
      $('.custom-slider').slick('slickPrev')
    }
  })

  $('.custom-next').on('click', function () {
    if ($('.custom-slider').slick) {
      $('.custom-slider').slick('slickNext')
    }
  })
})

window.addEventListener('load', function () {
  // Check if the preloader has been shown before
  if (!localStorage.getItem('preloaderShown')) {
    setTimeout(function () {
      document.body.classList.add('loaded');
      localStorage.setItem('preloaderShown', 'true'); // Mark preloader as shown
    }, 2000);
  } else {
    document.body.classList.add('loaded');
  }
});



// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("userLoginForm");
//     const submitButton = form.querySelector("button[type='submit']");

//     submitButton.addEventListener("click", function (e) {
//         e.preventDefault();  // Prevent form submission

//         // Clear previous error messages
//         document.querySelectorAll('.error-message').forEach(function (msg) {
//             msg.textContent = '';
//         });

//         document.querySelectorAll('input').forEach(function (input) {
//             input.classList.remove('invalid', 'valid');
//         });

//         const username = document.getElementById("username").value;
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;
//         let isValid = true;

//         if (username === '') {
//             document.getElementById("usernameError").textContent = 'Username is required.';
//             document.getElementById("username").classList.add('invalid'); // Red border for invalid
//             document.getElementById("username").focus(); // Focus on the first invalid field
//             isValid = false;
//         } else {
//             document.getElementById("username").classList.add('valid'); // Green border for valid
//         }

//         // Validate Email
//         const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//         if (email === '') {
//             document.getElementById("emailError").textContent = 'Email is required.';
//             document.getElementById("email").classList.add('invalid'); // Red border for invalid
//             if (isValid) document.getElementById("email").focus(); 
//             isValid = false;
//         } else if (!emailPattern.test(email)) {
//             document.getElementById("emailError").textContent = 'Please enter a valid email.';
//             document.getElementById("email").classList.add('invalid'); // Red border for invalid
//             if (isValid) document.getElementById("email").focus();
//             isValid = false;
//         } else {
//             document.getElementById("email").classList.add('valid'); // Green border for valid
//         }

//         // Validate Password
//         if (password === '') {
//             document.getElementById("passwordError").textContent = 'Password is required.';
//             document.getElementById("password").classList.add('invalid'); // Red border for invalid
//             if (isValid) document.getElementById("password").focus();
//             isValid = false;
//         } else if (password.length < 6) {
//             document.getElementById("passwordError").textContent = 'Password must be at least 6 characters.';
//             document.getElementById("password").classList.add('invalid'); // Red border for invalid
//             if (isValid) document.getElementById("password").focus();
//             isValid = false;
//         } else {
//             document.getElementById("password").classList.add('valid'); // Green border for valid
//         }

//         if (isValid) {
//             alert('Form submitted successfully!');
            
//             // Reset the form fields
//             form.reset();

//             // Remove the valid class after reset
//             document.querySelectorAll('input').forEach(function (input) {
//                 input.classList.remove('valid');
//             });
//         }
//     });
// });
