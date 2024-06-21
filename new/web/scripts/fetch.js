const api = "http://localhost:3000"

async function loadDashboard() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to login first');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch(`${api}/dashboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    if (response.ok) {
        const data = await response.json();
        document.querySelector('#header').innerHTML = `
            <h2>Welcome, ${data.username}!</h2>
            <h2>Balance, ${data.balance}$</h2>
        `;
        loadLunches();
    } else {
        const data = await response.json();
        alert(data.message);
        if (data.message === 'Invalid token') {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    }
}

async function loadLunches() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${api}/lunches`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    if (response.ok) {
        const lunches = await response.json();
        const container = document.getElementById('lunches-container');
        lunches.forEach(lunch => {
            const lunchDiv = document.createElement('div');
            lunchDiv.className = 'obedik';
            lunchDiv.innerHTML = `
                <button class='collapsible'><h1>${lunch.DATE}</h1></button>
                <div class='content'>
                    <form action='' method='post'>
                        <div class='toggle'>
                            <button type='button' class='toggle-btn option1'><h1>${lunch.Choice1}</h1></button>
                            <button type='button' class='toggle-btn option2'><h1>${lunch.Choice2}</h1></button>
                        </div>
                        <input type='hidden' name='date' value='${lunch.DATE}'>
                        <input type='hidden' name='item' value=''>
                        <button type='submit' class='submitBtn'><h1>Submit</h1></button>
                    </form>
                </div>
            `;
            container.appendChild(lunchDiv);
        });

        document.querySelectorAll('.collapsible').forEach(button => {
            button.addEventListener('click', function() {
                const content = this.nextElementSibling;
                content.classList.toggle('open');
            });
        });

        document.querySelectorAll('.toggle-btn').forEach((button) => {
            button.addEventListener('click', function() {
                const form = this.closest('form');
                const itemInput = form.querySelector('input[name="item"]');
        
                // If this button is already active, deselect it and set 'item' value to '0'
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    itemInput.value = '0';
                } else {
                    // Remove 'active' class from all buttons
                    document.querySelectorAll('.toggle-btn.active').forEach(activeButton => {
                        activeButton.classList.remove('active');
                    });
        
                    // Add 'active' class to the clicked button
                    this.classList.add('active');
        
                    // Set the value of the 'item' input field based on the clicked button
                    if (this.classList.contains('option1')) {
                        itemInput.value = '1'; // '1' for the first button
                    } else if (this.classList.contains('option2')) {
                        itemInput.value = '2'; // '2' for the second button
                    }
                }
            });
        });
        
        // Add an event listener to the form to set the 'item' value to '0' if no option is selected
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                const itemInput = this.querySelector('input[name="item"]');
                const activeButton = this.querySelector('.toggle-btn.active');
        
                if (!activeButton) {
                    itemInput.value = '0';
                    e.preventDefault(); // Prevent form submission if no option is selected
                }
            });
        });
    } else {
        alert('Failed to load lunches');
    }
}

window.onload = loadDashboard;