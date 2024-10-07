const labels = document.querySelectorAll('.form-control label');
labels.forEach(label => {
    label.innerHTML = label.innerText
        .split('')
        .map((letter, idx) => `<span style="transition-delay:${idx * 50}ms">${letter}</span>`)
        .join('');
});

// Function to update the input username and password and redirect to login page
async function updateUsernameAndPasswordAndRedirect(username, password){
    try {
        const response = await fetch('register.json');
        if(!response.ok){
            throw new Error('Failed to fetch username and password data');
        }
        const usernamePasswordData = await response.json();

        // Loop through the keys of the user object
        for(const key in usernamePasswordData.user){
            if(key === 'username'){
                usernamePasswordData.user[key] = (username === 'true');
            }else if(key === 'password'){
                usernamePasswordData.user[key] = (password === 'true');
            }
        }

        window.location.href = `/Login/login.html?username=${username}&password=${password}`;

    } catch (error) {
        console.log('Error fetching username and password data: ', error);
    }
}

const createAccountButton = document.querySelector('.create-account-button');
createAccountButton.addEventListener('click', async function() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    updateUsernameAndPasswordAndRedirect(username, password);
});
