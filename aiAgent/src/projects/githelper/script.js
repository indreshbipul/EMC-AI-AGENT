// ==================== GLOBAL STATE ====================
let currentGame = 'memory';
let score = 0;
let gameLoop = null;
let canvas, ctx;
let gameRunning = false;
let difficulty = 'easy';
let tttMode = 'ai';

// Game specific state
let snake = [], food = {x: 10, y: 10}, dir = {x: 1, y: 0}, nextDir = {x: 1, y: 0};
let flappyBird = {y: 200, velocity: 0}, flappyPipes = [];
let breakoutPaddle = 250, breakoutBall = {x: 300, y: 350, dx: 4, dy: -4}, breakoutBricks = [];
let tetrisBoard = [], tetromino = null, tetrisScore = 0;
let pongPaddle = 250, pongBall = {x: 300, y: 225, dx: 5, dy: 5}, aiPaddle = 250, pongPlayerScore = 0, pongAiScore = 0;
let racingCar = {x: 250}, racingObst = [], racingDist = 0, racingSpeed = 5;
let shooterX = 250, shooterBullets = [], shooterEnemies = [];
let chessBoard = [], chessTurn = 'white', chessSelected = null, chessGameMode = 'pvp'; // pvp or ai
let sudokuBoard = [], sudokuSelected = null;
let platformerPlayer = {x: 50, y: 350, vx: 0, vy: 0}, platformerPlatforms = [], platformerCoins = [];
let memoryCards = [], memoryFlipped = [], memoryMatched = 0, memoryMoves = 0;
let tttBoard = [], tttTurn = 'X';

// Audio
let audioCtx = null;
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playSound(type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    switch(type) {
        case 'flip': osc.frequency.setValueAtTime(600, now); gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); break;
        case 'match': osc.frequency.setValueAtTime(800, now); osc.frequency.setValueAtTime(1000, now + 0.1); gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2); break;
        case 'hit': osc.frequency.setValueAtTime(200, now); gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); break;
        case 'win': osc.frequency.setValueAtTime(500, now); osc.frequency.setValueAtTime(700, now + 0.1); osc.frequency.setValueAtTime(900, now + 0.2); gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); break;
        case 'lose': osc.frequency.setValueAtTime(300, now); osc.frequency.setValueAtTime(200, now + 0.1); osc.frequency.setValueAtTime(100, now + 0.2); gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); break;
        case 'count': osc.frequency.setValueAtTime(800, now); gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15); break;
        case 'go': osc.frequency.setValueAtTime(1000, now); gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); break;
    }
    osc.start(now);
    osc.stop(now + 0.4);
}

// Countdown with sound
function runCountdown(callback) {
    const overlay = document.getElementById('countdown');
    const number = document.getElementById('countNumber');
    overlay.classList.add('active');
    let count = 3;
    number.textContent = count;
    playSound('count');
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            number.textContent = count;
            playSound('count');
        } else if (count === 0) {
            number.textContent = 'GO!';
            playSound('go');
        } else {
            clearInterval(interval);
            overlay.classList.remove('active');
            callback();
        }
    }, 800);
}

// ==================== MEMORY GAME ====================
const memoryIcons = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠', '🎤', '🎧', '🎺', '🎸'];

function initMemoryGame() {
    const pairs = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 12;
    const icons = memoryIcons.slice(0, pairs);
    memoryCards = [];
    let id = 0;
    icons.forEach(icon => {
        memoryCards.push({id: id++, icon, matched: false});
        memoryCards.push({id: id++, icon, matched: false});
    });
    memoryCards.sort(() => Math.random() - 0.5);
    memoryFlipped = [];
    memoryMatched = 0;
    memoryMoves = 0;
    score = 0;
    updateScoreDisplay();
    renderMemoryBoard();
}

function renderMemoryBoard() {
    const board = document.getElementById('gameBoard');
    const cols = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 4 : 6;
    board.style.display = 'grid';
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.innerHTML = '';
    board.style.gap = '10px';
    
    memoryCards.forEach((card, i) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card' + (card.matched ? ' matched' : '');
        if (memoryFlipped.includes(i)) cardEl.classList.add('flipped');
        cardEl.innerHTML = `<div class="card-front">${card.icon}</div><div class="card-back">?</div>`;
        cardEl.onclick = () => flipMemoryCard(i, cardEl);
        board.appendChild(cardEl);
    });
}

function flipMemoryCard(index, el) {
    if (memoryFlipped.length >= 2 || memoryCards[index].matched || memoryFlipped.includes(index)) return;
    el.classList.add('flipped');
    memoryFlipped.push(index);
    playSound('flip');
    
    if (memoryFlipped.length === 2) {
        memoryMoves++;
        const [i1, i2] = memoryFlipped;
        if (memoryCards[i1].icon === memoryCards[i2].icon) {
            memoryCards[i1].matched = true;
            memoryCards[i2].matched = true;
            memoryMatched++;
            score += 10 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3);
            playSound('match');
            updateScoreDisplay();
            
            if (memoryMatched === memoryCards.length / 2) {
                playSound('win');
                setTimeout(() => showWinModal('🎉 Victory!', 'You found all pairs!', 
                    `<div class="final-stat"><span class="final-stat-label">Moves</span><span class="final-stat-value">${memoryMoves}</span></div>
                     <div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, true), 500);
            }
            memoryFlipped = [];
            renderMemoryBoard();
        } else {
            setTimeout(() => {
                const cards = document.querySelectorAll('.memory-card');
                cards[i1].classList.remove('flipped');
                cards[i2].classList.remove('flipped');
                memoryFlipped = [];
            }, 800);
        }
    }
}

// ==================== SNAKE GAME ====================
function initSnakeGame() {
    const speeds = {easy: 120, medium: 90, hard: 60};
    snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    dir = {x: 1, y: 0};
    nextDir = {x: 1, y: 0};
    spawnFood();
    score = 0;
    updateScoreDisplay();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateSnake, speeds[difficulty]);
    drawSnake();
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * 28) + 1,
        y: Math.floor(Math.random() * 20) + 1
    };
    while (snake.some(s => s.x === food.x && s.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * 28) + 1,
            y: Math.floor(Math.random() * 20) + 1
        };
    }
}

function updateSnake() {
    dir = {...nextDir};
    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    
    if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 22 || snake.some(s => s.x === head.x && s.y === head.y)) {
        playSound('lose');
        setTimeout(() => showWinModal('💀 Game Over', 'Snake hit the wall!', 
            `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, false, pongPlayerScore), 100);
        return;
    }
    
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
        playSound('match');
        spawnFood();
    } else {
        snake.pop();
    }
    updateScoreDisplay();
    drawSnake();
}

