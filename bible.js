 
// When the page loads
window.onload = function() {
    // Get references to DOM elements
    var searchBox = document.getElementById('searchBox');
    var searchButton = document.getElementById('searchButton');
    var suggestionsList = document.getElementById('suggestions');
    var originalContent = document.getElementById('originalContent');
    var foundContent = document.getElementById('foundContent');
    var tableCaptions = []; // Store original table captions

    // Fixed suggestions for autocomplete
    var fixedSuggestions = ['Apple', 'Banana', 'Orange', 'Cherry', 'Lemon', 'Strawberry', 'Blueberry', 'Raspberry'];

    // Get table data from the original content
    var tables = originalContent.getElementsByTagName('table');
    var tableContent = [];

    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];
        var caption = table.querySelector('caption').textContent;
        var rows = table.querySelectorAll('tr');

        var tableRows = [];

        for (var j = 0; j < rows.length; j++) {
            var cells = rows[j].querySelectorAll('td');
            var rowCells = [];

            for (var k = 0; k < cells.length; k++) {
                rowCells.push(cells[k].textContent);
            }

            tableRows.push(rowCells);
        }

        tableContent.push({ caption: caption, rows: tableRows });
        tableCaptions.push(caption);
    }

    // Event listener for input in the search box
    searchBox.addEventListener('input', function() {
        var searchText = searchBox.value.trim();
        generateSuggestions(searchText);
    });

    // Event listener for the search button
    searchButton.addEventListener('click', function() {
        searchAndHighlight();
    });

    // Event listener to select the search box content on focus
    searchBox.addEventListener('focus', function() {
        searchBox.select();
    });

    // Event listener for pressing Enter in the search box
    searchBox.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchAndHighlight();
        }
    });

    // Event listener for selecting suggestions from the list
    suggestionsList.addEventListener('click', function(event) {
        var selectedSuggestion = event.target.textContent;
        searchBox.value = selectedSuggestion;
        searchAndHighlight();
    });

    // Function to highlight the matching text
    function highlightText(text, searchTerm) {
        var startIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase());

        if (startIndex === -1) {
            return text; // No match found
        }

        var highlighted = text.substring(0, startIndex) +
            '<span class="highlight">' + text.substring(startIndex, startIndex + searchTerm.length) + '</span>' +
            text.substring(startIndex + searchTerm.length);
        return highlighted;
    }

    // Function to search and highlight content
    function searchAndHighlight() {
        var searchText = searchBox.value.trim();

        if (searchText === '') {
            displayOriginalContent();
            return;
        }

        foundContent.innerHTML = '';
        var matchedTables = [];

        // Loop through each table and its rows to find matches
        for (var i = 0; i < tableContent.length; i++) {
            var table = tableContent[i];
            var matchedRows = [];
            var tableMatched = false;

            // Check if caption matches the search text
            if (table.caption.toLowerCase().includes(searchText.toLowerCase())) {
                tableMatched = true;
                matchedTables.push(createTableElement(table.caption, table.rows, searchText));
            }

            // Check each row for matches
            for (var j = 0; j < table.rows.length; j++) {
                var row = table.rows[j];
                var rowMatched = false;

                for (var k = 0; k < row.length; k++) {
                    if (row[k].toLowerCase().includes(searchText.toLowerCase())) {
                        rowMatched = true;
                        matchedRows.push(row);
                        break;
                    }
                }

                if (rowMatched && !tableMatched) {
                    tableMatched = true;
                }
            }

            // If the table or rows matched, create a new table element and add to matchedTables
            if (tableMatched || matchedRows.length > 0) {
                matchedTables.push(createTableElement(table.caption, matchedRows, searchText));
            }
        }

        // Append the matched table elements to the found content
        matchedTables.forEach(function(matchedTable) {
            foundContent.appendChild(matchedTable);
        });
    }

    // Function to create a new table element
    function createTableElement(caption, rows, searchText) {
        var table = document.createElement('table');
        var tableCaption = document.createElement('caption');
        tableCaption.innerHTML = highlightText(caption, searchText);
        table.appendChild(tableCaption);

        for (var i = 0; i < rows.length; i++) {
            var rowCells = rows[i];
            var row = document.createElement('tr');

            for (var j = 0; j < rowCells.length; j++) {
                var cell = document.createElement('td');
                cell.innerHTML = highlightText(rowCells[j], searchText);
                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        return table;
    }

    // Function to display the original content
    function displayOriginalContent() {
        foundContent.innerHTML = '';
    }

    // Function to generate autocomplete suggestions
    function generateSuggestions(searchText) {
        suggestionsList.innerHTML = '';
        var filteredSuggestions = [];

        if (searchText.trim() === '') {
            // If there's no text in the search box, hide the suggestions and return
            suggestionsList.style.display = 'none';
            return;
        } else {
            suggestionsList.style.display = 'block'; // Show the suggestions box
        }

        filteredSuggestions = fixedSuggestions.filter(function(suggestion) {
            return suggestion.toLowerCase().includes(searchText.toLowerCase());
        });

        tableCaptions.forEach(function(caption) {
            if (caption.toLowerCase().includes(searchText.toLowerCase())) {
                filteredSuggestions.push(caption);
            }
        });

        tableContent.forEach(function(table) {
            table.rows.forEach(function(row) {
                row.forEach(function(cellContent) {
                    if (cellContent.toLowerCase().includes(searchText.toLowerCase())) {
                        filteredSuggestions.push(cellContent);
                    }
                });
            });
        });

        filteredSuggestions.forEach(function(suggestion) {
            var option = document.createElement('li');
            option.textContent = suggestion;
            suggestionsList.appendChild(option);
        });
    }
}; 
