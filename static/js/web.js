// Selecting the modals
let modal = document.getElementById('myModal');
let modalInside = document.querySelector('.modal-content')
let closeModal = document.querySelector('.closeModal')

function getTable(url, index) {
    actualUrl = url + index.toString();
    fetch(actualUrl)  // set the path; the method is GET by default, but can be modified with a second parameter
        .then((response) => response.json())  // parse JSON format into JS object
        .then((data) => {
            // creating the table
            let createBody = document.getElementsByTagName('body')[0];
            let createTable = document.createElement('table');
            createTable.style.width = '100%';
            createTable.setAttribute('border', '1');
            let endOfBody = document.createElement('tbody');
            // deleting not needed columns of data.
            for (let i in data.results) {
                delete data.results[i]["rotation_period"]
                delete data.results[i]["orbital_period"]
                delete data.results[i]["gravity"]
                delete data.results[i]["films"]
                delete data.results[i]["created"]
                delete data.results[i]["url"]
                delete data.results[i]["edited"]
            }
            const dataResults = Object.values(data.results[0]);
            // creating the table rows based on how many rows of data in dataResults
            for (row in data.results) {
                let rowOfTable = document.createElement('tr');
                rowOfTable.setAttribute('id', 'row' + row);
                // creating the table columns based on how many rows of data in dataResults
                for (col in dataResults) {
                    let colOfTable = document.createElement('td');
                    colOfTable.setAttribute('id', 'cell' + col);
                    rowOfTable.appendChild(colOfTable)
                    const dataResultsPerRow = Object.values(data.results[row]);
                    // Checking for resident cols
                    if (col == 6) {
                        // This happen if there is no data in dataResultsPerRow.
                        if (dataResultsPerRow[col].length == 0) {
                            colOfTable.innerHTML = 'No known residents'
                        }
                        // Generates the links of residents and adds <a> tag and a button
                        else {
                            let residentButton = document.createElement('button');
                            residentButton.setAttribute('class', 'buttons')
                            let residentLinks = document.createElement('a');
                            residentLinks.setAttribute('class', 'invisible');
                            residentButton.append(dataResultsPerRow[col].length);
                            colOfTable.appendChild(residentButton);
                            const dataOfResidentInRows = Object.values(data.results[row]['residents'])
                            let arrayLength = dataOfResidentInRows.length;
                            for (let i = 0; i < arrayLength; i++) {
                                residentLinks.append(dataOfResidentInRows[i]);
                                residentButton.appendChild(residentLinks);
                            }
                            funcModal(residentButton, dataOfResidentInRows)
                        }
                    } else {
                        colOfTable.innerHTML = dataResultsPerRow[col].toString();
                    }
                }
                endOfBody.appendChild(rowOfTable);
            }
            createTable.appendChild(endOfBody);
            createBody.appendChild(createTable);
        })
}

function funcModal(residentButton, dataOfResidentInRows) {
    // This func will create a table in modal
    residentButton.addEventListener('click', function () {
        modal.style.display = "block";
        for (let linkOfResidents of dataOfResidentInRows) {
            fetch(linkOfResidents)  // set the path; the method is GET by default, but can be modified with a second parameter
                .then((response) => response.json())  // parse JSON format into JS object
                .then((residentData) => {
                    let tableOfModal = document.createElement('table')
                    modalInside.appendChild(tableOfModal);
                    for (linkRow in residentData) {
                        const residentValuesOfResidentData = Object.values(residentData);
                        console.log(residentValuesOfResidentData)
                        let tableRowOfModal = document.createElement('tr');
                        tableOfModal.appendChild(tableRowOfModal);
                        tableRowOfModal.setAttribute('id', 'row' + linkRow);
                        for (linkCol in residentData) {
                            let tableColOfModal = document.createElement('td');
                            tableColOfModal.setAttribute('id', 'cell' + linkCol);
                            tableRowOfModal.appendChild(tableColOfModal)
                            tableColOfModal.innerHTML = residentValuesOfResidentData;
                        }
                    }

                })
        }
    });
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });
}


let index = 0;
getTable('https://swapi.dev/api/planets/?page=', ++index);
document.querySelector('#nextPage').addEventListener('click', function () {
    if (index < 6) {
        let tableBody = document.querySelector('tbody');
        let stable = document.querySelector('table');
        stable.remove();
        tableBody.remove();
        getTable('https://swapi.dev/api/planets/?page=', ++index);
    }
})
document.querySelector('#back').addEventListener('click', function () {
    if (index > 1) {
        let tableBody = document.querySelector('tbody');
        let stable = document.querySelector('table');
        stable.remove();
        tableBody.remove();
        getTable('https://swapi.dev/api/planets/?page=', --index);
    }
})