function drawSnake() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, 600, 450);
    
    ctx.strokeStyle = '#1a1a2e';
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 22; j++) {
            ctx.strokeRect(i * 20, j * 20, 20, 20);
        }
    }
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(food.x * 20 + 10, food.y * 20 + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(food.x * 20 + 7, food.y * 20 + 7, 3, 0, Math.PI * 2);
    ctx.fill();
    
    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#10b981' : '#059669';
        ctx.fillRect(s.x * 20 + 1, s.y * 20 + 1, 18, 18);
        if (i === 0) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(s.x * 20 + 5, s.y * 20 + 5, 4, 4);
            ctx.fillRect(s.x * 20 + 11, s.y * 20 + 5, 4, 4);
        }
    });
}

// ==================== TICTACTOE ====================
function initTicTacToe() {
    tttBoard = Array(9).fill(null);
    tttTurn = 'X';
    score = 0;
    updateScoreDisplay();
    renderTicTacToe();
}

function renderTicTacToe() {
    const board = document.getElementById('gameBoard');
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(3, 1fr)';
    board.innerHTML = '';
    board.style.gap = '5px';
    board.style.width = '320px';
    
    tttBoard.forEach((cell, i) => {
        const cellEl = document.createElement('div');
        cellEl.className = 'ttt-cell' + (cell ? ' ' + cell : '');
        cellEl.textContent = cell || '';
        cellEl.onclick = () => handleTTTClick(i);
        board.appendChild(cellEl);
    });
}

function handleTTTClick(index) {
    if (tttBoard[index] || checkTTTWinner()) return;
    
    tttBoard[index] = tttTurn;
    playSound('flip');
    
    if (checkTTTWinner()) {
        score += 10;
        updateScoreDisplay();
        playSound('win');
        setTimeout(() => showWinModal('🎉 ' + tttTurn + ' Wins!', 'Great game!', 
            `<div class="final-stat"><span class="final-stat-label">Winner</span><span class="final-stat-value">${tttTurn}</span></div>`, true), 500);
        renderTicTacToe();
        return;
    }
    
    if (!tttBoard.includes(null)) {
        playSound('match');
        setTimeout(() => showWinModal('🤝 Draw!', 'No winner this time!', '', false), 500);
        renderTicTacToe();
        return;
    }
    
    tttTurn = tttTurn === 'X' ? 'O' : 'X';
    renderTicTacToe();
    
    if (tttMode === 'ai' && tttTurn === 'O') {
        setTimeout(aiTTTMove, 400);
    }
}

function aiTTTMove() {
    const empty = tttBoard.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
    if (empty.length === 0) return;
    
    for (let i of empty) {
        tttBoard[i] = 'O';
        if (checkTTTWinner()) { tttTurn = 'X'; renderTicTacToe(); return; }
        tttBoard[i] = null;
    }
    
    for (let i of empty) {
        tttBoard[i] = 'X';
        if (checkTTTWinner()) { tttBoard[i] = 'O'; tttTurn = 'X'; renderTicTacToe(); return; }
        tttBoard[i] = null;
    }
    
    const move = empty[Math.floor(Math.random() * empty.length)];
    tttBoard[move] = 'O';
    tttTurn = 'X';
    playSound('flip');
    
    if (checkTTTWinner()) {
        score += 10;
        updateScoreDisplay();
        playSound('win');
        setTimeout(() => showWinModal('🎉 O Wins!', 'AI wins!', 
            `<div class="final-stat"><span class="final-stat-label">Winner</span><span class="final-stat-value">O (AI)</span></div>`, true), 500);
    } else if (!tttBoard.includes(null)) {
        setTimeout(() => showWinModal('🤝 Draw!', 'No winner this time!', '', false), 500);
    }
    renderTicTacToe();
}

function checkTTTWinner() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let w of wins) {
        if (tttBoard[w[0]] && tttBoard[w[0]] === tttBoard[w[1]] && tttBoard[w[0]] === tttBoard[w[2]]) return true;
    }
    return false;
}

// ==================== PONG GAME ====================
const WINNING_SCORE = 5;

function initPongGame() {
    pongPaddle = 250;
    aiPaddle = 250;
    pongBall = {x: 300, y: 225, dx: 5, dy: 5};
    pongPlayerScore = 0;
    pongAiScore = 0;
    score = 0;
    updateScoreDisplay();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updatePong, 16);
    drawPong();
}

function updatePong() {
    pongBall.x += pongBall.dx;
    pongBall.y += pongBall.dy;
    
    if (pongBall.y < 10 || pongBall.y > 440) {
        pongBall.dy *= -1;
        playSound('hit');
    }
    
    // Player paddle (left side)
    if (pongBall.x < 25 && pongBall.y > pongPaddle - 10 && pongBall.y < pongPaddle + 90) {
        pongBall.dx = Math.abs(pongBall.dx) * 1.05;
        pongBall.dy = (pongBall.y - pongPaddle - 40) / 5;
        playSound('hit');
    }
    
    // AI paddle (right side)
    if (pongBall.x > 575 && pongBall.y > aiPaddle - 10 && pongBall.y < aiPaddle + 90) {
        pongBall.dx = -Math.abs(pongBall.dx) * 1.05;
        pongBall.dy = (pongBall.y - aiPaddle - 40) / 5;
        playSound('hit');
    }
    
    // Player scores (ball goes past AI)
    if (pongBall.x < 0) {
        pongPlayerScore++;
        playSound('win');
        updatePongScoreDisplay();
        resetPongBall();
    }
    
    // AI scores (ball goes past player)
    if (pongBall.x > 600) {
        pongAiScore++;
        playSound('lose');
        updatePongScoreDisplay();
        resetPongBall();
    }
    
    // Check for winner
    if (pongPlayerScore >= WINNING_SCORE) {
        playSound('win');
        setTimeout(() => showWinModal('🎉 You Win!', `Final Score: ${pongPlayerScore} - ${pongAiScore}`, 
            `<div class="final-stat"><span class="final-stat-label">You</span><span class="final-stat-value">${pongPlayerScore}</span></div>
             <div class="final-stat"><span class="final-stat-label">AI</span><span class="final-stat-value">${pongAiScore}</span></div>`, true, pongPlayerScore), 100);
        return;
    }
    
    if (pongAiScore >= WINNING_SCORE) {
        playSound('lose');
        setTimeout(() => showWinModal('💀 AI Wins!', `Final Score: ${pongPlayerScore} - ${pongAiScore}`, 
            `<div class="final-stat"><span class="final-stat-label">You</span><span class="final-stat-value">${pongPlayerScore}</span></div>
             <div class="final-stat"><span class="final-stat-label">AI</span><span class="final-stat-value">${pongAiScore}</span></div>`, false, pongPlayerScore), 100);
        return;
    }
    
    // AI movement
    aiPaddle += (pongBall.y - aiPaddle - 40) * 0.08;
    
    drawPong();
}

function updatePongScoreDisplay() {
    document.getElementById('score').textContent = `${pongPlayerScore} - ${pongAiScore}`;
}

