document.addEventListener('DOMContentLoaded', function() {
    const burzaButton = document.querySelector('.bottomBtn'); // Assuming there's only one button with this class
    if (!burzaButton) return; // Exit if the button is not found

    const currentTime = new Date();
    const startHour = 0;
    const endHour = 24;

    // Convert current time, start time, and end time to hours for comparison
    const currentHour = currentTime.getHours();

    // Check if current time is within the range
    if (currentHour >= startHour && currentHour < endHour) {
        burzaButton.style.display = ''; // Show the button
    } else {
        burzaButton.style.display = 'none'; // Hide the button
    }
});