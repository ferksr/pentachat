const quoteContainer = document.getElementById('quote');
const refreshButton = document.getElementById('refresh');

document.addEventListener('DOMContentLoaded', fetchQuote);

function fetchQuote() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ57pOctCqNWiVQvOEHhgP0OFseB2KqKCfzKIP7HHzepCcFOUuhIYjCNAkmeFad4M1GSixFBVVMBP-V/pub?output=csv')
        .then(response => response.text())
        .then(data => {
            console.log('Fetched data:', data); // Debugging line
            const quotes = data.split('\n').map(line => line.trim()).filter(line => line);
            console.log('Quotes:', quotes); // Debugging line
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            console.log('Random Quote:', randomQuote); // Debugging line
            quoteContainer.innerText = randomQuote;
        })
        .catch(error => console.error('Error fetching the quotes:', error));
}

refreshButton.addEventListener('click', fetchQuote);

// Initial quote display
fetchQuote();