function resetPongBall() {
    pongBall = {x: 300, y: 225, dx: 5 * (Math.random() > 0.5 ? 1 : -1), dy: 5 * (Math.random() > 0.5 ? 1 : -1)};
}

function drawPong() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, 600, 450);
    
    // Score display
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(pongPlayerScore, 150, 100);
    ctx.fillStyle = '#ec4899';
    ctx.fillText(pongAiScore, 450, 100);
    
    // Center line
    ctx.strokeStyle = '#2a2a4a';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 450);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Player paddle (left)
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(10, pongPaddle, 15, 80);
    
    // AI paddle (right)
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(575, aiPaddle, 15, 80);
    
    // Ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(pongBall.x, pongBall.y, 10, 0, Math.PI * 2);
    ctx.fill();
}

// ==================== FLAPPY BIRD ====================
function initFlappyGame() {
    const speeds = {easy: 35, medium: 25, hard: 18};
    flappyBird = {y: 200, velocity: 0};
    flappyPipes = [];
    score = 0;
    updateScoreDisplay();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateFlappy, speeds[difficulty]);
    drawFlappy();
}

function updateFlappy() {
    const gravity = difficulty === 'easy' ? 0.4 : difficulty === 'medium' ? 0.5 : 0.6;
    flappyBird.velocity += gravity;
    flappyBird.y += flappyBird.velocity;
    
    if (Math.random() < 0.025) {
        const gap = difficulty === 'easy' ? 160 : difficulty === 'medium' ? 140 : 120;
        const y = Math.random() * (350 - gap) + 50;
        flappyPipes.push({x: 600, y: y, gap: gap, passed: false});
    }
    
    flappyPipes.forEach(p => p.x -= (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5));
    flappyPipes = flappyPipes.filter(p => p.x > -60);
    
    if (flappyBird.y < 20 || flappyBird.y > 420) {
        playSound('lose');
        setTimeout(() => showWinModal('💀 Game Over', 'Bird hit the bounds!', 
            `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, false, pongPlayerScore), 100);
        return;
    }
    
    for (let p of flappyPipes) {
        if (flappyBird.y < p.y || flappyBird.y > p.y + p.gap) {
            if (30 > p.x && 30 < p.x + 50) {
                playSound('lose');
                setTimeout(() => showWinModal('💀 Game Over', 'Bird hit a pipe!', 
                    `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, false, pongPlayerScore), 100);
                return;
            }
        }
        if (p.x + 50 < 30 && !p.passed) {
            p.passed = true;
            score++;
            playSound('match');
            updateScoreDisplay();
        }
    }
    
    drawFlappy();
}

function drawFlappy() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, 600, 450);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0, '#1e3a5f');
    gradient.addColorStop(1, '#0a0a15');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 450);
    
    flappyPipes.forEach(p => {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(p.x, 0, 50, p.y);
        ctx.fillRect(p.x, p.y + p.gap, 50, 450 - p.y - p.gap);
        ctx.fillStyle = '#059669';
        ctx.fillRect(p.x - 5, p.y - 15, 60, 15);
        ctx.fillRect(p.x - 5, p.y + p.gap, 60, 15);
    });
    
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(30, flappyBird.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(35, flappyBird.y - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(40, flappyBird.y);
    ctx.lineTo(55, flappyBird.y + 5);
    ctx.lineTo(40, flappyBird.y + 10);
    ctx.fill();
}

// ==================== BREAKOUT ====================
function initBreakoutGame() {
    const rows = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
    const cols = 8;
    breakoutBricks = [];
    const colors = ['#ef4444', '#f97316', '#fbbf24', '#10b981', '#3b82f6', '#8b5cf6'];
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            breakoutBricks.push({
                x: c * 70 + 25,
                y: r * 25 + 50,
                w: 60,
                h: 18,
                color: colors[r % colors.length],
                alive: true
            });
        }
    }
    
    breakoutPaddle = 250;
    breakoutBall = {x: 300, y: 350, dx: difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5, dy: -3};
    score = 0;
    updateScoreDisplay();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateBreakout, 16);
    drawBreakout();
}

function updateBreakout() {
    breakoutBall.x += breakoutBall.dx;
    breakoutBall.y += breakoutBall.dy;
    
    if (breakoutBall.x < 10 || breakoutBall.x > 590) {
        breakoutBall.dx *= -1;
        playSound('hit');
    }
    if (breakoutBall.y < 10) {
        breakoutBall.dy *= -1;
        playSound('hit');
    }
    
    if (breakoutBall.y > 380 && breakoutBall.y < 400 && breakoutBall.x > breakoutPaddle - 10 && breakoutBall.x < breakoutPaddle + 110) {
        breakoutBall.dy = -Math.abs(breakoutBall.dx);
        breakoutBall.dx = (breakoutBall.x - breakoutPaddle - 50) / 5;
        playSound('hit');
    }
    
    if (breakoutBall.y > 450) {
        playSound('lose');
        setTimeout(() => showWinModal('💀 Game Over', 'Ball fell!', 
            `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, false, pongPlayerScore), 100);
        return;
    }
    
    let allDead = true;
    breakoutBricks.forEach(b => {
        if (b.alive && breakoutBall.x > b.x && breakoutBall.x < b.x + b.w && breakoutBall.y > b.y && breakoutBall.y < b.y + b.h) {
            b.alive = false;
            breakoutBall.dy *= -1;
            score += 10;
            playSound('match');
            updateScoreDisplay();
        }
        if (b.alive) allDead = false;
    });
    
    if (allDead) {
        score += 100;
        playSound('win');
        setTimeout(() => showWinModal('🎉 Victory!', 'All bricks destroyed!', 
            `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, true), 500);
        return;
    }
    
    drawBreakout();
}

function drawBreakout() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, 600, 450);
    
    breakoutBricks.forEach(b => {
        if (b.alive) {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(b.x, b.y, b.w, 4);
        }
    });
    
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(breakoutPaddle, 385, 100, 12);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(breakoutPaddle + 5, 385, 90, 4);
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(breakoutBall.x, breakoutBall.y, 8, 0, Math.PI * 2);
    ctx.fill();
}

// ==================== TETRIS ====================
const tetrisShapes = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[1,1,1],[0,1,0]],
    [[1,1,1],[1,0,0]],
    [[1,1,1],[0,0,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]]
];
const tetrisColors = ['#06b6d4', '#fbbf24', '#a855f7', '#22c55e', '#ef4444', '#f97316', '#3b82f6'];

function initTetrisGame() {
    tetrisBoard = Array(20).fill(null).map(() => Array(10).fill(0));
    tetrisScore = 0;
    score = 0;
    updateScoreDisplay();
    spawnTetrisPiece();
    
    if (gameLoop) clearInterval(gameLoop);
    const speeds = {easy: 300, medium: 200, hard: 120};
    gameLoop = setInterval(updateTetris, speeds[difficulty]);
    drawTetris();
}

