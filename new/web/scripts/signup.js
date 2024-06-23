document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    });

    const data = await response.json();

    // Clear previous error messages
    const errorDiv = document.getElementById('errorMessages');
    errorDiv.innerHTML = '';

    if (!response.ok) {
        // Assuming errors are returned in data.errors
        let errorMessages = '';
        if (data.errors) {
            for (const [key, value] of Object.entries(data.errors)) {
                errorMessages += `<p>${value}</p>`;
            }
        } else {
            // Fallback error message
            errorMessages = `<p>${data.message || 'An error occurred during registration.'}</p>`;
        }
        errorDiv.innerHTML = errorMessages;
    } else {
        localStorage.setItem('token', data.token); // Save the token to localStorage
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    }
});