function getPlanet(url, index, nextLink) {
    actualUrl = url + index.toString();
    fetch(actualUrl)  // set the path; the method is GET by default, but can be modified with a second parameter
        .then((response) => response.json())  // parse JSON format into JS object
        .then((data) => {
            let body = document.getElementsByTagName('body')[0];
            let tbl = document.createElement('table');
            tbl.style.width = '100%';
            tbl.setAttribute('border', '1');
            let tbdy = document.createElement('tbody');
            for (let i in data.results) {
                delete data.results[i]["rotation_period"]
                delete data.results[i]["orbital_period"]
                delete data.results[i]["gravity"]
                delete data.results[i]["films"]
                delete data.results[i]["created"]
                delete data.results[i]["url"]
                delete data.results[i]["edited"]
            }
            const values = Object.values(data.results[0]);
            for (row in data.results) {
                let tr = document.createElement('tr');
                tr.setAttribute('id', 'row' + row);
                for (col in values) {
                    let td = document.createElement('td');
                    td.setAttribute('id', 'cell' + col);
                    tr.appendChild(td)
                    const values = Object.values(data.results[row]);
                    if (col == 6) {
                        if (values[col].length == 0) {
                            td.innerHTML = 'No known residents'
                        } else {
                            let button = document.createElement('button');
                            let link = document.createElement('a');
                            link.setAttribute('class', 'invisible');
                            button.append(values[col].length);
                            td.appendChild(button);
                            const residents = Object.values(data.results[row]['residents'])
                            let arrayLength = residents.length;
                            for (let i = 0; i < arrayLength; i++) {
                                link.append(residents[i]);
                                button.appendChild(link);
                            }
                            let modal = document.getElementById('myModal');
                            let modalInside = document.querySelector('.modal-content')
                            let closemodal = document.querySelector('.closeModal')
                            button.addEventListener('click', function () {
                                modal.style.display = "block";
                                for (let linkResidents of residents) {
                                    console.log(linkResidents)
                                    fetch(linkResidents)  // set the path; the method is GET by default, but can be modified with a second parameter
                                        .then((response) => response.json())  // parse JSON format into JS object
                                        .then((residentData) => {
                                            //tablazat
                                            const residentValues = Object.values(residentData);
                                            for (row in residentData) {
                                                console.log(residentValues);
                                                let trmod = document.createElement('tr');
                                                trmod.setAttribute('id', 'row' + row);
                                                for (col in residentData) {
                                                    let tdmod = document.createElement('td');
                                                    tdmod.setAttribute('id', 'cell' + col);
                                                    trmod.appendChild(tdmod)
                                                }
                                            }
                                            modalInside.append(residentValues);
                                            modalInside.appendChild(trmod);

                                        })
                                }
                            });
                            closemodal.addEventListener('click', function () {
                                modal.style.display = 'none';
                            });

                        }
                    } else {
                        td.innerHTML = values[col].toString();
                    }
                }
                tbdy.appendChild(tr);
            }
            tbl.appendChild(tbdy);
            body.appendChild(tbl);
            nextLink.link = data.results;
        });
}

let nextLink = {};
let index = 0;
getPlanet('https://swapi.dev/api/planets/?page=', ++index, nextLink);
document.querySelector('#nextPage').addEventListener('click', function () {
    if (index < 6) {
        let tableBody = document.querySelector('tbody');
        let stable = document.querySelector('table');
        stable.remove();
        tableBody.remove();
        getPlanet('https://swapi.dev/api/planets/?page=', ++index, nextLink);
    }
})
document.querySelector('#back').addEventListener('click', function () {
    if (index > 1) {
        let tableBody = document.querySelector('tbody');
        let stable = document.querySelector('table');
        stable.remove();
        tableBody.remove();
        getPlanet('https://swapi.dev/api/planets/?page=', --index, nextLink);
    }
})
