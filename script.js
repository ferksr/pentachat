const quoteContainer = document.getElementById('quote');
const refreshButton = document.getElementById('refresh');

document.addEventListener('DOMContentLoaded', fetchQuote);

function fetchQuote() {
    fetch('https://spreadsheets.google.com/feeds/cells/2PACX-1vQ57pOctCqNWiVQvOEHhgP0OFseB2KqKCfzKIP7HHzepCcFOUuhIYjCNAkmeFad4M1GSixFBVVMBP-V/1/public/full?alt=json')
        .then(response => response.json())
        .then(data => {
            const entries = data.feed.entry;
            const quotes = entries.map(entry => entry.content.$t);
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteContainer.innerText = randomQuote;
        })
        .catch(error => console.error('Error fetching the quotes:', error));
}

refreshButton.addEventListener('click', fetchQuote);

// Initial quote display
fetchQuote();