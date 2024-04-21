const toggleBtns = document.querySelectorAll('.toggle-btn'); // Select all toggle buttons

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const obedDiv = btn.closest('.obed'); // Find closest parent obed div
    const otherBtns = obedDiv.querySelectorAll('.toggle-btn'); // Select all toggle buttons within the obed div
    
    otherBtns.forEach(otherBtn => {
      if (otherBtn !== btn) {
        otherBtn.classList.remove('active'); // Deactivate other buttons within the same obed div
      }
    });
    
    btn.classList.toggle('active'); // Toggle active state for the clicked button
  });
});