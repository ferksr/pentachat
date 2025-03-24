const quotesContainer = document.getElementById('quotes');
const refreshButton = document.getElementById('refresh');
const categoryDropdown = document.getElementById('categoryDropdown');
let quotes = [];
let categories = new Set();

document.addEventListener('DOMContentLoaded', () => {
    fetchQuotes();
    loadSelectedCategory();
});

function fetchQuotes() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ57pOctCqNWiVQvOEHhgP0OFseB2KqKCfzKIP7HHzepCcFOUuhIYjCNAkmeFad4M1GSixFBVVMBP-V/pub?output=csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(line => line.split(',').map(cell => cell.trim()));
            quotes = rows.map(row => ({ quote: row[0], category: row[1] }));
            categories = new Set(rows.map(row => row[1]).filter(category => category));
            populateCategoryDropdown();
            displayRandomQuotes();
        })
        .catch(error => console.error('Error fetching the quotes:', error));
}

function populateCategoryDropdown() {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        categoryDropdown.appendChild(option);
    });
}

function displayRandomQuotes() {
    quotesContainer.innerHTML = ''; // Clear previous quotes
    const selectedCategory = categoryDropdown.value;
    const filteredQuotes = selectedCategory === 'Random' ? quotes : quotes.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length > 0) {
        const randomQuotes = [];
        for (let i = 0; i < 5; i++) {
            const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
            randomQuotes.push(randomQuote.quote);
        }
        const ul = document.createElement('ul');
        randomQuotes.forEach(quote => {
            const quoteElement = document.createElement('li');
            quoteElement.className = 'quote';
            quoteElement.innerText = quote;
            ul.appendChild(quoteElement);
        });
        quotesContainer.appendChild(ul);
    } else {
        quotesContainer.innerText = 'No quotes available';
    }
}

function saveSelectedCategory() {
    const selectedCategory = categoryDropdown.value;
    document.cookie = `selectedCategory=${selectedCategory}; path=/`;
}

function loadSelectedCategory() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const selectedCategoryCookie = cookies.find(cookie => cookie.startsWith('selectedCategory='));
    if (selectedCategoryCookie) {
        const selectedCategory = selectedCategoryCookie.split('=')[1];
        categoryDropdown.value = selectedCategory;
    }
}

categoryDropdown.addEventListener('change', () => {
    saveSelectedCategory();
    displayRandomQuotes();
});

refreshButton.addEventListener('click', displayRandomQuotes);

// Initial quote display
fetchQuotes();