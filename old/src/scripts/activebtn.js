const toggleBtns = document.querySelectorAll('.toggle-btn');

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Toggle active class on the clicked button
    btn.classList.toggle('active');

    // Deactivate all other buttons except the clicked one
    toggleBtns.forEach(otherBtn => {
      if (otherBtn !== btn) {
        otherBtn.classList.remove('active');
      }
    });

    // Update hidden input value (optional, customize as needed)
    const selectedChoice = btn.textContent.trim(); // Get button text (Choice 1 or Choice 2)
    document.querySelector('input[name="item"]').value = selectedChoice;
  });
});
