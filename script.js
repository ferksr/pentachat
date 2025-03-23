const quoteContainer = document.getElementById('quote');
const refreshButton = document.getElementById('refresh');
let quotes = [];

document.addEventListener('DOMContentLoaded', fetchQuotes);

function fetchQuotes() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ57pOctCqNWiVQvOEHhgP0OFseB2KqKCfzKIP7HHzepCcFOUuhIYjCNAkmeFad4M1GSixFBVVMBP-V/pub?output=csv')
        .then(response => response.text())
        .then(data => {
            console.log('Fetched data:', data); // Debugging line
            quotes = data.split('\n').map(line => line.trim()).filter(line => line);
            console.log('Quotes:', quotes); // Debugging line
            displayRandomQuote();
        })
        .catch(error => console.error('Error fetching the quotes:', error));
}

function displayRandomQuote() {
    if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        console.log('Random Quote:', randomQuote); // Debugging line
        quoteContainer.innerText = randomQuote;
    } else {
        quoteContainer.innerText = 'No quotes available';
    }
}

refreshButton.addEventListener('click', displayRandomQuote);

// Initial quote display
fetchQuotes();