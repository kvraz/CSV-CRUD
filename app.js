let filename = "" //string to store the filename of the uploaded csv
let tableData = []; //array that holds one object per csv record
let idCount = 1; //id counter to assign unique ids to every array object
const recordModal = document.getElementById("record_modal"); //modal that opens after clicking "Edit" in an array row so that the user can edit the row's properties
let editID; //the id of the row that will be edited
let modalMode = "edit"; //same modal is used for add and edit records
let dropdownVisible = false; //the state of the dropdown for view/hide columns

//read the data from .csv file
document.getElementById("upload_csv").addEventListener("change", readCSV);

function readCSV(event) {
    const file = event.target.files[0]; //get the file from the event
    filename = file.name; //save original .csv filename
    const reader = new FileReader(); //instantiate a file reader

    reader.onload = function (e) {    //define the parsing process before reading
        const text = e.target.result; //get the csv as a string
        const lines = text.split('\n'); //split the string on line breaks
        const headers = lines[0].split(','); //get the first line as header

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(','); //get each data row
            const obj = {}; //create an object for each row
            obj.id = idCount; //assign id
            idCount++; //increment id count
            headers.forEach((header, index) => {
                obj[header] = values[index] //match headers with values
            });
            tableData.push(obj); //add object to the array
        }
        populateTable(tableData);
    }
    reader.readAsText(file); //read the string
}

//populate data table
const table = document.getElementById("data_table");

function populateTable(array) {
    table.innerHTML = ""; //clear previous table data
    if (array.length == 0) return; //sanity check for empty data array

    //create table head section
    const thead = document.createElement("thead");  //create table head
    const headerRow = document.createElement("tr"); //create a row for headers
    Object.keys(array[0]).forEach(key => {   //keys of the first data object are the table headers
        const th = document.createElement("th"); //create table header elements
        th.id = key + "_header"; //assign to each header id relevant to its content (will be helpful for view/hide)
        th.textContent = key; //get the corresponding header name
        headerRow.appendChild(th); //add the header to the row
    });
    //create heading for the actions column
    const actionsHead = document.createElement("th");
    actionsHead.textContent = "actions";
    headerRow.appendChild(actionsHead);

    thead.appendChild(headerRow); //add the headers row to the 
    table.appendChild(thead); //add header section to the table

    //create table body section
    const tbody = document.createElement("tbody");   //create table body
    array.forEach(row => {
        const tr = document.createElement("tr");    //one row for each object
        tr.id = "row_" + row.id; //assign unique id to each row
        Object.keys(row).forEach(key => {
            const td = document.createElement("td"); //one cell for each value
            td.textContent = row[key]; //fill cell
            td.id = row.id + "_" + key + "_body" //assign unique id to each element of the row (will be helpful for view/hide)
            tr.appendChild(td) //add cell to row
        });

        const actionsCell = document.createElement("td"); //rows under the "Actions header"
        //add edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        actionsCell.appendChild(editButton);

        //add delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        actionsCell.appendChild(deleteButton);

        tr.appendChild(actionsCell);
        editButton.addEventListener("click", () => { openEditModal(row.id) }); //call funtion to make the edit modal for the given row visible
        deleteButton.addEventListener("click", () => { deleteRow(row.id) });  //call function to delete the specific row only AFTER the event takes place
        tbody.appendChild(tr); //add row to table body
    });
    table.appendChild(tbody); //add body to table
}

//delete a given row from the object array
function deleteRow(id) {
    tableData = tableData.filter(row => row.id != id); //keep everything but the selected id
    populateTable(tableData); //populate table again
}

//create a pair of label and input field in a dedicated container
function createInputField(key, prefix) {
    const fieldWrapper = document.createElement("div"); //add each label-input pair into a wrapper for display purposes
    fieldWrapper.style.display = "flex";
    fieldWrapper.style.flexDirection = "column"; //make each input appear under the label
    fieldWrapper.style.marginBottom = "10px";

    const label = document.createElement("label"); //create a label for each field
    label.textContent = key; //name the label from the field name
    label.htmlFor = `${prefix}_${key}`; //create a "for" attribute to link label with the input field (dynamic for edit and add modes)

    const input = document.createElement("input"); //create the field
    input.type = "text";
    input.id = `${prefix}_${key}`; //assign id relevant to the field (eg. edit_brand)
    input.name = key;

    //add input fields with their corresponding labels to their wrapper
    fieldWrapper.appendChild(label);
    fieldWrapper.appendChild(input);

    return { fieldWrapper, label, input };
}

