
    // Array to store quotes
    let quotes = [
      { text: "The only limit is your mind.", category: "Inspiration" },
      { text: "Success is not final; failure is not fatal.", category: "Motivation" }
    ];
    let filteredQuotes = [...quotes];
  
    const quoteDisplay = document.querySelector('.quoteDisplay');
    const categoryFilter = document.querySelector('.categoryFilter');
    categoryFilter.style.color="red";

    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      quoteDisplay.textContent = filteredQuotes[randomIndex].text;
    }
  
    function addQuote() {
      alert("pressed");
      const quoteText = document.querySelector('#newQuoteText').value.trim();
      const quoteCategory = document.querySelector('#newQuoteCategory').value.trim();

      
        quotes.push({ text: quoteText, category: quoteCategory });
  
        quoteText.value = '';
        quoteCategory.value = '';
  
      
        populateCategories();
        filterQuotes();
  
        alert('Quote added successfully!');
    }
  
    // Function to populate categories in the filter dropdown
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
  
    // Function to filter quotes by category
    function filterQuotes() {
      const selectedCategory = categoryFilter.value;
      filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);
      showRandomQuote();
    }
  
    // Attach event listener to 'Show New Quote' button
    document.querySelector('.newQuote').addEventListener('click', showRandomQuote);
  
    // Initialize the app by populating categories and showing a random quote
    populateCategories();
    filterQuotes();
  