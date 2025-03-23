document.addEventListener('DOMContentLoaded', () => {
    // Create employee deck with 10 cards
    function createEmployeeDeck(employeeName) {
      const deck = document.createElement('div');
      deck.className = 'deck';
      deck.dataset.employee = employeeName;
      const hash = [...employeeName].reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const colorClass = 'color-' + ((hash % 11) + 1);
      for (let i = 0; i < 10; i++) {
        const card = document.createElement('div');
        card.className = 'employee-card ' + colorClass;
        card.draggable = true;
        card.textContent = employeeName;
        card.dataset.employee = employeeName;
        card.style.top = (i * 2) + 'px';
        card.style.left = (i * 2) + 'px';
        card.style.zIndex = i + 1;
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        deck.appendChild(card);
      }
      deck.addEventListener('dragover', (e) => {
        e.preventDefault();
        deck.classList.add('drag-over');
      });
      deck.addEventListener('dragleave', () => {
        deck.classList.remove('drag-over');
      });
      deck.addEventListener('drop', (e) => {
        e.preventDefault();
        deck.classList.remove('drag-over');
        const cardId = e.dataTransfer.getData("text/plain");
        const card = document.getElementById(cardId);
        if (card) {
          const cardsInDeck = deck.querySelectorAll('.employee-card');
          if (cardsInDeck.length < 10) {
            if (card.parentElement) {
              card.parentElement.removeChild(card);
            }
            deck.appendChild(card);
          } else {
            alert("Deck already has 10 cards for " + deck.dataset.employee);
          }
        }
      });
      return deck;
    }
  
    let draggedCard = null;
    function handleDragStart(e) {
      draggedCard = this;
      if (!this.id) {
        this.id = 'card-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      }
      e.dataTransfer.setData("text/plain", this.id);
      setTimeout(() => { this.style.opacity = "0.5"; }, 0);
    }
    function handleDragEnd() {
      this.style.opacity = "1";
    }
  
    // Set up droppable cells for schedule grid
    document.querySelectorAll('.droppable').forEach(cell => {
      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        cell.classList.add('drag-over');
      });
      cell.addEventListener('dragleave', () => {
        cell.classList.remove('drag-over');
      });
      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('drag-over');
        const cardId = e.dataTransfer.getData("text/plain");
        const card = document.getElementById(cardId);
        if (card) {
          if (card.parentElement && card.parentElement.classList.contains('deck')) {
            card.parentElement.removeChild(card);
          }
          cell.appendChild(card);
          card.style.position = 'static';
          card.style.top = 'auto';
          card.style.left = 'auto';
          card.style.zIndex = 'auto';
        }
      });
    });
  
    const employeeDecksContainer = document.getElementById('employeeDecks');
    employeeDecksContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    employeeDecksContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      const cardId = e.dataTransfer.getData("text/plain");
      const card = document.getElementById(cardId);
      if (card) {
        const employeeName = card.dataset.employee;
        const decks = employeeDecksContainer.getElementsByClassName('deck');
        let targetDeck = null;
        for (let i = 0; i < decks.length; i++) {
          if (decks[i].dataset.employee === employeeName) {
            targetDeck = decks[i];
            break;
          }
        }
        if (targetDeck) {
          const cardsInDeck = targetDeck.querySelectorAll('.employee-card');
          if (card.parentElement) {
            card.parentElement.removeChild(card);
          }
          if (cardsInDeck.length >= 10) {
            targetDeck.removeChild(cardsInDeck[0]); // remove oldest card
          }
          card.style.position = 'absolute';
          card.style.top = (cardsInDeck.length * 2) + 'px';
          card.style.left = (cardsInDeck.length * 2) + 'px';
          card.style.zIndex = cardsInDeck.length + 1;
          targetDeck.appendChild(card);
        }
      }
    });
  
    const discardZone = document.getElementById('discardZone');
    discardZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      discardZone.style.backgroundColor = "#e0f7fa";
    });
    discardZone.addEventListener('dragleave', () => {
      discardZone.style.backgroundColor = "#fafafa";
    });
    discardZone.addEventListener('drop', (e) => {
      e.preventDefault();
      discardZone.style.backgroundColor = "#fafafa";
      const cardId = e.dataTransfer.getData("text/plain");
      const card = document.getElementById(cardId);
      if (card) {
        card.classList.add('discarding');
        setTimeout(() => {
          const employeeName = card.dataset.employee;
          const decks = employeeDecksContainer.getElementsByClassName('deck');
          let targetDeck = null;
          for (let i = 0; i < decks.length; i++) {
            if (decks[i].dataset.employee === employeeName) {
              targetDeck = decks[i];
              break;
            }
          }
          if (!targetDeck) {
            targetDeck = createEmployeeDeck(employeeName);
            employeeDecksContainer.appendChild(targetDeck);
          }
          const cardsInDeck = targetDeck.querySelectorAll('.employee-card');
          if (card.parentElement) {
            card.parentElement.removeChild(card);
          }
          if (cardsInDeck.length >= 10) {
            targetDeck.removeChild(cardsInDeck[0]);
          }
          card.style.position = 'absolute';
          card.style.top = (cardsInDeck.length * 2) + 'px';
          card.style.left = (cardsInDeck.length * 2) + 'px';
          card.style.zIndex = cardsInDeck.length + 1;
          targetDeck.appendChild(card);
          card.classList.remove('discarding');
        }, 300);
      }
    });
  
    document.getElementById('resetSchedule').addEventListener('click', () => {
      document.querySelectorAll('.droppable').forEach(cell => {
        const cards = cell.querySelectorAll('.employee-card');
        cards.forEach(card => {
          const employeeName = card.dataset.employee;
          let targetDeck = null;
          const decks = employeeDecksContainer.getElementsByClassName('deck');
          for (let i = 0; i < decks.length; i++) {
            if (decks[i].dataset.employee === employeeName) {
              targetDeck = decks[i];
              break;
            }
          }
          if (!targetDeck) {
            targetDeck = createEmployeeDeck(employeeName);
            employeeDecksContainer.appendChild(targetDeck);
          }
          const cardsInDeck = targetDeck.querySelectorAll('.employee-card');
          if (cardsInDeck.length >= 10) {
            targetDeck.removeChild(cardsInDeck[0]);
          }
          card.style.position = 'absolute';
          card.style.top = (cardsInDeck.length * 2) + 'px';
          card.style.left = (cardsInDeck.length * 2) + 'px';
          card.style.zIndex = cardsInDeck.length + 1;
          targetDeck.appendChild(card);
        });
        cell.innerHTML = '';
      });
    });
  
    // Initialize decks from stored employees
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    const decksContainer = document.getElementById('employeeDecks');
    storedEmployees.forEach(name => {
      const deck = createEmployeeDeck(name);
      decksContainer.appendChild(deck);
    });

    // Dark Mode Toggle for schedule page
    const darkModeToggle = document.getElementById('darkModeToggle');
    if(darkModeToggle) {
      if(localStorage.getItem('darkMode') === 'enabled'){
          document.body.classList.add('dark-mode');
          darkModeToggle.textContent = "Light Mode";
      }
      darkModeToggle.addEventListener('click', () => {
          document.body.classList.toggle('dark-mode');
          if(document.body.classList.contains('dark-mode')){
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.textContent = "Light Mode";
          } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.textContent = "Dark Mode";
          }
      });
    }

    // AI Suggestion Button functionality
    const aiSuggestionBtn = document.getElementById('aiSuggestionBtn');
    if(aiSuggestionBtn) {
      aiSuggestionBtn.addEventListener('click', () => {
          const instructions = localStorage.getItem('instructions') || "";
          const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
          const droppableCells = Array.from(document.querySelectorAll('.droppable')).filter(cell => cell.innerHTML.trim() === "");
          storedEmployees.forEach(employeeName => {
             const decks = document.getElementById('employeeDecks').getElementsByClassName('deck');
             let targetDeck = null;
             for(let i = 0; i < decks.length; i++){
               if(decks[i].dataset.employee === employeeName){
                 targetDeck = decks[i];
                 break;
               }
             }
             if(targetDeck) {
                const card = targetDeck.querySelector('.employee-card');
                if(card && droppableCells.length > 0) {
                   const randomIndex = Math.floor(Math.random() * droppableCells.length);
                   const cell = droppableCells[randomIndex];
                   if(card.parentElement) {
                      card.parentElement.removeChild(card);
                   }
                   cell.appendChild(card);
                   card.style.position = 'static';
                   card.style.top = 'auto';
                   card.style.left = 'auto';
                   card.style.zIndex = 'auto';
                   droppableCells.splice(randomIndex, 1);
                }
             }
          });
          console.log("AI suggestion executed with instructions:", instructions);
      });
    }
  });