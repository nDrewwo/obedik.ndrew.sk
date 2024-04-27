const choiceButtons = document.querySelectorAll('.toggle-btn');
const itemInput = document.querySelector('input[name="item"]');

choiceButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.id === "option1") {
      itemInput.value = 1;
    } else if (button.id === "option2") {
      itemInput.value = 2;
    } else {
      itemInput.value = 0; // Default value if neither button is clicked
    }
  });
});