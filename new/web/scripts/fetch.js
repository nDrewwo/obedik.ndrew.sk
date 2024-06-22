const api = "http://localhost:3000";

async function loadDashboard(dashboardData) {
    document.querySelector('#header').innerHTML = `
        <h2>Welcome, ${dashboardData.username}!</h2>
        <h2>Balance: ${dashboardData.balance}$</h2>
    `;
}

async function loadLunches(lunches, orders, dashboardData) {
    // Use the passed data instead of fetching again
    const container = document.getElementById('lunches-container');
    lunches.forEach(lunch => {
        const lunchDiv = document.createElement('div');
            lunchDiv.className = 'obedik';

            // Check if an order exists for this lunch
            const order = orders.find(order => order.Date === lunch.DATE);
            const choice = order ? order.CHOICE : 0;

            lunchDiv.innerHTML = `
                <button class='collapsible'><h1>${lunch.DATE}</h1></button>
                <div class='content'>
                    <form action='' method='post'>
                        <div class='toggle'>
                        <button type='button' class='toggle-btn option1 ${choice === 1 ? 'active' : ''}'><h1>${lunch.Choice1}</h1></button>
                        <button type='button' class='toggle-btn option2 ${choice === 2 ? 'active' : ''}'><h1>${lunch.Choice2}</h1></button>
                        </div>
                        <input type='hidden' name='date' value='${lunch.DATE}'>
                        <input type='hidden' name='rfid' value='${dashboardData.rfid}'>
                        <input type='hidden' name='item' value='${choice}'>
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

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent the default form submission
    
            const itemInput = this.querySelector('input[name="item"]');
            const dateInput = this.querySelector('input[name="date"]');
            const rfidInput = this.querySelector('input[name="rfid"]');
            const activeButton = this.querySelector('.toggle-btn.active');
    
            if (!activeButton) {
                itemInput.value = '0'; // Ensure 'item' value is '0' if no option is selected
                // Optionally, alert the user to select an option
                alert('Please select an option before submitting.');
                return; // Exit the function
            }
    
            // Prepare the data to be sent
            const formData = {
                date: dateInput.value,
                rfid: rfidInput.value,
                item: itemInput.value
            };
    
            try {
                // Send the data to the API endpoint
                const response = await fetch(`${api}/submitOrder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include authorization header if needed
                        // 'Authorization': 'Bearer ' + YOUR_TOKEN
                    },
                    body: JSON.stringify(formData)
                });
    
                if (response.ok) {
                    // Handle success
                    const result = await response.json();
                    console.log('Submission successful', result);
                    alert('Submission successful!');
                } else {
                    // Handle errors
                    console.error('Submission failed');
                    alert('Failed to submit data.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred while submitting the form.');
            }
        });
    });
}

async function fetchData() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to login first');
        window.location.href = 'login.html';
        return;
    }

    try {
        const dashboardResponse = await fetch(`${api}/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const lunchResponse = await fetch(`${api}/lunches`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const ordersResponse = await fetch(`${api}/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (dashboardResponse.ok && lunchResponse.ok && ordersResponse.ok) {
            const dashboardData = await dashboardResponse.json();
            const lunches = await lunchResponse.json();
            const orders = await ordersResponse.json();

            loadDashboard(dashboardData);
            loadLunches(lunches, orders, dashboardData);
        } else {
            alert('Failed to load data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data.');
    }
}

window.onload = fetchData;