function spawnTetrisPiece() {
    const i = Math.floor(Math.random() * tetrisShapes.length);
    tetromino = {
        x: 4,
        y: 0,
        shape: tetrisShapes[i],
        color: tetrisColors[i]
    };
    
    if (!canMoveTetris(tetromino.x, tetromino.y, tetromino.shape)) {
        playSound('lose');
        setTimeout(() => showWinModal('💀 Game Over', 'No space left!', 
            `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, false, pongPlayerScore), 100);
    }
}

function canMoveTetris(x, y, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const nx = x + c, ny = y + r;
                if (nx < 0 || nx >= 10 || ny >= 20 || (ny >= 0 && tetrisBoard[ny][nx])) return false;
            }
        }
    }
    return true;
}

function updateTetris() {
    if (canMoveTetris(tetromino.x, tetromino.y + 1, tetromino.shape)) {
        tetromino.y++;
    } else {
        tetromino.shape.forEach((row, r) => {
            row.forEach((v, c) => {
                if (v) {
                    const y = tetromino.y + r;
                    if (y >= 0) tetrisBoard[y][tetromino.x + c] = tetromino.color;
                }
            });
        });
        
        for (let r = 19; r >= 0; r--) {
            if (tetrisBoard[r].every(c => c)) {
                tetrisBoard.splice(r, 1);
                tetrisBoard.unshift(Array(10).fill(0));
                score += 100;
                r++;
            }
        }
        
        spawnTetrisPiece();
    }
    updateScoreDisplay();
    drawTetris();
}

function drawTetris() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, 600, 450);
    
    ctx.strokeStyle = '#1a1a2e';
    for (let c = 0; c <= 10; c++) {
        ctx.beginPath();
        ctx.moveTo(c * 30, 0);
        ctx.lineTo(c * 30, 450);
        ctx.stroke();
    }
    for (let r = 0; r <= 20; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * 22.5);
        ctx.lineTo(300, r * 22.5);
        ctx.stroke();
    }
    
    for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 10; c++) {
            if (tetrisBoard[r][c]) {
                ctx.fillStyle = tetrisBoard[r][c];
                ctx.fillRect(c * 30 + 1, r * 22.5 + 1, 28, 21);
            }
        }
    }
    
    if (tetromino) {
        ctx.fillStyle = tetromino.color;
        tetromino.shape.forEach((row, r) => {
            row.forEach((v, c) => {
                if (v) {
                    ctx.fillRect((tetromino.x + c) * 30 + 1, (tetromino.y + r) * 22.5 + 1, 28, 21);
                }
            });
        });
    }
}

// ==================== RACING GAME ====================
function initRacingGame() {
    racingCar = {x: 250};
    racingObst = [];
    racingDist = 0;
    racingSpeed = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    score = 0;
    updateScoreDisplay();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateRacing, 30);
    drawRacing();
}

function updateRacing() {
    racingDist += racingSpeed * 0.1;
    racingSpeed += 0.005;
    
    if (Math.random() < (difficulty === 'easy' ? 0.02 : difficulty === 'medium' ? 0.03 : 0.05)) {
        racingObst.push({
            x: Math.random() * 200 + 150,
            y: -50,
            type: Math.random() > 0.5 ? 'car' : 'oil'
        });
    }
    
    racingObst.forEach(o => o.y += racingSpeed);
    racingObst = racingObst.filter(o => o.y < 500);
    
    for (let o of racingObst) {
        if (Math.abs(o.x - racingCar.x) < 35 && Math.abs(o.y - 350) < 40) {
            playSound('lose');
            setTimeout(() => showWinModal('💀 Crash!', 'You hit an obstacle!', 
                `<div class="final-stat"><span class="final-stat-label">Distance</span><span class="final-stat-value">${Math.floor(racingDist)}m</span></div>`, false, pongPlayerScore), 100);
            return;
        }
    }
    
    score = Math.floor(racingDist);
    updateScoreDisplay();
    drawRacing();
}

function drawRacing() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#374151';
    ctx.fillRect(100, 0, 400, 450);
    
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([30, 30]);
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(175 + i * 50, 0);
        ctx.lineTo(175 + i * 50, 450);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(100, 0, 8, 450);
    ctx.fillRect(492, 0, 8, 450);
    
    racingObst.forEach(o => {
        if (o.type === 'car') {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(o.x - 20, o.y, 40, 30);
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(o.x - 15, o.y + 5, 30, 10);
        } else {
            ctx.fillStyle = '#1f2937';
            ctx.beginPath();
            ctx.ellipse(o.x, o.y + 15, 20, 10, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(racingCar.x - 20, 350, 40, 50);
    ctx.fillStyle = '#059669';
    ctx.fillRect(racingCar.x - 15, 360, 30, 15);
    ctx.fillStyle = '#6ee7b7';
    ctx.fillRect(racingCar.x - 10, 375, 20, 10);
    ctx.fillStyle = '#000';
    ctx.fillRect(racingCar.x - 25, 355, 8, 15);
    ctx.fillRect(racingCar.x + 17, 355, 8, 15);
    ctx.fillRect(racingCar.x - 25, 380, 8, 15);
    ctx.fillRect(racingCar.x + 17, 380, 8, 15);
}

// ==================== SHOOTER GAME ====================
function initShooterGame() {
    shooterX = 250;
    shooterBullets = [];
    shooterEnemies = [];
    score = 0;
    updateScoreDisplay();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateShooter, 25);
    drawShooter();
}

function updateShooter() {
    shooterBullets.forEach(b => b.y -= 10);
    shooterBullets = shooterBullets.filter(b => b.y > -20);
    
    if (Math.random() < (difficulty === 'easy' ? 0.02 : difficulty === 'medium' ? 0.03 : 0.05)) {
        shooterEnemies.push({
            x: Math.random() * 520 + 40,
            y: -30,
            hp: difficulty === 'hard' ? 2 : 1
        });
    }
    
    shooterEnemies.forEach(e => e.y += difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4);
    shooterEnemies = shooterEnemies.filter(e => e.y < 480);
    
    shooterBullets.forEach((b, bi) => {
        shooterEnemies.forEach((e, ei) => {
            if (Math.abs(b.x - e.x) < 25 && Math.abs(b.y - e.y) < 20) {
                e.hp--;
                shooterBullets.splice(bi, 1);
                if (e.hp <= 0) {
                    shooterEnemies.splice(ei, 1);
                    score += 10;
                    playSound('match');
                    updateScoreDisplay();
                }
            }
        });
    });
    
    for (let e of shooterEnemies) {
        if (e.y > 380 && Math.abs(e.x - shooterX) < 30) {
            playSound('lose');
            setTimeout(() => showWinModal('💀 Game Over', 'Enemy reached you!', 
                `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, false, pongPlayerScore), 100);
            return;
        }
    }
    
    drawShooter();
}

