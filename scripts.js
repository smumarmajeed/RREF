// Function to generate the matrix input fields dynamically based on user input
function generateMatrix() {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const matrixContainer = document.getElementById("matrix");

    matrixContainer.innerHTML = ''; // Clear any existing matrix

    console.log("Generating Matrix..."); // Debugging log to check if function is triggered

    // Generate the matrix input fields
    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("matrix-row");
        for (let j = 0; j < cols; j++) {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("matrix-cell");
            const inputElement = document.createElement("input");
            inputElement.type = "number";
            inputElement.id = `cell-${i}-${j}`;
            inputElement.value = ''; // Initialize empty value
            cellDiv.appendChild(inputElement);
            rowDiv.appendChild(cellDiv);
        }
        matrixContainer.appendChild(rowDiv);
    }
}

// Function to calculate the Reduced Row Echelon Form (RREF) of the matrix
function calculateRREF() {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const matrix = [];

    // Get the matrix values from the input fields
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`cell-${i}-${j}`).value);
            row.push(isNaN(value) ? 0 : value); // Handle empty or invalid cells
        }
        matrix.push(row);
    }

    const { matrix: rrefMatrix, steps } = rowReduce(matrix);

    // Display steps and result
    displayStepsAndResult(steps, rrefMatrix);
}

// Function to display steps and result
function displayStepsAndResult(steps, matrix) {
    const resultDiv = document.getElementById("result");
    let resultHTML = "<h2>Calculation Steps:</h2><pre>";

    steps.forEach(step => {
        resultHTML += `${step}\n\n`;
    });

    resultHTML += "</pre><h2>RREF Result:</h2><table>";

    matrix.forEach(row => {
        resultHTML += "<tr>";
        row.forEach(cell => {
            resultHTML += `<td>${Number.isInteger(cell) ? cell : toFractionString(cell)}</td>`; // Show fractions
        });
        resultHTML += "</tr>";
    });

    resultHTML += "</table>";
    resultDiv.innerHTML = resultHTML;
}

// Row reduction algorithm for RREF calculation
function rowReduce(matrix) {
    let lead = 0;
    const rowCount = matrix.length;
    const columnCount = matrix[0].length;
    const steps = []; // Array to store intermediate steps

    // Loop through the rows
    for (let r = 0; r < rowCount; r++) {
        if (lead >= columnCount) break; // Prevent lead from exceeding the number of columns

        let i = r;
        // Look for a non-zero pivot in the column (advance row if pivot is zero)
        while (matrix[i][lead] === 0) {
            i++;
            if (i === rowCount) { // If we reach the end of the rows, reset i and increment lead
                i = r;
                lead++;
                if (lead === columnCount) break; // Exit if we've run out of columns to process
            }
        }

        if (lead === columnCount) break; // Exit the loop if no more pivots are available

        // Swap rows if necessary
        if (i !== r) {
            [matrix[i], matrix[r]] = [matrix[r], matrix[i]];
            steps.push(`Swap row ${i + 1} with row ${r + 1}`);
            steps.push(displayMatrix(matrix)); // Display matrix after swap
        }

        // Normalize the pivot row by dividing by the pivot element
        const lv = matrix[r][lead];
        if (lv !== 0) {
            for (let j = 0; j < columnCount; j++) {
                matrix[r][j] /= lv;
            }
            steps.push(`Normalize row ${r + 1}`);
            steps.push(displayMatrix(matrix)); // Display matrix after normalization
        }

        // Eliminate the pivot column in other rows
        for (let i = 0; i < rowCount; i++) {
            if (i !== r) {
                const lv = matrix[i][lead];
                for (let j = 0; j < columnCount; j++) {
                    matrix[i][j] -= lv * matrix[r][j];
                }
                steps.push(`Eliminate row ${i + 1} using row ${r + 1}`);
                steps.push(displayMatrix(matrix)); // Display matrix after elimination
            }
        }

        lead++; // Move to the next column (pivot)
    }

    steps.push("Final RREF Matrix:");
    steps.push(displayMatrix(matrix));
    return { matrix, steps };
}

// Helper function to display a matrix as a string
function displayMatrix(matrix) {
    return matrix
        .map(row =>
            row
                .map(cell => (Number.isInteger(cell) ? cell : toFractionString(cell))) // Show fractions
                .join("\t")
        )
        .join("\n");
}

// Function to convert a decimal to a simplified fraction string
function toFractionString(num) {
    // Handle common fractions (limited to basic cases)
    const fractions = {
        0.5: "½",
        0.25: "¼",
        0.75: "¾",
        0.3333: "⅓",
        0.6667: "⅔"
    };

    const rounded = parseFloat(num.toFixed(4)); // Round to 4 decimal places
    if (fractions[rounded]) return fractions[rounded]; // Return common fraction if matched

    // Fallback to a/b format using the greatest common divisor (GCD)
    const precision = 10000; // Precision for rounding
    const numerator = Math.round(rounded * precision);
    const denominator = precision;
    const divisor = gcd(numerator, denominator); // Find the gcd of numerator and denominator

    const simplifiedNumerator = numerator / divisor;
    const simplifiedDenominator = denominator / divisor;

    return `${simplifiedNumerator}/${simplifiedDenominator}`;
}

// Helper function to find the greatest common divisor (gcd) of two numbers
function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark');
}

// Initialize the matrix when the page loads
window.onload = generateMatrix;
