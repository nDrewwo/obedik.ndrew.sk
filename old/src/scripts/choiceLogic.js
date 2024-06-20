const choiceButtons = document.querySelectorAll('.toggle-btn');

choiceButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Get the 'item' input field within the same 'obedik' div as the clicked button
    const itemInput = button.closest('.obedik').querySelector('input[name="item"]');

    if (button.classList.contains("option1")) {
      itemInput.value = 1;
    } else if (button.classList.contains("option2")) {
      itemInput.value = 2;
    } else {
      itemInput.value = 0; // Default value if neither button is clicked
    }
  });
});