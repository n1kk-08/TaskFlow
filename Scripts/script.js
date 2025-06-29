document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('name') && localStorage.getItem('dob')) {
        window.location.href = 'app.html';
        return; // Stop further execution
    }

    document.getElementById("form").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const dobInput = document.getElementById('dob').value;

        if (!name || !dobInput) {
            alert('Please fill in both fields.');
            return;
        }

        const dob = new Date(dobInput);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        // Adjust age if birthday hasn't occurred yet this year
        const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;

        if (actualAge > 10) {
            localStorage.setItem('name', name);
            localStorage.setItem('dob', dob.toISOString());
            window.location.href = 'app.html';
        } else {
            alert('You must be older than 10 years.');
        }
    });
    
});