//add functionality to the "Add Record" button to make it open the add record modal
document.getElementById("add_button").addEventListener("click", () => { openAddModal() });

//make the edit modal visible but with unpopulated fields in order to create a new record
function openAddModal() {
    modalMode = "add"; //switch to add mode

    const fieldsContainer = document.getElementById("fields_container");
    fieldsContainer.innerHTML = "";

    if (tableData.length == 0) {
        alert("No headers loaded. Must upload CSV first!")
        return;
    }

    Object.keys(tableData[0]).forEach(key => { //get the headers from the first object
        if (key == "id") return; //id will be generated on save automatically

        const { fieldWrapper } = createInputField(key, "add"); //create pair of label-input for each column
        fieldsContainer.append(fieldWrapper)
    });

    recordModal.style.display = 'block';
}

function saveAdd() {
    const newRow = { id: idCount++ }; //create a new row with new incremented id

    Object.keys(tableData[0]).forEach(key => { //get headers from the first object
        if (key == "id") return; //skip the id
        const input = document.getElementById(`add_${key}`) //find the input field that corresponds to the specific value
        newRow[key] = input.value;
    });

    tableData.push(newRow); //add new row to the table
    populateTable(tableData); //re-render the table
    recordModal.style.display = "none"; //hide modal again
}

//make the edit modal visible so that the user can edit the selected row
function openEditModal(id) {
    modalMode = "edit"; //switch to edit mode

    //populate the input fields with the given row data
    const rowData = tableData.find(row => row.id == id); //get the data from the selected row
    const fieldsContainer = document.getElementById("fields_container"); //get the fields container element
    fieldsContainer.innerHTML = ""; //clear any previous field

    editID = id; //match the edit id with the selected row's id
    Object.keys(rowData).forEach(key => {
        if (key == "id") return; //must not edit the id
        const { fieldWrapper, label, input } = createInputField(key, "edit"); //same field creation method for edit and add
        input.value = rowData[key]; //fill the field with the previous values
        fieldsContainer.appendChild(fieldWrapper); //add the wrapper to the field container
    });

    recordModal.style.display = "block"; //change modal visibility
}

//save updates to the selected row
function saveEdit(editID) {
    const rowData = tableData.find(row => row.id == editID); //find the row that matches the object that was edited
    if (!rowData) return; //sanity check

    //replace the old values with the new ones (extracted from the input fields)
    Object.keys(rowData).forEach(key => {
        if (key == "id") return; //must not edit the id
        const input = document.getElementById("edit_" + key); //get the corresponding value for each field
        if (input) {
            rowData[key] = input.value; //update the existing value with the corresponding updated value
        }
    });

    //repopulate table and hide edit modal
    populateTable(tableData);
    recordModal.style.display = "none";
}

//add functionality to the "Cancel" button of the edit modal to make it invisible again
document.getElementById("cancel_button").addEventListener("click", () => { recordModal.style.display = "none" });

//add functionality to the "Save" button of the edit modal to make it apply the changes or save the new row, according to the mode
document.getElementById("save_button").addEventListener("click", (e) => {
    e.preventDefault(); //to prevent form submission
    if (modalMode == "edit") saveEdit(editID);
    else if (modalMode == "add") {
        saveAdd();
        alert("New row added to the bottom of the table.");
    }
});

//add functionality to the "View/Hide" button so that, if a .csv is loaded it will display the view column dropdown
document.getElementById("view_button").addEventListener("click", () => { if (tableData.length == 0) alert("No CSV loaded!"); else toggleDropdown() });

