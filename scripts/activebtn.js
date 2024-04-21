const reznikBtn = document.getElementById('reznikBtn');
const hranolkyBtn = document.getElementById('hranolkyBtn');

reznikBtn.addEventListener('click', () => {
    reznikBtn.classList.toggle('active');
    hranolkyBtn.classList.remove('active'); // Ensure only one button is active
});

hranolkyBtn.addEventListener('click', () => {
    hranolkyBtn.classList.toggle('active');
    reznikBtn.classList.remove('active'); // Ensure only one button is active
});