function drawShooter() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, 600, 450);
    
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 137) % 600;
        const y = (i * 89 + Date.now() / 50) % 450;
        ctx.fillRect(x, y, 2, 2);
    }
    
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(shooterX, 360);
    ctx.lineTo(shooterX - 25, 420);
    ctx.lineTo(shooterX + 25, 420);
    ctx.fill();
    
    ctx.fillStyle = '#fbbf24';
    shooterBullets.forEach(b => {
        ctx.fillRect(b.x - 3, b.y, 6, 15);
    });
    
    shooterEnemies.forEach(e => {
        ctx.fillStyle = e.hp > 1 ? '#ef4444' : '#f97316';
        ctx.beginPath();
        ctx.moveTo(e.x, e.y + 20);
        ctx.lineTo(e.x - 20, e.y - 10);
        ctx.lineTo(e.x + 20, e.y - 10);
        ctx.fill();
    });
}

// ==================== CHESS GAME ====================
const chessPieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

function initChessGame() {
    chessBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    chessTurn = 'white';
    chessSelected = null;
    chessGameMode = tttMode === 'ai' ? 'ai' : 'pvp';
    score = 0;
    updateScoreDisplay();
    renderChessBoard();
}

function renderChessBoard() {
    const board = document.getElementById('gameBoard');
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(8, 1fr)';
    board.innerHTML = '';
    board.style.width = '400px';
    board.style.gap = '0';
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            const isLight = (r + c) % 2 === 0;
            cell.className = 'chess-cell ' + (isLight ? 'light' : 'dark');
            if (chessSelected && chessSelected[0] === r && chessSelected[1] === c) {
                cell.classList.add('selected');
            }
            cell.textContent = chessBoard[r][c] ? chessPieces[chessBoard[r][c]] : '';
            cell.onclick = () => handleChessClick(r, c);
            board.appendChild(cell);
        }
    }
}

function handleChessClick(r, c) {
    if (chessSelected) {
        const fromR = chessSelected[0];
        const fromC = chessSelected[1];
        const piece = chessBoard[fromR][fromC];
        
        if (isValidMove(fromR, fromC, r, c, piece)) {
            chessBoard[r][c] = piece;
            chessBoard[fromR][fromC] = '';
            chessTurn = chessTurn === 'white' ? 'black' : 'white';
            playSound('flip');
            
            // Check for king capture
            if (!chessBoard.flat().includes('k') || !chessBoard.flat().includes('K')) {
                playSound('win');
                setTimeout(() => showWinModal('🎉 Checkmate!', chessTurn === 'black' ? 'White wins!' : 'Black wins!', '', true), 500);
            }
            
            // AI move if in AI mode
            if (chessGameMode === 'ai' && chessTurn === 'black') {
                setTimeout(aiChessMove, 500);
            }
        }
        chessSelected = null;
    } else if (chessBoard[r][c]) {
        const piece = chessBoard[r][c];
        const isWhite = piece === piece.toUpperCase();
        if ((chessTurn === 'white' && isWhite) || (chessTurn === 'black' && !isWhite)) {
            chessSelected = [r, c];
            playSound('flip');
        }
    }
    renderChessBoard();
}

function aiChessMove() {
    // Get all black pieces
    const blackPieces = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (chessBoard[r][c] && chessBoard[r][c] === chessBoard[r][c].toLowerCase()) {
                blackPieces.push({r, c, piece: chessBoard[r][c]});
            }
        }
    }
    
    if (blackPieces.length === 0) return;
    
    // Try to capture white pieces or move randomly
    const whitePieces = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (chessBoard[r][c] && chessBoard[r][c] === chessBoard[r][c].toUpperCase()) {
                whitePieces.push({r, c});
            }
        }
    }
    
    // Try to capture
    for (let bp of blackPieces) {
        for (let wp of whitePieces) {
            if (isValidMove(bp.r, bp.c, wp.r, wp.c, bp.piece)) {
                chessBoard[wp.r][wp.c] = bp.piece;
                chessBoard[bp.r][bp.c] = '';
                chessTurn = 'white';
                playSound('flip');
                renderChessBoard();
                return;
            }
        }
    }
    
    // Random move
    const piece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(piece.r, piece.c, r, c, piece.piece)) {
                moves.push({r, c});
            }
        }
    }
    
    if (moves.length > 0) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        chessBoard[move.r][move.c] = piece.piece;
        chessBoard[piece.r][piece.c] = '';
        chessTurn = 'white';
        playSound('flip');
    }
    
    renderChessBoard();
}

function isValidMove(fromR, fromC, toR, toC, piece) {
    if (toR === fromR && toC === fromC) return false;
    const isWhite = piece === piece.toUpperCase();
    const target = chessBoard[toR][toC];
    if (target) {
        const targetIsWhite = target === target.toUpperCase();
        if (isWhite === targetIsWhite) return false;
    }
    
    const type = piece.toLowerCase();
    const dr = Math.abs(toR - fromR);
    const dc = Math.abs(toC - fromC);
    
    switch(type) {
        case 'p': return (isWhite ? toR < fromR : toR > fromR) && (dc === 0 ? !target : dc === 1) && dr === 1;
        case 'r': return (dr === 0 || dc === 0) && isPathClear(fromR, fromC, toR, toC);
        case 'n': return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
        case 'b': return dr === dc && isPathClear(fromR, fromC, toR, toC);
        case 'q': return (dr === 0 || dc === 0 || dr === dc) && isPathClear(fromR, fromC, toR, toC);
        case 'k': return dr <= 1 && dc <= 1;
    }
    return true;
}

function isPathClear(fromR, fromC, toR, toC) {
    const dr = Math.sign(toR - fromR);
    const dc = Math.sign(toC - fromC);
    let r = fromR + dr;
    let c = fromC + dc;
    while (r !== toR || c !== toC) {
        if (chessBoard[r][c]) return false;
        r += dr;
        c += dc;
    }
    return true;
}

// ==================== SUDOKU GAME ====================
const sudokuSolution = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
];

function initSudokuGame() {
    sudokuBoard = [];
    const removeCount = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 40 : 50;
    
    for (let r = 0; r < 9; r++) {
        let row = [];
        for (let c = 0; c < 9; c++) {
            row.push(sudokuSolution[r][c]);
        }
        sudokuBoard.push(row);
    }
    
    let removed = 0;
    while (removed < removeCount) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);
        if (sudokuBoard[r][c] !== 0) {
            sudokuBoard[r][c] = 0;
            removed++;
        }
    }
    
    sudokuSelected = null;
    score = 0;
    updateScoreDisplay();
    renderSudokuBoard();
}

