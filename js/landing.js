document.addEventListener('DOMContentLoaded', () => {
    let employees = [];
    const employeeNameInput = document.getElementById('employeeNameInput');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const employeeList = document.getElementById('employeeList');
    const proceedBtn = document.getElementById('proceedBtn');
  
    function renderEmployeeList() {
      employeeList.innerHTML = '';
      employees.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = name;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
          employees.splice(index, 1);
          renderEmployeeList();
        });
        li.appendChild(removeBtn);
        employeeList.appendChild(li);
      });
    }
  
    addEmployeeBtn.addEventListener('click', () => {
      const name = employeeNameInput.value.trim();
      if (name && !employees.includes(name)) {
        employees.push(name);
        employeeNameInput.value = '';
        renderEmployeeList();
      }
    });
  
    proceedBtn.addEventListener('click', () => {
      if (employees.length === 0) {
        alert('Please add at least one employee.');
        return;
      }
      localStorage.setItem('employees', JSON.stringify(employees));
      const instructions = document.getElementById('instructions').value;
      localStorage.setItem('instructions', instructions);
      window.location.href = 'schedule.html';
    });
  });