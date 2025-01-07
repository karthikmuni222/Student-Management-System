const students = [
    { id: 1, name: "John Doe", english: 85, maths: 90, science: 88, social: 92 },
    { id: 2, name: "Jane Smith", english: 92, maths: 88, science: 94, social: 85 },
    { id: 3, name: "Bob Johnson", english: 78, maths: 95, science: 82, social: 88 },
    { id: 4, name: "Alice Brown", english: 95, maths: 82, science: 90, social: 91 },
    { id: 5, name: "Charlie Wilson", english: 88, maths: 84, science: 86, social: 87 }
];

const subjectSelect = document.getElementById('subject');
const filterTypeInputs = document.getElementsByName('filterType');
const value1Input = document.getElementById('value1');
const value2Input = document.getElementById('value2');
const filterBtn = document.getElementById('filterBtn');
const clearBtn = document.getElementById('clearBtn');
const studentTableBody = document.getElementById('studentTableBody');

let currentSort = {
    column: 'id',
    ascending: true
};

displayStudents(students);

filterBtn.addEventListener('click', applyFilter);
clearBtn.addEventListener('click', clearFilter);

document.querySelectorAll('th').forEach(header => {
    header.addEventListener('click', () => {
        const column = getColumnKey(header.textContent);
        sortTable(column);
    });
});

filterTypeInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (input.value === 'between') {
            value2Input.classList.remove('hidden'); 
        } else {
            value2Input.classList.add('hidden');  
        }
    });
});

function getColumnKey(headerText) {
    const columnMap = {
        'S.No': 'id',
        'Name': 'name',
        'English': 'english',
        'Maths': 'maths',
        'Science': 'science',
        'Social Science': 'social'
    };
    return columnMap[headerText];
}

function displayStudents(studentsToDisplay) {
    studentTableBody.innerHTML = '';
    studentsToDisplay.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.english}</td>
            <td>${student.maths}</td>
            <td>${student.science}</td>
            <td>${student.social}</td>
        `;
        studentTableBody.appendChild(row);
    });
}

function applyFilter() {
    const subject = subjectSelect.value;
    if (!subject) {
        alert('Please select a subject');
        return;
    }

    const filterType = Array.from(filterTypeInputs).find(input => input.checked)?.value;
    if (!filterType) {
        alert('Please select a filter type');
        return;
    }

    const value1 = parseInt(value1Input.value);
    const value2 = parseInt(value2Input.value);

    if (isNaN(value1) || (filterType === 'between' && isNaN(value2))) {
        alert('Please enter valid numeric values');
        return;
    }

    let filteredStudents = students.filter(student => {
        const score = student[subject];
        switch (filterType) {
            case 'above':
                return score > value1;
            case 'below':
                return score < value1;
            case 'between':
                return score >= value1 && score <= value2;
            default:
                return true;
        }
    });
    displayStudents(filteredStudents);
}

function clearFilter() {
    subjectSelect.value = '';
    filterTypeInputs.forEach(input => input.checked = false);
    value1Input.value = '';
    value2Input.value = '';
    value2Input.classList.add('hidden');
    displayStudents(students);
}

function sortTable(column) {
    if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.column = column;
        currentSort.ascending = true;
    }
    const sortedStudents = [...students].sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];

        if (typeof aValue === 'string') {
            return currentSort.ascending 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return currentSort.ascending 
            ? aValue - bValue 
            : bValue - aValue;
    });
    displayStudents(sortedStudents);
}