function renderSudokuBoard() {
    const board = document.getElementById('gameBoard');
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(9, 1fr)';
    board.innerHTML = '';
    board.style.width = '400px';
    board.style.gap = '0';
    
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            if (c % 3 === 0 && c > 0) cell.style.borderLeft = '3px solid #6366f1';
            if (r % 3 === 0 && r > 0) cell.style.borderTop = '3px solid #6366f1';
            if (sudokuBoard[r][c] !== 0) {
                cell.classList.add('filled');
                cell.textContent = sudokuBoard[r][c];
            }
            if (sudokuSelected && sudokuSelected[0] === r && sudokuSelected[1] === c) {
                cell.classList.add('selected');
            }
            cell.onclick = () => selectSudokuCell(r, c);
            board.appendChild(cell);
        }
    }
}

function selectSudokuCell(r, c) {
    if (sudokuBoard[r][c] === 0) {
        sudokuSelected = [r, c];
        renderSudokuBoard();
    }
}

function fillSudokuNumber(num) {
    if (!sudokuSelected) return;
    const [r, c] = sudokuSelected;
    
    if (num === sudokuSolution[r][c]) {
        sudokuBoard[r][c] = num;
        score += 10;
        playSound('match');
        updateScoreDisplay();
        
        if (sudokuBoard.flat().every(v => v !== 0)) {
            playSound('win');
            setTimeout(() => showWinModal('🎉 Sudoku Complete!', 'Great job!', 
                `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, true), 500);
        }
    } else {
        playSound('lose');
        const cells = document.querySelectorAll('.sudoku-cell');
        const idx = r * 9 + c;
        cells[idx].classList.add('error');
        setTimeout(() => cells[idx].classList.remove('error'), 500);
    }
    sudokuSelected = null;
    renderSudokuBoard();
}

// ==================== PLATFORMER GAME ====================
function initPlatformerGame() {
    platformerPlayer = {x: 50, y: 350, vx: 0, vy: 0, grounded: false};
    platformerPlatforms = [
        {x: 0, y: 420, w: 600, h: 30},
        {x: 100, y: 340, w: 120, h: 15},
        {x: 280, y: 280, w: 120, h: 15},
        {x: 450, y: 220, w: 120, h: 15},
        {x: 200, y: 180, w: 100, h: 15},
        {x: 50, y: 120, w: 80, h: 15}
    ];
    platformerCoins = [
        {x: 160, y: 310, collected: false},
        {x: 340, y: 250, collected: false},
        {x: 510, y: 190, collected: false},
        {x: 250, y: 150, collected: false},
        {x: 90, y: 90, collected: false}
    ];
    score = 0;
    updateScoreDisplay();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updatePlatformer, 20);
    drawPlatformer();
}

function updatePlatformer() {
    const gravity = 0.6;
    const speed = 5;
    
    platformerPlayer.vy += gravity;
    platformerPlayer.x += platformerPlayer.vx;
    platformerPlayer.y += platformerPlayer.vy;
    platformerPlayer.vx *= 0.8;
    
    platformerPlayer.grounded = false;
    platformerPlatforms.forEach(p => {
        if (platformerPlayer.x + 20 > p.x && platformerPlayer.x < p.x + p.w &&
            platformerPlayer.y + 30 > p.y && platformerPlayer.y + 30 < p.y + p.h + 10 &&
            platformerPlayer.vy > 0) {
            platformerPlayer.y = p.y - 30;
            platformerPlayer.vy = 0;
            platformerPlayer.grounded = true;
        }
    });
    
    platformerCoins.forEach(c => {
        if (!c.collected && Math.abs(platformerPlayer.x + 10 - c.x) < 25 && Math.abs(platformerPlayer.y + 15 - c.y) < 25) {
            c.collected = true;
            score += 10;
            playSound('match');
            updateScoreDisplay();
        }
    });
    
    if (platformerPlayer.y > 450) {
        playSound('lose');
        setTimeout(() => showWinModal('💀 Game Over', 'You fell!', 
            `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, false, pongPlayerScore), 100);
        return;
    }
    
    if (platformerCoins.every(c => c.collected)) {
        playSound('win');
        setTimeout(() => showWinModal('🎉 Victory!', 'All coins collected!', 
            `<div class="final-stat"><span class="final-stat-label">Score</span><span class="final-stat-value">${score}</span></div>`, true), 500);
        return;
    }
    
    drawPlatformer();
}

function drawPlatformer() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, 600, 450);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#0a0a15');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 450);
    
    ctx.fillStyle = '#6366f1';
    platformerPlatforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(p.x, p.y, p.w, 4);
        ctx.fillStyle = '#6366f1';
    });
    
    platformerCoins.forEach(c => {
        if (!c.collected) {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(c.x, c.y, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(c.x - 3, c.y - 3, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(platformerPlayer.x, platformerPlayer.y, 20, 30);
    ctx.fillStyle = '#6ee7b7';
    ctx.fillRect(platformerPlayer.x + 3, platformerPlayer.y + 3, 6, 6);
    ctx.fillRect(platformerPlayer.x + 11, platformerPlayer.y + 3, 6, 6);
}

// ==================== UTILITY FUNCTIONS ====================
function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
}

function showWinModal(title, subtitle, stats, isNewBest, finalScore) {
    if (finalScore === undefined) finalScore = score;
    
    setTimeout(() => checkDailyChallenge(currentGame, finalScore), 500);
    document.getElementById('winTitle').textContent = title;
    document.getElementById('winSubtitle').textContent = subtitle;
    document.getElementById('finalStats').innerHTML = stats || '';
    document.getElementById('newBest').style.display = isNewBest ? 'inline-block' : 'none';
    document.getElementById('winModal').classList.add('active');
    gameRunning = false;
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
}

// ==================== KEYBOARD CONTROLS ====================
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    // Prevent page scrolling for game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    
    switch(currentGame) {
        case 'snake':
            if (e.key === 'ArrowUp' && dir.y !== 1) nextDir = {x: 0, y: -1};
            if (e.key === 'ArrowDown' && dir.y !== -1) nextDir = {x: 0, y: 1};
            if (e.key === 'ArrowLeft' && dir.x !== 1) nextDir = {x: -1, y: 0};
            if (e.key === 'ArrowRight' && dir.x !== -1) nextDir = {x: 1, y: 0};
            break;
        case 'flappy':
            if (e.key === ' ' || e.key === 'ArrowUp') {
                flappyBird.velocity = -8;
            }
            break;
        case 'tetris':
            if (e.key === 'ArrowLeft' && canMoveTetris(tetromino.x - 1, tetromino.y, tetromino.shape)) tetromino.x--;
            if (e.key === 'ArrowRight' && canMoveTetris(tetromino.x + 1, tetromino.y, tetromino.shape)) tetromino.x++;
            if (e.key === 'ArrowDown') {
                if (canMoveTetris(tetromino.x, tetromino.y + 1, tetromino.shape)) tetromino.y++;
            }
            if (e.key === 'ArrowUp') {
                const rotated = tetromino.shape[0].map((_, i) => tetromino.shape.map(r => r[i]).reverse());
                if (canMoveTetris(tetromino.x, tetromino.y, rotated)) tetromino.shape = rotated;
            }
            drawTetris();
            break;
        case 'racing':
            if (e.key === 'ArrowLeft') racingCar.x = Math.max(120, racingCar.x - 15);
            if (e.key === 'ArrowRight') racingCar.x = Math.min(480, racingCar.x + 15);
            break;
        case 'shooter':
            if (e.key === 'ArrowLeft') shooterX = Math.max(30, shooterX - 15);
            if (e.key === 'ArrowRight') shooterX = Math.min(570, shooterX + 15);
            if (e.key === ' ') shooterBullets.push({x: shooterX, y: 360});
            break;
        case 'platformer':
            if (e.key === 'ArrowLeft') platformerPlayer.vx = -5;
            if (e.key === 'ArrowRight') platformerPlayer.vx = 5;
            if ((e.key === ' ' || e.key === 'ArrowUp') && platformerPlayer.grounded) platformerPlayer.vy = -12;
            break;
        case 'sudoku':
            if (sudokuSelected && e.key >= '1' && e.key <= '9') {
                fillSudokuNumber(parseInt(e.key));
            }
            break;
    }
});

// Mouse controls for pong and breakout - relative movement
let lastMouseX = null;
document.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    if (currentGame === 'pong') {
        // Relative movement
        if (lastMouseX !== null) {
            const delta = x - lastMouseX;
            pongPaddle = Math.max(0, Math.min(370, pongPaddle + delta));
        }
        lastMouseX = x;
    }
    if (currentGame === 'breakout') {
        if (lastMouseX !== null) {
            const delta = x - lastMouseX;
            breakoutPaddle = Math.max(0, Math.min(500, breakoutPaddle + delta));
        }
        lastMouseX = x;
    }
});