//toggle visibility of the view/hide dropdown
function toggleDropdown() {
    const dropdown = document.getElementById("view_dropdown");
    //get the add and export buttons in order to disable them during the view selection process
    const addButton = document.getElementById("add_button");
    const exportButton = document.getElementById("export_button");

    //if visible hide and update visibility state
    if (dropdownVisible) {
        dropdown.style.display = "none";
        dropdownVisible = false;

        //enable the buttons when the dropdown is closed
        addButton.disabled = false;
        exportButton.disabled = false;
    }
    //if invisible show and update visibility state
    else {
        dropdown.style.display = "block";
        dropdownVisible = true;
        generateCheckboxes();   //if visible view checkboxes should be generated dynamically

        //disable them when the dropdown opens
        addButton.disabled = true;
        exportButton.disabled = true;
    }
}

//generate dynamically visibility checkboxes per column based on the contents of the .csv
function generateCheckboxes() {
    const dropdown = document.getElementById("view_dropdown"); //get the dropdown element
    dropdown.innerHTML = ""; //clear any previous

    Object.keys(tableData[0]).forEach(key => { //get the headers from the first object
        const label = document.createElement("label"); //create a label for each checkbox
        label.htmlFor = key + "_checkbox"; //assgin label to checkbox
        label.textContent = key; //name the label after the specific column

        const checkbox = document.createElement("input"); //create the input
        checkbox.id = key + "_checkbox"; //match with label
        checkbox.type = "checkbox" //turn into checkbox
        checkbox.checked = true; //by default all columns are visible
        checkbox.addEventListener("change", () => toggleColumnVisibility(key, checkbox.checked)); //add event listener for visibility toggle

        label.appendChild(checkbox); //add checkbox to label
        dropdown.appendChild(label); //add label-checkbox pair to dropdown
    });
}

//make a specific table column visible or invisible
function toggleColumnVisibility(key, checked) {
    //hide header
    const header = document.getElementById(key + "_header"); //get element based on unique ide
    if (checked) header.style.display = "table-cell"; //if the checkbox is checked it will display
    else header.style.display = "none"; //unchecked means hide

    //hide every table data under that header
    tableData.forEach(row => { //scan every table row
        const data = document.getElementById(row.id + "_" + key + "_body"); //unice id for every table element established earlier
        if (checked) data.style.display = "table-cell";
        else data.style.display = "none";
    });
}

//get the column names (keys) of every visible column
function getVisibleKeys() {
    const visibleKeys = []; //create an empty list to store all visible columns/headers

    Object.keys(tableData[0]).forEach(key => {
        if (key == "id") return; //exclude the id

        const checkbox = document.getElementById(key + "_checkbox"); //get the checkbox for the given key
        if (checkbox && checkbox.checked) { //check if checkbox is checked (and if a checkbox with the specific column name exists for sanity)
            visibleKeys.push(key); //add the column name to the visibles list
        }
    });
    return visibleKeys;
}

function exportCSV() {
    //sanity check if the user has not uploaded a csv
    if (tableData.length == 0) {
        alert("No CSV loaded. Nothing to download!");
        return;
    }

    //sanity check if the user has hidden every column
    let visibleKeys = getVisibleKeys();
    if (visibleKeys.length == 0) visibleKeys = Object.keys(tableData[0]).filter(key => key !== "id"); //in case the user has not clicked the view/hide button and wants to download the original csv. this will be triggered even if all the columns have been unchecked

    const headerLine = visibleKeys.join(","); //join first line (headers separated by commas)
    let dataLines = ""; //string to be filled with every dataline

    tableData.forEach((row, rowIndex) => {
        let line = ""; //create a line for each row

        visibleKeys.forEach((key, keyIndex) => {
            line += row[key]; //add each column to the line
            if (keyIndex < visibleKeys.length - 1) line += ","; //add a comma between each value except for the last one
        });

        dataLines += line; //add each line to the large data string
        if (rowIndex < tableData.length - 1) dataLines += "\n"; //add a linebreak between each line (except for the last one)
    });

    const csvContent = headerLine + "\n" + dataLines; //merge header and data lines separated by a linebreak
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" }); //store raw data in memory and define their encoding
    const url = URL.createObjectURL(blob); //create a temporary link to that blob

    const a = document.createElement("a"); //create an anchor element
    a.href = url; //link the anchor element to the url
    a.download = "updated_" + filename; //set a name for the file in the download process
    a.click(); //invoke download process

    URL.revokeObjectURL(url); //erase temporary url from memory
}

//add functionality to the "Export" button to begin the export pipeline
document.getElementById("export_button").addEventListener("click", () => { exportCSV() });