document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token'); 
    if (!token) {
        window.location.href = 'login.html';
        return; 
    }

    const currentHour = new Date().getHours();
    if (currentHour < 0 || currentHour > 24) {
        window.location.href = 'dashboard.html';
    }

    fetch('http://localhost:3000/dashboard', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ` + token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        const balance = data.balance;
        const headerDiv = document.querySelector('#header');
        headerDiv.innerHTML += `<h2>Balance: ${balance}$</h2>`; 
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});