document.addEventListener('mouseup', () => {
    lastMouseX = null;
});

document.addEventListener('click', (e) => {
    if (!gameRunning) return;
    if (currentGame === 'flappy') {
        flappyBird.velocity = -8;
    }
});

// ==================== GAME SELECTOR ====================
const gameList = [
    { id: 'memory', name: 'Memory', icon: '🧠', desc: 'Match pairs' },
    { id: 'snake', name: 'Snake', icon: '🐍', desc: 'Eat food, grow' },
    { id: 'tictactoe', name: 'TicTacToe', icon: '⭕', desc: '3 in a row' },
    { id: 'pong', name: 'Pong', icon: '🏓', desc: 'Classic paddle' },
    { id: 'flappy', name: 'Flappy', icon: '🐦', desc: 'Avoid pipes' },
    { id: 'breakout', name: 'Breakout', icon: '🧱', desc: 'Break bricks' },
    { id: 'tetris', name: 'Tetris', icon: '🟦', desc: 'Stack blocks' },
    { id: 'racing', name: 'Racing', icon: '🏎️', desc: 'Dodge cars' },
    { id: 'shooter', name: 'Shooter', icon: '🔫', desc: 'Shoot enemies' },
    { id: 'chess', name: 'Chess', icon: '♟️', desc: 'Classic strategy' },
    { id: 'sudoku', name: 'Sudoku', icon: '🧩', desc: 'Number puzzle' },
    { id: 'platformer', name: 'Platformer', icon: '🏃', desc: 'Jump & collect' }
];

let selectedGame = 'memory';

function initGameSelector() {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    grid.innerHTML = gameList.map(g => `
        <div class="game-card ${g.id === selectedGame ? 'active' : ''}" data="${g.id}" onclick="pickGame('${g.id}')">
            <span class="icon">${g.icon}</span>
            <h3>${g.name}</h3>
            <p>${g.desc}</p>
        </div>
    `).join('');
}

function pickGame(id) {
    selectedGame = id;
    currentGame = id;
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`.game-card[data="${id}"]`)?.classList.add('active');
}

function showMenu() {
    gameRunning = false;
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    document.getElementById('menu').style.display = 'block';
    document.getElementById('gameArea').classList.remove('active');
    document.getElementById('winModal').classList.remove('active');
    document.getElementById('pauseModal').classList.remove('active');
}

function startGame() {
    initAudio();
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameArea').classList.add('active');
    
    const titles = {
        memory: 'Memory Match', snake: 'Snake', tictactoe: 'Tic Tac Toe',
        pong: 'Pong', flappy: 'Flappy Bird', breakout: 'Breakout',
        tetris: 'Tetris', racing: 'Car Racing', shooter: 'Space Shooter',
        chess: 'Chess', sudoku: 'Sudoku', platformer: 'Platformer'
    };
    document.getElementById('gameTitle').textContent = titles[selectedGame];
    
    const diffSel = document.getElementById('difficultySelector');
    const tttSel = document.getElementById('tttModeSelector');
    diffSel.style.display = 'none';
    tttSel.style.display = 'none';
    
    if (['snake', 'flappy', 'breakout', 'tetris', 'racing', 'shooter', 'platformer'].includes(selectedGame)) {
        diffSel.style.display = 'flex';
    }
    if (selectedGame === 'tictactoe' || selectedGame === 'chess') {
        tttSel.style.display = 'flex';
    }
    
    runCountdown(() => {
        loadGame(selectedGame);
    });
}

function loadGame(game) {
    currentGame = game;
    score = 0;
    updateScoreDisplay();
    gameRunning = true;
    
    const instructions = {
        memory: 'Click cards to find matching pairs',
        snake: 'Arrow keys to move - eat food to grow',
        tictactoe: tttMode === 'ai' ? 'Click to place X - vs AI' : 'Click to place X or O',
        pong: 'Mouse to move paddle left/right',
        flappy: 'Click or Space to jump',
        breakout: 'Mouse to move paddle',
        tetris: 'Arrow keys to move/rotate',
        racing: 'Arrow keys to steer',
        shooter: 'Arrow keys to move, Space to shoot',
        chess: tttMode === 'ai' ? 'Click piece then destination - vs AI' : 'Click piece then destination',
        sudoku: 'Click cell, then press 1-9',
        platformer: 'Arrow keys to move, Space to jump'
    };
    document.getElementById('instructions').textContent = instructions[game] || 'Use controls to play';
    
    const board = document.getElementById('gameBoard');
    board.innerHTML = '<canvas id="gameCanvas" width="600" height="450"></canvas>';
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    switch(game) {
        case 'memory': initMemoryGame(); break;
        case 'snake': initSnakeGame(); break;
        case 'tictactoe': initTicTacToe(); break;
        case 'pong': initPongGame(); break;
        case 'flappy': initFlappyGame(); break;
        case 'breakout': initBreakoutGame(); break;
        case 'tetris': initTetrisGame(); break;
        case 'racing': initRacingGame(); break;
        case 'shooter': initShooterGame(); break;
        case 'chess': initChessGame(); break;
        case 'sudoku': initSudokuGame(); break;
        case 'platformer': initPlatformerGame(); break;
    }
}

