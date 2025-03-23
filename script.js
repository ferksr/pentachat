const quotesContainer = document.getElementById('quotes');
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
            displayRandomQuotes();
        })
        .catch(error => console.error('Error fetching the quotes:', error));
}

function displayRandomQuotes() {
    quotesContainer.innerHTML = ''; // Clear previous quotes
    if (quotes.length > 0) {
        const randomQuotes = [];
        for (let i = 0; i < 5; i++) {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            randomQuotes.push(randomQuote);
        }
        console.log('Random Quotes:', randomQuotes); // Debugging line
        randomQuotes.forEach(quote => {
            const quoteElement = document.createElement('p');
            quoteElement.className = 'quote';
            quoteElement.innerText = quote;
            quotesContainer.appendChild(quoteElement);
        });
    } else {
        quotesContainer.innerText = 'No quotes available';
    }
}

refreshButton.addEventListener('click', displayRandomQuotes);

// Initial quote display
fetchQuotes();