
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
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
  
    function createAddQuoteForm() {
      const quoteText = document.querySelector('#newQuoteText').value.trim();
      const quoteCategory = document.querySelector('#newQuoteCategory').value.trim();

      
        quotes.push({ text: quoteText, category: quoteCategory });
  
        quoteText.value = '';
        quoteCategory.value = '';
  
      
        populateCategories();
        filterQuotes();
  
        alert('Quote added successfully!');
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
  
    // Function to filter quotes by category
    function filterQuotes() {
      const selectedCategory = categoryFilter.value;
      filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);
      showRandomQuote();
    }
  
    // Attach event listener to 'Show New Quote' button
    document.getElementById('#newQuote').addEventListener('click', showRandomQuote);
  

    populateCategories();
    filterQuotes();

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
  
    let serverQuotes = [
      { text: "Server quote 1", category: "Server Category" },
      { text: "Server quote 2", category: "Server Category" }
    ];
    
  
    const fetchQuotesFromServer = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Failed to fetch quotes from server.');
        const serverQuotes = await response.json();
        return serverQuotes.map((quote) => ({
          text: quote.title,
          category: 'General',
        }));
      } catch (error) {
        console.error(error);
        alert('Error fetching quotes from server!');
        return [];
      }
    };
    
    const postQuoteToServer = async (quote) => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: quote.text,
            body: quote.category,
            userId: 1, 
          }),
        });
  
        if (!response.ok) throw new Error('Failed to post new quote to server.');
        const postedQuote = await response.json();
        console.log('Quote successfully posted:', postedQuote);
      } catch (error) {
        console.error(error);
        alert('Error posting quote to the server!');
      }
    };

    const syncQuotes = async () => {
      try {
        const localQuotes = getStoredQuotes();
        const serverQuotes = await fetchQuotesFromServer();
        
        // Merge quotes, resolving conflicts (server takes precedence)
        const mergedQuotes = [...serverQuotes, ...localQuotes];
        
        // Remove duplicates by checking if the quote text already exists
        const uniqueQuotes = mergedQuotes.filter((quote, index, self) =>
          index === self.findIndex(q => q.text === quote.text)
        );
  
        saveQuotes(uniqueQuotes);
        alert("Quotes synced with server!");
        return uniqueQuotes;
      } catch (error) {
        console.error('Error during syncing:', error);
      }
    };

    setInterval(syncQuotes, 3600);