function restartGame() {
    document.getElementById('winModal').classList.remove('active');
    loadGame(selectedGame);
}

function setDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function setTTTMode(mode) {
    tttMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function showPauseModal() {
    document.getElementById('pauseModal').classList.add('active');
}

function resumeGame() {
    document.getElementById('pauseModal').classList.remove('active');
}

function showSettings() {
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('winModal').classList.contains('active')) {
            showMenu();
        } else if (document.getElementById('pauseModal').classList.contains('active')) {
            resumeGame();
        } else if (document.getElementById('settingsModal').classList.contains('active')) {
            closeSettings();
        } else if (gameRunning) {
            showPauseModal();
        }
    }
});

// ==================== DAILY CHALLENGE ====================
let dailyChallenge = null;

function getDailyChallenge() {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('gamehub_daily');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.date === today) return data.challenge;
    }
    
    const games = ['memory', 'snake', 'tictactoe', 'flappy', 'tetris', 'pong'];
    const targets = {
        memory: { min: 10, max: 20 },
        snake: { min: 20, max: 50 },
        tictactoe: { min: 1, max: 3 },
        flappy: { min: 5, max: 15 },
        tetris: { min: 100, max: 500 },
        pong: { min: 3, max: 5 }
    };
    
    const game = games[Math.floor(Math.random() * games.length)];
    const target = Math.floor(Math.random() * (targets[game].max - targets[game].min) + targets[game].min);
    
    dailyChallenge = {
        game: game,
        target: target,
        type: 'score',
        completed: false,
        reward: Math.floor(Math.random() * 100) + 50,
        date: today
    };
    
    localStorage.setItem('gamehub_daily', JSON.stringify({ date: today, challenge: dailyChallenge }));
    return dailyChallenge;
}

function showDailyChallenge() {
    dailyChallenge = getDailyChallenge();
    
    const gameNames = {
        memory: 'Memory Match',
        snake: 'Snake',
        tictactoe: 'Tic Tac Toe',
        flappy: 'Flappy Bird',
        tetris: 'Tetris',
        pong: 'Pong'
    };
    
    const gameIcons = {
        memory: '🧠',
        snake: '🐍',
        tictactoe: '⭕',
        flappy: '🐦',
        tetris: '🟦',
        pong: '🏓'
    };
    
    const targetLabel = dailyChallenge.game === 'pong' ? 'Wins' : 'Score';
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'dailyChallengeModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">🎯</div>
            <h2 class="modal-title">Daily Challenge</h2>
            <p class="modal-subtitle">${gameIcons[dailyChallenge.game]} ${gameNames[dailyChallenge.game]}</p>
            <div class="final-stats">
                <div class="final-stat">
                    <span class="final-stat-label">Target ${targetLabel}</span>
                    <span class="final-stat-value">${dailyChallenge.target}</span>
                </div>
                <div class="final-stat">
                    <span class="final-stat-label">Reward XP</span>
                    <span class="final-stat-value">+${dailyChallenge.reward}</span>
                </div>
            </div>
            ${dailyChallenge.completed ? '<div class="new-best">✅ Completed!</div>' : ''}
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="startDailyChallenge()">Start Challenge</button>
                <button class="modal-btn secondary" onclick="closeDailyChallenge()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeDailyChallenge() {
    const modal = document.getElementById('dailyChallengeModal');
    if (modal) modal.remove();
}

function startDailyChallenge() {
    closeDailyChallenge();
    selectedGame = dailyChallenge.game;
    currentGame = dailyChallenge.game;
    
    // Reset score tracking for the challenge
    challengeStartScore = 0;
    if (dailyChallenge.game === 'pong') {
        challengeStartScore = pongPlayerScore;
    }
    
    showMenu();
    pickGame(dailyChallenge.game);
    startGame();
}

// Track score for daily challenge
let challengeStartScore = 0;

function checkDailyChallenge(game, finalScore) {
    if (!dailyChallenge || dailyChallenge.completed || dailyChallenge.game !== game) return;
    
    let achieved = false;
    if (game === 'pong') {
        achieved = finalScore >= dailyChallenge.target;
    } else {
        achieved = finalScore >= dailyChallenge.target;
    }
    
    if (achieved) {
        dailyChallenge.completed = true;
        localStorage.setItem('gamehub_daily', JSON.stringify({ 
            date: dailyChallenge.date, 
            challenge: dailyChallenge 
        }));
        
        // Show reward
        setTimeout(() => {
            showWinModal('🎉 Daily Challenge Complete!', `You earned ${dailyChallenge.reward} XP!`, 
                `<div class="final-stat"><span class="final-stat-label">Target</span><span class="final-stat-value">${dailyChallenge.target}</span></div>
                 <div class="final-stat"><span class="final-stat-label">Reward</span><span class="final-stat-value">+${dailyChallenge.reward} XP</span></div>`, true);
        }, 1000);
    }
}

// ==================== XP & LEVEL SYSTEM ====================
let playerXP = 0;
let playerLevel = 1;

function loadPlayerData() {
    const saved = localStorage.getItem('gamehub_player');
    if (saved) {
        const data = JSON.parse(saved);
        playerXP = data.xp || 0;
        playerLevel = data.level || 1;
    }
    updatePlayerDisplay();
}

function savePlayerData() {
    localStorage.setItem('gamehub_player', JSON.stringify({
        xp: playerXP,
        level: playerLevel
    }));
}

function addXP(amount) {
    playerXP += amount;
    const xpNeeded = playerLevel * 100;
    
    while (playerXP >= xpNeeded) {
        playerXP -= xpNeeded;
        playerLevel++;
    }
    
    savePlayerData();
    updatePlayerDisplay();
}

function updatePlayerDisplay() {
    const profile = document.getElementById('playerProfile');
    if (profile) {
        const xpNeeded = playerLevel * 100;
        const xpPercent = (playerXP / xpNeeded) * 100;
        
        profile.innerHTML = `
            <div class="profile-avatar">${playerLevel}</div>
            <div class="profile-info">
                <span class="profile-name">Level ${playerLevel}</span>
                <span class="profile-level">${playerXP}/${xpNeeded} XP</span>
                <div class="xp-bar"><div class="xp-fill" style="width: ${xpPercent}%"></div></div>
            </div>
        `;
    }
}

// Add XP when winning games
const originalShowWinModal = showWinModal;
showWinModal = function(title, subtitle, stats, isNewBest, finalScore) {
    originalShowWinModal(title, subtitle, stats, isNewBest, finalScore);
    
    // Add XP for winning
    if (isNewBest && title.includes('Win') || title.includes('Victory') || title.includes('Complete')) {
        const xpGain = 20 + (playerLevel * 5);
        setTimeout(() => {
            addXP(xpGain);
        }, 1000);
    }
};

// Initialize player data on load
window.onload = function() {
    loadPlayerData();
    initGameSelector();
};
