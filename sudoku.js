class SudokuGame {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.initialGrid = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.selectedNumber = null;
        this.mistakes = 0;
        this.hintsUsed = 0;
        this.gameStartTime = null;
        this.timerInterval = null;
        this.isGameComplete = false;
        
        this.difficulties = {
            easy: 45,
            medium: 35,
            hard: 25,
            expert: 17
        };
        
        this.initializeElements();
        this.attachEventListeners();
        this.startNewGame();
    }
    
    initializeElements() {
        this.gridElement = document.getElementById('sudoku-grid');
        this.timerElement = document.getElementById('timer');
        this.mistakesElement = document.getElementById('mistakes-count');
        this.hintsElement = document.getElementById('hints-count');
        this.statusElement = document.getElementById('status-message');
        this.difficultySelect = document.getElementById('difficulty-select');
        this.victoryModal = document.getElementById('victory-modal');
        
        this.buttons = {
            newGame: document.getElementById('new-game-btn'),
            solve: document.getElementById('solve-btn'),
            check: document.getElementById('check-btn'),
            hint: document.getElementById('hint-btn'),
            clear: document.getElementById('clear-btn'),
            playAgain: document.getElementById('play-again-btn'),
            closeModal: document.getElementById('close-modal-btn')
        };
        
        this.numberButtons = document.querySelectorAll('.number-btn');
    }
    
    attachEventListeners() {
        // Button event listeners
        this.buttons.newGame.addEventListener('click', () => this.startNewGame());
        this.buttons.solve.addEventListener('click', () => this.solvePuzzle());
        this.buttons.check.addEventListener('click', () => this.checkSolution());
        this.buttons.hint.addEventListener('click', () => this.giveHint());
        this.buttons.clear.addEventListener('click', () => this.clearCell());
        this.buttons.playAgain.addEventListener('click', () => {
            this.closeModal();
            this.startNewGame();
        });
        this.buttons.closeModal.addEventListener('click', () => this.closeModal());
        
        // Number pad event listeners
        this.numberButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = parseInt(e.target.dataset.number);
                this.selectNumber(number);
            });
        });
        
        // Keyboard event listeners
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Difficulty change listener
        this.difficultySelect.addEventListener('change', () => this.startNewGame());
    }
    
    createGrid() {
        this.gridElement.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => this.selectCell(row, col));
                
                this.gridElement.appendChild(cell);
            }
        }
    }
    
    updateGrid() {
        const cells = this.gridElement.querySelectorAll('.cell');
        
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = this.grid[row][col];
            
            // Reset classes
            cell.className = 'cell';
            
            // Add appropriate classes
            if (this.initialGrid[row][col] !== 0) {
                cell.classList.add('given');
            }
            
            if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
                cell.classList.add('selected');
            }
            
            // Highlight related cells
            if (this.selectedCell) {
                const selectedRow = this.selectedCell.row;
                const selectedCol = this.selectedCell.col;
                const selectedValue = this.grid[selectedRow][selectedCol];
                
                // Highlight same row, column, and 3x3 box
                if (row === selectedRow || col === selectedCol || 
                    (Math.floor(row / 3) === Math.floor(selectedRow / 3) && 
                     Math.floor(col / 3) === Math.floor(selectedCol / 3))) {
                    cell.classList.add('highlight-related');
                }
                
                // Highlight cells with same number
                if (value !== 0 && value === selectedValue) {
                    cell.classList.add('highlight-same');
                }
            }
            
            // Check for errors
            if (value !== 0 && !this.isValidMove(row, col, value)) {
                cell.classList.add('error');
            }
            
            cell.textContent = value || '';
        });
    }
    
    selectCell(row, col) {
        if (this.isGameComplete) return;
        
        this.selectedCell = { row, col };
        this.updateGrid();
        
        // Update number pad selection based on cell value
        const cellValue = this.grid[row][col];
        this.selectNumber(cellValue);
    }
    
    selectNumber(number) {
        this.selectedNumber = number;
        
        // Update number button styles
        this.numberButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.number) === number) {
                btn.classList.add('active');
            }
        });
        
        // If a cell is selected and number is chosen, fill the cell
        if (this.selectedCell && number !== null) {
            this.fillCell(this.selectedCell.row, this.selectedCell.col, number);
        }
    }
    
    fillCell(row, col, number) {
        // Don't modify given numbers
        if (this.initialGrid[row][col] !== 0) {
            this.showStatus('Cannot modify given numbers!', 'error');
            return;
        }
        
        const oldValue = this.grid[row][col];
        this.grid[row][col] = number;
        
        // Check if move is valid
        if (number !== 0 && !this.isValidMove(row, col, number)) {
            this.mistakes++;
            this.updateStats();
            this.showStatus('Invalid move! This number conflicts with existing numbers.', 'error');
        } else if (number !== 0 && oldValue === 0) {
            this.showStatus('Good move!', 'success');
        }
        
        this.updateGrid();
        this.checkWin();
    }
    
    isValidMove(row, col, number) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (c !== col && this.grid[row][c] === number) {
                return false;
            }
        }
        
        // Check column
        for (let r = 0; r < 9; r++) {
            if (r !== row && this.grid[r][col] === number) {
                return false;
            }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if ((r !== row || c !== col) && this.grid[r][c] === number) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    clearCell() {
        if (!this.selectedCell) {
            this.showStatus('Please select a cell first!', 'error');
            return;
        }
        
        const { row, col } = this.selectedCell;
        
        if (this.initialGrid[row][col] !== 0) {
            this.showStatus('Cannot clear given numbers!', 'error');
            return;
        }
        
        this.grid[row][col] = 0;
        this.updateGrid();
        this.showStatus('Cell cleared!', 'info');
    }
    
    giveHint() {
        if (this.isGameComplete) return;
        
        // Find an empty cell and fill it with the correct value
        const emptyCells = [];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length === 0) {
            this.showStatus('No empty cells to hint!', 'info');
            return;
        }
        
        // Choose a random empty cell
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const { row, col } = randomCell;
        
        // Fill with solution value
        this.grid[row][col] = this.solution[row][col];
        this.hintsUsed++;
        
        // Select the hinted cell
        this.selectedCell = { row, col };
        
        this.updateGrid();
        this.updateStats();
        this.showStatus('Hint given!', 'success');
        this.checkWin();
    }
    
    solvePuzzle() {
        if (confirm('Are you sure you want to solve the puzzle? This will end the current game.')) {
            this.grid = this.solution.map(row => [...row]);
            this.isGameComplete = true;
            this.stopTimer();
            this.updateGrid();
            this.showStatus('Puzzle solved!', 'success');
        }
    }
    
    checkSolution() {
        let errors = 0;
        const errorCells = [];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] !== 0 && !this.isValidMove(row, col, this.grid[row][col])) {
                    errors++;
                    errorCells.push({ row, col });
                }
            }
        }
        
        if (errors === 0) {
            this.showStatus('No errors found! Keep going!', 'success');
        } else {
            this.showStatus(`Found ${errors} error(s). Check highlighted cells.`, 'error');
        }
    }
    
    checkWin() {
        // Check if grid is completely filled
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }
        
        // Check if all moves are valid
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (!this.isValidMove(row, col, this.grid[row][col])) {
                    return false;
                }
            }
        }
        
        // Game completed successfully
        this.isGameComplete = true;
        this.stopTimer();
        this.showVictoryModal();
        return true;
    }
    
    generateSudoku() {
        // Start with empty grid
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        
        // Fill the grid using backtracking
        this.solveSudoku(this.solution);
        
        // Create puzzle by removing numbers
        this.grid = this.solution.map(row => [...row]);
        const difficulty = this.difficultySelect.value;
        const numbersToKeep = this.difficulties[difficulty];
        
        // Remove numbers randomly until we have the desired difficulty
        const totalCells = 81;
        const numbersToRemove = totalCells - numbersToKeep;
        
        for (let i = 0; i < numbersToRemove; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            } while (this.grid[row][col] === 0);
            
            this.grid[row][col] = 0;
        }
        
        // Store initial grid state
        this.initialGrid = this.grid.map(row => [...row]);
    }
    
    solveSudoku(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    
                    for (let num of numbers) {
                        if (this.isValidPlacement(grid, row, col, num)) {
                            grid[row][col] = num;
                            
                            if (this.solveSudoku(grid)) {
                                return true;
                            }
                            
                            grid[row][col] = 0;
                        }
                    }
                    
                    return false;
                }
            }
        }
        
        return true;
    }
    
    isValidPlacement(grid, row, col, number) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (grid[row][c] === number) {
                return false;
            }
        }
        
        // Check column
        for (let r = 0; r < 9; r++) {
            if (grid[r][col] === number) {
                return false;
            }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (grid[r][c] === number) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    startNewGame() {
        this.isGameComplete = false;
        this.mistakes = 0;
        this.hintsUsed = 0;
        this.selectedCell = null;
        this.selectedNumber = null;
        
        this.generateSudoku();
        this.createGrid();
        this.updateGrid();
        this.updateStats();
        this.startTimer();
        this.showStatus('New game started! Good luck!', 'info');
        
        // Clear number button selection
        this.numberButtons.forEach(btn => btn.classList.remove('active'));
    }
    
    startTimer() {
        this.gameStartTime = Date.now();
        this.stopTimer(); // Clear any existing timer
        
        this.timerInterval = setInterval(() => {
            if (!this.isGameComplete) {
                this.updateTimer();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        if (!this.gameStartTime) return;
        
        const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        this.timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateStats() {
        this.mistakesElement.textContent = this.mistakes;
        this.hintsElement.textContent = this.hintsUsed;
    }
    
    showStatus(message, type = 'info') {
        this.statusElement.textContent = message;
        this.statusElement.className = `status-message ${type}`;
        
        // Clear message after 3 seconds
        setTimeout(() => {
            this.statusElement.textContent = '';
            this.statusElement.className = 'status-message';
        }, 3000);
    }
    
    showVictoryModal() {
        const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('final-time').textContent = timeString;
        document.getElementById('final-mistakes').textContent = this.mistakes;
        document.getElementById('final-hints').textContent = this.hintsUsed;
        
        this.victoryModal.classList.remove('hidden');
    }
    
    closeModal() {
        this.victoryModal.classList.add('hidden');
    }
    
    handleKeyPress(event) {
        if (this.isGameComplete) return;
        
        const key = event.key;
        
        // Number keys 1-9
        if (key >= '1' && key <= '9') {
            event.preventDefault();
            this.selectNumber(parseInt(key));
        }
        
        // Delete/Backspace keys
        if (key === 'Delete' || key === 'Backspace') {
            event.preventDefault();
            this.selectNumber(0);
        }
        
        // Arrow keys for navigation
        if (this.selectedCell) {
            let newRow = this.selectedCell.row;
            let newCol = this.selectedCell.col;
            
            switch (key) {
                case 'ArrowUp':
                    newRow = Math.max(0, newRow - 1);
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    newRow = Math.min(8, newRow + 1);
                    event.preventDefault();
                    break;
                case 'ArrowLeft':
                    newCol = Math.max(0, newCol - 1);
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                    newCol = Math.min(8, newCol + 1);
                    event.preventDefault();
                    break;
            }
            
            if (newRow !== this.selectedCell.row || newCol !== this.selectedCell.col) {
                this.selectCell(newRow, newCol);
            }
        }
        
        // Keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (key.toLowerCase()) {
                case 'n':
                    event.preventDefault();
                    this.startNewGame();
                    break;
                case 'h':
                    event.preventDefault();
                    this.giveHint();
                    break;
                case 's':
                    event.preventDefault();
                    this.solvePuzzle();
                    break;
            }
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});

// Add some helpful keyboard shortcuts info
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard shortcuts tooltip or help
    const helpText = `
    Keyboard Shortcuts:
    • Numbers 1-9: Fill selected cell
    • Delete/Backspace: Clear selected cell
    • Arrow keys: Navigate grid
    • Ctrl+N: New game
    • Ctrl+H: Get hint
    • Ctrl+S: Solve puzzle
    `;
    
    // You can uncomment the following lines to show help on first load
    // setTimeout(() => {
    //     if (confirm('Would you like to see keyboard shortcuts?')) {
    //         alert(helpText);
    //     }
    // }, 1000);
});