//index db properties

let db; 
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_moneybudget', { autoIncrement: true });
};
 
request.onsuccess = function(event) {
    db = event.target.result
    if (navigator.onLine) {
        newMoneyBudget();
    }
  };
  
request.onerror = function(event) {
console.log(event.target.errorCode);
};

function saveAction(action) {
    const transaction = db.transaction(['new_moneybudget'], 'readwrite');
    const store = transaction.objectStore('new_moneybudget');
    store.add(action);
};

function newMoneyBudget() {
    const transaction = db.transaction(['new_moneybudget'], 'readwrite');
  
    const store = transaction.objectStore('new_moneybudget');
    const getAll = store.getAll();
  
    getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(['new_moneybudget'], 'readwrite');
          const store = transaction.objectStore('new_moneybudget');
          store.clear();

          alert('All saved transactions has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}

// listen for app coming back online
window.addEventListener('online', newMoneyBudget);

