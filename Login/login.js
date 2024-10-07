const labels = document.querySelectorAll('.form-control label');
labels.forEach(label => {
    label.innerHTML = label.innerText
        .split('')
        .map((letter, idx) => `<span style="transition-delay:${idx * 50}ms">${letter}</span>`)
        .join('');
});

// Function to get URL parameter by name
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Retrieve the username parameter from the URL
const username = getUrlParameter('username');
console.log("Username: ", username);

// Retrieve the password parameter from the URL
const password = getUrlParameter('password');
console.log("Password: ", password);

const loginButton = document.querySelector('.btn');

loginButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    if(usernameInput !== username || passwordInput !== password){
        alert("Incorrect password or username");
    } else if(usernameInput === "" || passwordInput === ""){
        alert("Please enter username and password");
    } else {
        window.location.href = "/Game/Inner Login/innerLogin.html";
    }
});
