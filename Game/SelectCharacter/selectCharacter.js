// Function to update the selected character and redirect to the game page
async function updateCharacterAndRedirect(character) {
    try {
        const response = await fetch('selectCharacter.json');
        if (!response.ok) {
            throw new Error('Failed to fetch character data');
        }
        const charactersData = await response.json();
        
        for (const char in charactersData.characters) {
            charactersData.characters[char] = (char === character);
        }
        
        // Save the updated JSON file or send it to the server
        console.log(charactersData); // This is for demonstration purposes, you'd send this data to the server in a real application

        // // Redirect to the game page with the selected character as a parameter
        window.location.href = `/Game/Game/game.html?character=${character}`;
    } catch (error) {
        console.error('Error fetching character data:', error);
    }
}

// Add event listeners to the character buttons
document.querySelectorAll('.mage, .warrior, .archer').forEach(button => {
    button.addEventListener('click', function() {
        const character = this.classList[0]; // Get the class name of the clicked button
        updateCharacterAndRedirect(character); // Update the character in the JSON file and redirect to the game page
    });
});