const api = 'http://localhost:3000';

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

    fetchData(api, token).catch(error => console.error('Failed to fetch data:', error));
});

async function fetchData(api, token) {
    const dashboardResponse = await fetch(`${api}/dashboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    const dashboardData = await dashboardResponse.json();

    const headerDiv = document.querySelector('#header');
    headerDiv.innerHTML += `<h2>Balance: ${dashboardData.balance}$</h2>`;

    const burzaResponse = await fetch(`${api}/burza`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    const bruzaData = await burzaResponse.json();

    const infoDivs = document.querySelectorAll('.info');

    if(infoDivs.length > 0) {
        infoDivs[0].innerHTML += `<p>Počet kusov: ${bruzaData.countOfChoice1} </p>`;
    }

    if(infoDivs.length > 1) {
        infoDivs[1].innerHTML += `<p>Počet kusov: ${bruzaData.countOfChoice2} </p>`;
    }
}