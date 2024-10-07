
/*-------------------- For retrieving character class --------------------*/ 
// Function to get URL parameter by name
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Retrieve the character parameter from the URL
const character = getUrlParameter('character');

// Display the selected character in the console
console.log('Selected Character:', character);

/*-------------------- For OPEN AI --------------------*/
// Constants
const API_KEY = "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";
const API_URL = "https://api.openai.com/v1/chat/completions";

// HTML elements
const generateBtn = document.getElementById("generateBtn"); // Button to trigger text generation
const resultText = document.getElementById("resultText"); // Area to display generated text
const stopBtn = document.getElementById("stopBtn"); // Button to stop the generation process
const promptInput = document.getElementById("promptInput"); // Input field for user prompts

let controller = null; // Controller to abort requests
let promptText;

if (character === 'mage') {
    promptText = `You are acting as if you are in a classic text adventure game and you are narrating a story while we are playing. You are not to every break out of your character,
    and you must not refer to yourself in any way. In this game, the setting is a fantasy adventure world. Give at least 2 rooms but at most 3 rooms and each room should have at most 4 
    sentence descriptions. Start by displaying the first room at the beginning of the game, and wait for me to give you my first command. You always give at least 3 options and no more 
    than 4 options so that the player don't get lost and the options are always arranged in a unordered list without any brackets surrounding them, and always maintain the atmosphere and tone 
    of the game while asking the player about their desired action or next step. The player has a 70% chance of facing against enemies and you should continue the story from there without
    breaking out of your character. Think of me as a wise ${character} cat with all of the abilities of a ${character} only and no other abilities.`;
} else if (character === 'warrior') {
    promptText = `You are acting as if you are in a classic text adventure game and you are narrating a story while we are playing. You are not to every break out of your character,
    and you must not refer to yourself in any way. In this game, the setting is a fantasy adventure world. Give at least 2 rooms but at most 3 rooms and each room should have at most 4 
    sentence descriptions. Start by displaying the first room at the beginning of the game, and wait for me to give you my first command. You always give at least 3 options and no more 
    than 4 options so that the player don't get lost and the options are always arranged in a unordered list without any brackets surrounding them, and maintain the atmosphere and tone 
    of the game while asking the player about their desired action or next step. Think of me as a wise ${character} cat with all of the abilities of a ${character} only and no other abilities.`;
} else if (character === 'archer') {
    promptText = `You are acting as if you are in a classic text adventure game and you are narrating a story while we are playing. You are not to every break out of your character,
    and you must not refer to yourself in any way. In this game, the setting is a fantasy adventure world. Give at least 2 rooms but at most 3 rooms and each room should have at most 4 
    sentence descriptions. Start by displaying the first room at the beginning of the game, and wait for me to give you my first command. You always give at least 3 options and no more 
    than 4 options so that the player don't get lost and the options are always arranged in a unordered list without any brackets surrounding them, and maintain the atmosphere and tone 
    of the game while asking the player about their desired action or next step. Think of me as a wise ${character} cat with all of the abilities of a ${character} only and no other abilities.`;
} else {
    // Default prompt text if character is not recognized
    promptText = "Unknown character type.";
}

// Function to generate text
const generate = async () => {
    // Disable generate button and enable stop button
    generateBtn.disabled = true;
    resultText.innerText = "Generating...";
    stopBtn.disabled = false;

    // Create AbortController instance to abort fetch requests
    controller = new AbortController();
    const signal = controller.signal;

    try {
        // Fetch request to OpenAI API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: promptText },
                    { role: "user", content: promptInput.value }],
                stream: true,
            }),
            signal,
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        resultText.innerText = "";

        // Read chunks of data until completion
        while (true) {
            const chunk = await reader.read();
            const { done, value } = chunk;
            if (done) {
                break;
            }
            const decodedChunk = decoder.decode(value);
            const lines = decodedChunk.split("\n");
            const parsedLines = lines
                .map((line) => line.replace(/^data: /, "").trim())
                .filter((line) => line !== "" && line !== "[DONE]")
                .map((line) => JSON.parse(line));

            // Parse and display generated content
            for (const parsedLine of parsedLines) {
                const { choices } = parsedLine;
                const { delta } = choices[0];
                const { content } = delta;
                if (content) {
                    resultText.innerText += content;
                }
            }
            promptInput.value = ""; // Clear input field
        }
    } catch (error) {
        // Handle errors and aborts
        if (signal.aborted) {
            resultText.innerText = "Request aborted";
        } else {
            resultText.innerText = "Error occurred while generating.";
            console.log("Error: ", error);
        }
    } finally {
        // Enable generate button and disable stop button
        generateBtn.disabled = false;
        stopBtn.disabled = true;
        controller = null;
    }
};

// Function to stop the request
const stop = () => {
    if (controller) {
        controller.abort();
        controller = null;
    }
};

// Event listeners
window.addEventListener('DOMContentLoaded', () => {

    generate();

    // Event listener for the GENERATE button
    generateBtn.addEventListener("click", generate);

    // Event listener for the prompt input field
    promptInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            generate(promptInput.value);
        }
    });

    // Event listener for the STOP button
    stopBtn.addEventListener("click", stop);
});
