# CSV CRUD Application

This project is a web-based application designed to manage CSV (Comma-Separated Values) data. It is table-agnostic, meaning it can adapt to any CSV structure by dynamically generating the table based on the file contents.

## Academic Context

This project was developed as part of the course **Application Development & Big Data** in the **Master's in Applied Informatics** program at the University of Macedonia.

## Features

- **Load CSV**: Upload any valid CSV file to view its contents in a table format.
- **Dynamic Table Generation**: Automatically detects headers and renders columns accordingly.
- **CRUD Operations**:
  - **Create**: Add new records to the table.
  - **Read**: View data with support for hiding/showing specific columns.
  - **Update**: Edit existing rows efficiently.
  - **Delete**: Remove unwanted rows from the dataset.
- **Column Visibility**: Toggle the visibility of columns via a dropdown menu.
- **Export**: Download the modified dataset as a new `.csv` file.

## Usage

1. Open `index.html` in any modern web browser.
2. Click the "Load Data" button and select a `.csv` file (e.g., the provided `data.csv`).
3. Use the interface to add, edit, or delete records.
4. (Optional) Use "View/Hide Columns" to adjust the table view.
5. Click "Export" to save your changes to a new CSV file.

## Technical Details

The application runs entirely in the browser using HTML, CSS, and Vanilla JavaScript.

- **Parsing**: The application splits CSV data based on standard comma delimiters (` , `) and newline characters (` \n `).
- **Architecture**: All data is loaded into memory for fast manipulation during the session.

## Limitations

Please note the following limitations due to the simple nature of the parser:

- **Commas in Cells**: The parser does not support commas within individual cell values. If a cell contains a comma, the row formatting will break.
- **Newlines in Cells**: Cells containing newline characters are not supported and will break the parsing logic.
- **Data Validation**: There is currently no type validation when adding or editing records.
- **Empty Lines**: The parser may generate an empty row if the source file ends with an empty line.
- **Performance**: Since all records are loaded into memory, performance may degrade with very large files.
- **UI**: The "View/Hide Columns" dropdown currently requires clicking the button again to close, rather than closing when clicking outside the menu.
