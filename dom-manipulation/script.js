document.addEventListener('DOMContentLoaded', () => {
  const quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit is your mind.", category: "Inspiration" },
    { text: "Success is not final; failure is not fatal.", category: "Motivation" }
  ];
  let filteredQuotes = [...quotes];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const categoryFilter = document.getElementById('categoryFilter');

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.textContent = filteredQuotes[randomIndex].text;
  }

  function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      saveQuotes();
      populateCategories();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('Quote added!');
    } else {
      alert('Please enter both quote and category.');
    }
  }

  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
    showRandomQuote();
  }

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
  }

  // Initialize the app
  populateCategories();
  filterQuotes();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
});
