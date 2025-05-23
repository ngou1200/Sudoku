
Markdown

# Sudoku Game

A classic Sudoku game implemented with HTML, CSS, and JavaScript, featuring multiple difficulty levels, real-time feedback, and a clean, responsive user interface.

## Table of Contents

- [Features](#features)
- [How to Play](#how-to-play)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Code Overview](#code-overview)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

* **Interactive Sudoku Grid**: A dynamically generated 9x9 grid for playing Sudoku.
* **Multiple Difficulty Levels**: Choose from Easy, Medium, Hard, and Expert difficulties, which control the number of pre-filled cells.
* **Number Input**: Fill cells using a clickable number pad or keyboard input.
* **Real-time Validation**: Highlights incorrect entries as you play, but does not prevent them.
* **Cell Highlighting**:
    * Highlights the selected cell.
    * Highlights cells in the same row, column, and 3x3 block as the selected cell.
    * Highlights all cells containing the same number as the selected cell's value.
* **Game Controls**:
    * **New Game**: Starts a new Sudoku puzzle.
    * **Solve**: Fills the entire grid with the correct solution (ends the current game).
    * **Check**: Verifies if the current grid has any invalid moves.
    * **Hint**: Fills a random empty cell with its correct solution value.
    * **Clear**: Clears the value of the currently selected cell.
* **Game Statistics**: Tracks and displays mistakes made and hints used.
* **Timer**: A persistent timer tracks game duration.
* **Status Messages**: Provides feedback on game actions (e.g., "Good move!", "Invalid move!").
* **Victory Modal**: A modal pop-up celebrating completion and showing final game statistics (time, mistakes, hints).
* **Responsive Design**: Adapts to different screen sizes for a seamless experience on various devices.
* **Keyboard Shortcuts**:
    * Numbers 1-9: Fill selected cell.
    * Delete/Backspace: Clear selected cell.
    * Arrow keys: Navigate the grid.
    * `Ctrl+N`: Start a new game.
    * `Ctrl+H`: Get a hint.
    * `Ctrl+S`: Solve the puzzle.

## How to Play

1.  **Start a New Game**: Click the "New Game" button or press `Ctrl+N` to generate a new puzzle.
2.  **Select Difficulty**: Choose your desired difficulty from the dropdown menu (Easy, Medium, Hard, Expert) before starting a new game.
3.  **Select a Cell**: Click on any empty cell in the Sudoku grid to select it. The selected cell and related cells will be highlighted.
4.  **Enter a Number**:
    * Click a number on the number pad below the grid.
    * Use the number keys (1-9) on your keyboard.
5.  **Clear a Cell**: Select a cell and click the "Erase" button on the number pad or press `Delete`/`Backspace` on your keyboard.
6.  **Use Controls**: Utilize the "Solve", "Check", "Hint", and "Clear" buttons as needed.
7.  **Win the Game**: Complete the puzzle by filling all cells correctly. A victory modal will appear with your stats.

## Project Structure

.
├── index.html
├── styles.css
└── sudoku.js


* `index.html`: The main HTML file structuring the game interface.
* `styles.css`: Contains all the CSS for styling the Sudoku game and ensuring responsiveness.
* `sudoku.js`: The core JavaScript file containing the game logic, Sudoku generation, validation, and interaction handling.

## Technologies Used

* **HTML5**: For the structure of the web page.
* **CSS3**: For styling and layout.
* **JavaScript (ES6+)**: For game logic, interactivity, and dynamic content generation.

## Setup and Installation

To run this Sudoku game locally:

1.  **Clone the repository (or download the files):**
    ```bash
    git clone <repository_url>
    cd sudoku-game
    ```
    (Replace `<repository_url>` with the actual URL if this were a Git repository.)
2.  **Open `index.html`:** Simply open the `index.html` file in your web browser. There's no server-side setup required.

## Code Overview

### `index.html`

* Sets up the basic structure including header, game information (timer, difficulty), control buttons, the Sudoku grid container, number pad, and game status area.
* Includes a hidden victory modal that appears upon game completion.
* Links to `styles.css` for visual presentation and `sudoku.js` for functionality.

### `styles.css`

* Provides modern and clean styling for all elements.
* Implements a gradient background, card-like container, and distinct styles for buttons and interactive elements.
* Defines grid layouts for the Sudoku board and number pad.
* Includes responsive design using media queries to ensure usability on smaller screens.
* Features visual cues like highlighting for selected, given, error, and related cells.

### `sudoku.js`

* **`SudokuGame` Class**: Encapsulates all game logic.
    * **Constructor**: Initializes game state variables (grid, solution, mistakes, timer, etc.) and sets up event listeners.
    * **`initializeElements()` and `attachEventListeners()`**: Methods for DOM element references and event binding.
    * **`createGrid()` and `updateGrid()`**: Handle the rendering and updating of the Sudoku board cells dynamically.
    * **`selectCell(row, col)` and `selectNumber(number)`**: Manage user input by selecting cells and numbers.
    * **`fillCell(row, col, number)`**: Places a number in a cell, handles validation, and updates stats.
    * **`isValidMove(row, col, number)`**: Checks if a number placement is valid according to Sudoku rules (row, column, and 3x3 block constraints).
    * **`clearCell()`**: Removes a number from a selected cell.
    * **`giveHint()`**: Provides a correct number for a random empty cell.
    * **`solvePuzzle()`**: Fills the entire grid with the correct solution.
    * **`checkSolution()`**: Iterates through the current grid to find and report errors.
    * **`checkWin()`**: Determines if the puzzle is complete and correctly solved.
    * **`generateSudoku()`**: Generates a full Sudoku solution and then removes numbers based on the selected difficulty to create a playable puzzle.
    * **`solveSudoku(grid)`**: A backtracking algorithm used to generate and solve Sudoku puzzles.
    * **`isValidPlacement(grid, row, col, number)`**: A helper for `solveSudoku` to check if a number can be placed in a given cell during generation/solving.
    * **`shuffleArray(array)`**: Utility function to randomize arrays, used in puzzle generation.
    * **`startNewGame()`**: Resets game state, generates a new puzzle, and starts the timer.
    * **`startTimer()`, `stopTimer()`, `updateTimer()`**: Handle the game timer functionality.
    * **`updateStats()`**: Updates the displayed mistake and hint counts.
    * **`showStatus(message, type)`**: Displays temporary status messages to the user.
    * **`showVictoryModal()` and `closeModal()`**: Control the display of the game completion modal.
    * **`handleKeyPress(event)`**: Manages keyboard input for numbers, navigation, and shortcuts.
* **Initialization**: The `SudokuGame` class is instantiated when the DOM is fully loaded, starting the game.

## Future Enhancements

* **Undo/Redo Functionality**: Implement a stack to keep track of moves for undo/redo capabilities.
* **Pencil Marks/Notes**: Allow users to make small pencil marks in cells for potential numbers.
* **More Sophisticated Hint System**: Hints could suggest *why* a number fits, or guide the user towards a specific solving technique.
* **Custom Puzzle Input**: Allow users to input their own Sudoku puzzles to solve.
* **Save/Load Game**: Persistence of game state using local storage.
* **Animation/Transitions**: Smoother visual feedback for cell selection and value changes.
* **Sound Effects**: Add subtle sound effects for correct/incorrect moves, hints, and victory.

## License

This project is open-source and available under the [MIT License](LICENSE).