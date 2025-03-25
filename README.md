# PentaChat

This project is a simple web application that displays random questions each time the page is refreshed. The questions are fetched from a public Google Spreadsheet, making it easy to update the questions without changing the code.

## Project Structure

```
pentachat
├── src
│   ├── index.html       # Main HTML document for the application
│   ├── styles.css       # Styles for the application
│   └── script.js        # JavaScript code to fetch and display questions
├── .gitignore           # Specifies files to be ignored by Git
└── README.md            # Documentation for the project
```

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```sh
   git clone https://github.com/ferksr/pentachat.git
   cd pentachat
   ```

2. **Open the `index.html` file** in your web browser. You can simply double-click the file or open it through your browser's file menu.

3. **Refresh the page** to see new random questions each time.

## Customizing Questions

To change the questions displayed by the application, you can edit the public Google Spreadsheet that the application fetches questions from. Make sure the spreadsheet is publicly accessible.

## Technologies Used

- HTML
- CSS
- JavaScript

## License

This project is open-source and available under the MIT License.