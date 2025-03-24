const quotesContainer = document.getElementById('quotes');
const refreshButton = document.getElementById('refresh');
const categoryDropdown = document.getElementById('categoryDropdown');
let quotes = [];
let categories = new Set();
let quoteHistory = {}; // Initialize history object
let quotesFetched = false; // Flag to prevent multiple fetches

function fetchQuotes() {
    if (quotesFetched) {
        console.log('Quotes already fetched, skipping fetchQuotes');
        return;
    }
    console.log('Fetching quotes...');
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ57pOctCqNWiVQvOEHhgP0OFseB2KqKCfzKIP7HHzepCcFOUuhIYjCNAkmeFad4M1GSixFBVVMBP-V/pub?output=csv')
        .then(response => response.text())
        .then(data => {
            console.log('Quotes fetched');
            quotesFetched = true; // Set the flag to true after fetching quotes
            const rows = parseCSV(data);
            quotes = rows.map(row => ({ quote: row[0], category: row[1] }));
            categories = new Set(rows.map(row => row[1]).filter(category => category));
            console.log('Quotes and categories processed');
            populateCategoryDropdown();
            loadSelectedCategory();
            displayRandomQuotes(); // Call displayRandomQuotes only once after fetching quotes
        })
        .catch(error => console.error('Error fetching the quotes:', error));
}

function parseCSV(data) {
    console.log('Parsing CSV data');
    const rows = [];
    const lines = data.split('\n');
    for (const line of lines) {
        const cells = [];
        let cell = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                cells.push(cell.trim());
                cell = '';
            } else {
                cell += char;
            }
        }
        cells.push(cell.trim());
        rows.push(cells);
    }
    console.log('CSV data parsed');
    return rows;
}

function populateCategoryDropdown() {
    console.log('Populating category dropdown');
    categoryDropdown.innerHTML = '<option value="Random">Random</option>'; // Reset dropdown
    const sortedCategories = Array.from(categories).sort();
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        categoryDropdown.appendChild(option);
    });
    console.log('Category dropdown populated');
}

function displayRandomQuotes() {
    console.log('------------------------');
    console.log('Starting displayRandomQuotes');
    quotesContainer.innerHTML = '';
    const selectedCategory = categoryDropdown.value;
    console.log('Selected category:', selectedCategory);
    
    const filteredQuotes = selectedCategory === 'Random' 
        ? quotes 
        : quotes.filter(q => q.category === selectedCategory);
    
    console.log(`Total quotes in category: ${filteredQuotes.length}`);

    // Initialize history if needed
    if (!quoteHistory[selectedCategory]) {
        quoteHistory[selectedCategory] = new Set();
    }

    // Main quote selection
    const randomQuotes = [];

    // Keep selecting quotes until we have 5
    while (randomQuotes.length < 5) {
        // If we've shown all quotes, reset history
        if (quoteHistory[selectedCategory].size >= filteredQuotes.length) {
            console.log('All quotes used - Resetting history');
            quoteHistory[selectedCategory].clear();
            showResetWarning();
        }

        // Get available indices (those not in history)
        const availableIndices = Array.from(Array(filteredQuotes.length).keys())
            .filter(index => !quoteHistory[selectedCategory].has(index));
        
        // Select a random index from available ones
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        
        // Add to history and quotes
        quoteHistory[selectedCategory].add(randomIndex);
        randomQuotes.push(filteredQuotes[randomIndex].quote);
        console.log(`Added quote ${randomIndex}. Now have ${randomQuotes.length}/5 quotes`);
    }

    console.log(`Selection complete - ${randomQuotes.length} quotes selected`);
    console.log(`Final history size: ${quoteHistory[selectedCategory].size}`);

    // Display quotes
    const ul = document.createElement('ul');
    randomQuotes.forEach((quote, index) => {
        const quoteElement = document.createElement('li');
        quoteElement.className = 'quote';
        quoteElement.innerText = quote;
        ul.appendChild(quoteElement);
        console.log(`Rendered quote ${index + 1}/${randomQuotes.length}`);
    });
    quotesContainer.appendChild(ul);
    console.log('Quotes display complete');
    console.log('------------------------');
}

function showResetWarning() {
    let warning = document.getElementById('reset-warning');
    if (!warning) {
        warning = document.createElement('div');
        warning.id = 'reset-warning';
        warning.className = 'warning';
        warning.innerText = 'Todas mostradas!';
        quotesContainer.appendChild(warning);
    }
}

function removeResetWarning() {
    const warning = document.getElementById('reset-warning');
    if (warning) {
        warning.remove();
    }
}

function saveSelectedCategory() {
    const selectedCategory = categoryDropdown.value;
    console.log('Saving selected category:', selectedCategory);
    document.cookie = `selectedCategory=${selectedCategory}; path=/`;
}

function loadSelectedCategory() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const selectedCategoryCookie = cookies.find(cookie => cookie.startsWith('selectedCategory='));
    if (selectedCategoryCookie) {
        const selectedCategory = selectedCategoryCookie.split('=')[1];
        categoryDropdown.value = selectedCategory;
        console.log('Loaded selected category from cookie:', selectedCategory);
    }
}

categoryDropdown.addEventListener('change', () => {
    saveSelectedCategory();
    displayRandomQuotes();
});

refreshButton.addEventListener('click', displayRandomQuotes);

// Remove the event listener and direct call, replace with a single initialization
function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchQuotes);
    } else {
        fetchQuotes();
    }
}

// Replace the existing event listener and direct call with this
initializeApp();