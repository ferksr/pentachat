const quotesContainer = document.getElementById('quotes');
const refreshButton = document.getElementById('refresh');
const categoryDropdown = document.getElementById('categoryDropdown');
let quotes = [];
let categories = new Set();
let quoteHistory = {}; // Initialize history object
let quotesFetched = false; // Flag to prevent multiple fetches

// Single event listener to initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event triggered');
    fetchQuotes();
});

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
    console.log('Displaying random quotes');
    quotesContainer.innerHTML = ''; // Clear previous quotes
    const selectedCategory = categoryDropdown.value;
    console.log('Selected category:', selectedCategory);
    const filteredQuotes = selectedCategory === 'Random' ? quotes : quotes.filter(q => q.category === selectedCategory);

    // Initialize history for all categories if not already done
    categories.forEach(category => {
        if (!quoteHistory[category]) {
            quoteHistory[category] = new Set();
        }
    });

    // Check if all quotes have been shown for the selected category
    if (selectedCategory !== 'Random') {
        const categoryQuotes = quotes.filter(q => q.category === selectedCategory);
        if (quoteHistory[selectedCategory].size >= categoryQuotes.length) {
            showResetWarning();
            quoteHistory[selectedCategory].clear(); // Reset history for the selected category
        } else {
            removeResetWarning();
        }
    }

    // Check if all quotes have been shown for the "Random" category
    if (selectedCategory === 'Random') {
        let allShown = true;
        categories.forEach(category => {
            const categoryQuotes = quotes.filter(q => q.category === category);
            if (quoteHistory[category].size < categoryQuotes.length) {
                allShown = false;
            }
        });
        if (allShown) {
            showResetWarning();
            categories.forEach(category => quoteHistory[category].clear()); // Reset history for all categories
        } else {
            removeResetWarning();
        }
    }

    if (filteredQuotes.length > 0) {
        const randomQuotes = [];
        const usedIndexes = new Set();
        while (randomQuotes.length < 5 && usedIndexes.size < filteredQuotes.length) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const quoteCategory = filteredQuotes[randomIndex].category;
            if (!usedIndexes.has(randomIndex) && !quoteHistory[quoteCategory].has(randomIndex)) {
                usedIndexes.add(randomIndex);
                quoteHistory[quoteCategory].add(randomIndex);
                randomQuotes.push(filteredQuotes[randomIndex].quote);
            }
        }

        // If not enough quotes, reset and continue
        if (randomQuotes.length < 5) {
            if (selectedCategory === 'Random') {
                categories.forEach(category => quoteHistory[category].clear());
            } else {
                quoteHistory[selectedCategory].clear();
            }
            while (randomQuotes.length < 5 && usedIndexes.size < filteredQuotes.length) {
                const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
                const quoteCategory = filteredQuotes[randomIndex].category;
                if (!usedIndexes.has(randomIndex)) {
                    usedIndexes.add(randomIndex);
                    quoteHistory[quoteCategory].add(randomIndex);
                    randomQuotes.push(filteredQuotes[randomIndex].quote);
                }
            }
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