// ==================== JUNGLE SMASH - ADVANCED GAME ENGINE ====================

// Game Configuration
const CONFIG = {
    GAME_DURATION: 90,
    INITIAL_HEALTH: 100,
    COMBO_TIMEOUT: 1500,
    SPAWN_INTERVAL_BASE: 1200,
    POWERUP_SPAWN_CHANCE: 0.06,
    BOSS_SPAWN_TIME: 60,
    MAX_INSECTS: 12,
    DAMAGE_PER_HIT: 10,
    INSECT_ATTACK_INTERVAL: 2000,
};

// Level Configuration
const LEVELS = {
    1: {
        name: "🌿 FOREST EDGE",
        duration: 30,
        insectTypes: ['mosquito', 'fly', 'ant'],
        spawnRate: 1500,
        insectDamage: 5,
        boss: null,
        bgGradient: 'linear-gradient(180deg, #0d1a0d 0%, #1a2f1a 50%, #0a1a0a 100%)',
    },
    2: {
        name: "🌳 DEEP JUNGLE",
        duration: 30,
        insectTypes: ['mosquito', 'fly', 'bee', 'wasp', 'beetle'],
        spawnRate: 1200,
        insectDamage: 8,
        boss: null,
        bgGradient: 'linear-gradient(180deg, #0a150a 0%, #1a2a1a 50%, #0a150a 100%)',
    },
    3: {
        name: "🐝 BEEHIVE ZONE",
        duration: 30,
        insectTypes: ['bee', 'wasp', 'hornet', 'spider', 'cockroach'],
        spawnRate: 1000,
        insectDamage: 10,
        boss: null,
        bgGradient: 'linear-gradient(180deg, #150a00 0%, #2a1a0a 50%, #150a00 100%)',
    },
    4: {
        name: "🕷️ SPIDER NEST",
        duration: 30,
        insectTypes: ['spider', 'scorpion', 'tarantula', 'centipede', 'beetle'],
        spawnRate: 900,
        insectDamage: 12,
        boss: null,
        bgGradient: 'linear-gradient(180deg, #0a0a15 0%, #1a1a2a 50%, #0a0a15 100%)',
    },
    5: {
        name: "👑 BOSS BATTLE",
        duration: 30,
        insectTypes: ['scorpion', 'tarantula', 'centipede'],
        spawnRate: 800,
        insectDamage: 15,
        boss: 'boss_queen',
        bgGradient: 'linear-gradient(180deg, #1a0000 0%, #2a0a0a 50%, #1a0000 100%)',
    },
};

// Insect Types
const INSECT_TYPES = {
    mosquito: { emoji: '🦟', name: 'Mosquito', speed: 3, points: 10, health: 1, size: 40, damage: 5 },
    fly: { emoji: '🪰', name: 'Fly', speed: 3.5, points: 15, health: 1, size: 35, damage: 5 },
    ant: { emoji: '🐜', name: 'Ant', speed: 2, points: 5, health: 1, size: 25, damage: 3 },
    bee: { emoji: '🐝', name: 'Bee', speed: 2.5, points: 20, health: 2, size: 45, damage: 8 },
    wasp: { emoji: '🐛', name: 'Wasp', speed: 3, points: 25, health: 2, size: 40, damage: 10 },
    beetle: { emoji: '🪲', name: 'Beetle', speed: 1.5, points: 35, health: 4, size: 55, damage: 8 },
    cockroach: { emoji: '🪳', name: 'Cockroach', speed: 2.5, points: 20, health: 2, size: 45, damage: 6 },
    dragonfly: { emoji: '🪰', name: 'Dragonfly', speed: 4.5, points: 40, health: 1, size: 40, damage: 12 },
    firefly: { emoji: '✨', name: 'Firefly', speed: 2, points: 50, health: 1, size: 35, damage: 15 },
    hornet: { emoji: '🐝', name: 'Hornet', speed: 3, points: 35, health: 3, size: 50, damage: 12 },
    centipede: { emoji: '🐛', name: 'Centipede', speed: 2, points: 45, health: 5, size: 60, damage: 10 },
    spider: { emoji: '🕷️', name: 'Spider', speed: 2, points: 30, health: 3, size: 50, damage: 10 },
    scorpion: { emoji: '🦂', name: 'Scorpion', speed: 1.5, points: 60, health: 6, size: 65, damage: 15 },
    tarantula: { emoji: '🕷️', name: 'Tarantula', speed: 1.2, points: 75, health: 8, size: 70, damage: 20 },
    boss_queen: { emoji: '👑', name: 'Queen', speed: 0.8, points: 500, health: 50, size: 120, damage: 30, isBoss: true },
    boss_king: { emoji: '👑', name: 'King', speed: 1, points: 750, health: 75, size: 130, damage: 35, isBoss: true },
    boss_colony: { emoji: '🏠', name: 'Colony', speed: 0.5, points: 1000, health: 100, size: 150, damage: 40, isBoss: true },
};

// Weapons
const WEAPONS = {
    slap: { emoji: '👋', name: 'SLAP', key: '1', damage: 1, cooldown: 100, color: '#ffaa77', effect: 'slap' },
    electric: { emoji: '⚡', name: 'SHOCK', key: '2', damage: 3, cooldown: 300, color: '#00ffff', effect: 'electric', area: true },
    water: { emoji: '💦', name: 'SPRAY', key: '3', damage: 2, cooldown: 200, color: '#4488ff', effect: 'water' },
    flyswat: { emoji: '🕸️', name: 'SWAT', key: '4', damage: 2, cooldown: 250, color: '#aaaaaa', effect: 'swat' },
    laser: { emoji: '🔴', name: 'LASER', key: '5', damage: 5, cooldown: 500, color: '#ff0000', effect: 'laser', area: true },
    flame: { emoji: '🔥', name: 'BURN', key: '6', damage: 4, cooldown: 400, color: '#ff4400', effect: 'fire', area: true },
    freeze: { emoji: '❄️', name: 'FREEZE', key: '7', damage: 3, cooldown: 350, color: '#88ddff', effect: 'ice', area: true },
    smash: { emoji: '💥', name: 'SMASH', key: '8', damage: 10, cooldown: 800, color: '#ff00ff', effect: 'smash', area: true },
};

// Power-ups
const POWERUPS = {
    health: { emoji: '❤️', name: 'Health', effect: 'heal', value: 30 },
    shield: { emoji: '🛡️', name: 'Shield', effect: 'shield', value: 5000 },
    multiplier: { emoji: '✖️', name: '2x Points', effect: 'multiplier', value: 10000 },
    slow: { emoji: '🐌', name: 'Slow', effect: 'slow', value: 5000 },
    nuke: { emoji: '☢️', name: 'Nuke', effect: 'nuke', value: 1 },
    triple: { emoji: '🎯', name: 'Triple', effect: 'triple', value: 8000 },
};

// Game State
let gameState = {
    running: false,
    paused: false,
    score: 0,
    combo: 1,
    streak: 0,
    bestCombo: 1,
    maxStreak: 0,
    kills: 0,
    health: CONFIG.INITIAL_HEALTH,
    timeLeft: CONFIG.GAME_DURATION,
    currentLevel: 1,
    levelTimeLeft: 30,
    currentWeapon: 'slap',
    powerups: [],
    activePowerup: null,
    insects: [],
    lastHitTime: 0,
    lastSpawnTime: 0,
    spawnInterval: CONFIG.SPAWN_INTERVAL_BASE,
    bossSpawned: false,
    shieldActive: false,
    highScore: parseInt(localStorage.getItem('jungleSmashHighScore')) || 0,
};

// Audio Engine
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    play(type) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        
        switch(type) {
            case 'slap': this.playSlap(now); break;
            case 'electric': this.playElectric(now); break;
            case 'water': this.playWater(now); break;
            case 'swat': this.playSwat(now); break;
            case 'laser': this.playLaser(now); break;
            case 'fire': this.playFire(now); break;
            case 'ice': this.playIce(now); break;
            case 'smash': this.playSmash(now); break;
            case 'hit': this.playHit(now); break;
            case 'combo': this.playCombo(now); break;
            case 'powerup': this.playPowerup(now); break;
            case 'boss': this.playBoss(now); break;
            case 'gameover': this.playGameOver(now); break;
            case 'nuke': this.playNuke(now); break;
            case 'damage': this.playDamage(now); break;
            case 'levelup': this.playLevelUp(now); break;
        }
    }
    
    playSlap(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
    
    playElectric(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
    
    playWater(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    }
    
    playSwat(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
    }
    
    playLaser(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    }
    
    playFire(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
    
    playIce(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
    
    playSmash(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
    
    playHit(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
    
    playCombo(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.1);
        osc.frequency.setValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
    
    playPowerup(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
    
    playBoss(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.setValueAtTime(150, now + 0.2);
        osc.frequency.setValueAtTime(100, now + 0.4);
        osc.frequency.setValueAtTime(200, now + 0.6);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
    }
    
    playGameOver(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 1);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
        osc.start(now);
        osc.stop(now + 1);
    }
    
    playNuke(now) {
        for (let i = 0; i < 5; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200 - i * 30, now + i * 0.1);
            gain.gain.setValueAtTime(0.5 - i * 0.1, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
        }
    }
    
    playDamage(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    }
    
    playLevelUp(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.15);
        osc.frequency.setValueAtTime(800, now + 0.3);
        osc.frequency.setValueAtTime(1000, now + 0.45);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
    }
}

const audio = new AudioEngine();

// DOM Elements
const elements = {};

// Initialize Game
function init() {
    cacheElements();
    createWeaponBar();
    createCreatureShowcase();
    setupEventListeners();
    updateUI();
}

function cacheElements() {
    elements.gameContainer = document.getElementById('game-container');
    elements.score = document.getElementById('score');
    elements.combo = document.getElementById('combo');
    elements.streak = document.getElementById('streak');
    elements.time = document.getElementById('time');
    elements.timerRing = document.getElementById('timer-ring');
    elements.healthFill = document.getElementById('health-fill');
    elements.health = document.getElementById('health');
    elements.healthContainer = document.getElementById('health-container');
    elements.bossWarning = document.getElementById('boss-warning');
    elements.startScreen = document.getElementById('start-screen');
    elements.howtoScreen = document.getElementById('howto-screen');
    elements.gameoverScreen = document.getElementById('gameover-screen');
    elements.pauseScreen = document.getElementById('pause-screen');
    elements.powerupBar = document.getElementById('powerup-bar');
    elements.particles = document.getElementById('particles');
    elements.damageNumbers = document.getElementById('damage-numbers');
    elements.comboPanel = document.getElementById('combo-panel');
    elements.finalScore = document.getElementById('final-score');
    elements.finalKills = document.getElementById('final-kills');
    elements.finalCombo = document.getElementById('final-combo');
    elements.finalStreak = document.getElementById('final-streak');
    elements.newHighscore = document.getElementById('new-highscore');
    elements.gameoverTitle = document.getElementById('gameover-title');
    elements.levelDisplay = document.getElementById('level-display');
    elements.levelName = document.getElementById('level-name');
}

function createWeaponBar() {
    const weaponBar = document.getElementById('weapon-bar');
    weaponBar.innerHTML = '';
    
    Object.entries(WEAPONS).forEach(([key, weapon]) => {
        const slot = document.createElement('div');
        slot.className = 'weapon-slot' + (key === gameState.currentWeapon ? ' active' : '');
        slot.dataset.weapon = key;
        slot.innerHTML = `
            <span class="weapon-emoji">${weapon.emoji}</span>
            <span class="weapon-key">${weapon.key}</span>
            <span class="weapon-name">${weapon.name}</span>
        `;
        slot.addEventListener('click', () => selectWeapon(key));
        weaponBar.appendChild(slot);
    });
}

function createCreatureShowcase() {
    const showcase = document.getElementById('creature-showcase');
    const creatures = ['mosquito', 'bee', 'spider', 'scorpion', 'tarantula'];
    
    creatures.forEach(type => {
        const insect = INSECT_TYPES[type];
        const div = document.createElement('div');
        div.className = 'showcase-creature';
        div.innerHTML = `
            <span class="creature-emoji">${insect.emoji}</span>
            <span class="creature-name">${insect.name}</span>
        `;
        showcase.appendChild(div);
    });
}

function setupEventListeners() {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', startGame);
    document.getElementById('howto-btn').addEventListener('click', showHowto);
    document.getElementById('back-btn').addEventListener('click', hideHowto);
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', e => e.preventDefault());
}

function handleKeyDown(e) {
    if (!gameState.running || gameState.paused) {
        if (e.key === 'Escape' && gameState.running) {
            togglePause();
        }
        return;
    }
    
    const key = e.key.toLowerCase();
    Object.entries(WEAPONS).forEach(([weaponKey, weapon]) => {
        if (weapon.key === key) {
            selectWeapon(weaponKey);
        }
    });
    
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        activatePowerup();
    }
}

function handleClick(e) {
    if (!gameState.running || gameState.paused) return;
    if (e.target.closest('.weapon-slot') || e.target.closest('.powerup-slot')) return;
    
    const weapon = WEAPONS[gameState.currentWeapon];
    const x = e.clientX;
    const y = e.clientY;
    
    createWeaponEffect(x, y, weapon.effect);
    audio.play(weapon.effect);
    
    const hitInsects = checkHits(x, y, weapon);
    
    if (hitInsects.length > 0) {
        hitInsects.forEach(insect => damageInsect(insect, weapon.damage));
    } else {
        resetCombo();
    }
}

function selectWeapon(weaponKey) {
    gameState.currentWeapon = weaponKey;
    document.querySelectorAll('.weapon-slot').forEach(slot => {
        slot.classList.toggle('active', slot.dataset.weapon === weaponKey);
    });
}

function startGame() {
    audio.init();
    
    gameState = {
        ...gameState,
        running: true,
        paused: false,
        score: 0,
        combo: 1,
        streak: 0,
        bestCombo: 1,
        maxStreak: 0,
        kills: 0,
        health: CONFIG.INITIAL_HEALTH,
        timeLeft: CONFIG.GAME_DURATION,
        currentLevel: 1,
        levelTimeLeft: 30,
        powerups: [],
        activePowerup: null,
        insects: [],
        lastHitTime: 0,
        lastSpawnTime: Date.now(),
        spawnInterval: LEVELS[1].spawnRate,
        bossSpawned: false,
        shieldActive: false,
    };
    
    document.querySelectorAll('.insect').forEach(el => el.remove());
    document.querySelectorAll('.powerup-item').forEach(el => el.remove());
    
    elements.startScreen.classList.add('hidden');
    elements.howtoScreen.classList.add('hidden');
    elements.gameoverScreen.classList.add('hidden');
    elements.pauseScreen.classList.add('hidden');
    
    updateUI();
    updatePowerupBar();
    updateLevelDisplay();
    updateBackground();
    
    requestAnimationFrame(gameLoop);
    startTimer();
    startInsectAttacks();
}

let insectAttackInterval;

function startInsectAttacks() {
    if (insectAttackInterval) clearInterval(insectAttackInterval);
    
    insectAttackInterval = setInterval(() => {
        if (!gameState.running || gameState.paused) return;
        
        // Random insect attacks player
        if (gameState.insects.length > 0 && Math.random() < 0.3) {
            const attacker = gameState.insects[Math.floor(Math.random() * gameState.insects.length)];
            if (attacker && !attacker.isBoss) {
                takeDamage(attacker.damage || LEVELS[gameState.currentLevel].insectDamage);
            }
        }
    }, CONFIG.INSECT_ATTACK_INTERVAL);
}

function takeDamage(amount) {
    if (gameState.shieldActive) {
        amount = Math.floor(amount * 0.2); // 80% damage reduction
    }
    
    gameState.health -= amount;
    audio.play('damage');
    
    // Screen flash red
    elements.gameContainer.style.background = 'rgba(255,0,0,0.3)';
    setTimeout(() => {
        elements.gameContainer.style.background = '';
    }, 100);
    
    // Screen shake
    elements.gameContainer.classList.add('screen-shake');
    setTimeout(() => elements.gameContainer.classList.remove('screen-shake'), 300);
    
    updateHealthUI();
    
    if (gameState.health <= 0) {
        endGame(false);
    }
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (!gameState.running || gameState.paused) {
            if (!gameState.running) {
                clearInterval(timerInterval);
            }
            return;
        }
        
        gameState.timeLeft--;
        gameState.levelTimeLeft--;
        
        // Level progression
        if (gameState.levelTimeLeft <= 0) {
            nextLevel();
        }
        
        updateTimerUI();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(true);
        }
    }, 1000);
}

function nextLevel() {
    gameState.currentLevel++;
    gameState.levelTimeLeft = LEVELS[gameState.currentLevel]?.duration || 30;
    
    if (gameState.currentLevel > 5) {
        // Game won - all levels complete
        endGame(true);
        return;
    }
    
    audio.play('levelup');
    updateLevelDisplay();
    updateBackground();
    
    // Clear existing insects for new level
    gameState.insects.forEach(insect => {
        if (insect.el) insect.el.remove();
    });
    gameState.insects = [];
    
    // Spawn boss for level 5
    if (gameState.currentLevel === 5) {
        setTimeout(() => spawnBoss(), 2000);
    }
}

function updateLevelDisplay() {
    const levelInfo = LEVELS[gameState.currentLevel];
    if (elements.levelName) {
        elements.levelName.textContent = levelInfo?.name || 'VICTORY!';
    }
}

function updateBackground() {
    const levelInfo = LEVELS[gameState.currentLevel];
    const bg = document.querySelector('.jungle-bg');
    if (bg && levelInfo) {
        bg.style.background = levelInfo.bgGradient;
    }
}

function gameLoop(timestamp) {
    if (!gameState.running || gameState.paused) return;
    
    const currentLevelData = LEVELS[gameState.currentLevel];
    gameState.spawnInterval = currentLevelData?.spawnRate || 800;
    
    if (Date.now() - gameState.lastSpawnTime > gameState.spawnInterval) {
        spawnInsect();
        gameState.lastSpawnTime = Date.now();
    }
    
    if (Math.random() < CONFIG.POWERUP_SPAWN_CHANCE / 10) {
        spawnPowerup();
    }
    
    updateInsects();
    
    if (Date.now() - gameState.lastHitTime > CONFIG.COMBO_TIMEOUT && gameState.combo > 1) {
        resetCombo();
    }
    
    requestAnimationFrame(gameLoop);
}

function spawnInsect() {
    if (gameState.insects.length >= CONFIG.MAX_INSECTS) return;
    
    const currentLevelData = LEVELS[gameState.currentLevel];
    const availableTypes = currentLevelData?.insectTypes || ['mosquito', 'fly', 'bee'];
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const insectData = INSECT_TYPES[type];
    
    const gameContainer = document.getElementById('game-container');
    const rect = gameContainer.getBoundingClientRect();
    
    const x = Math.random() * (rect.width - 100) + 50;
    const y = Math.random() * (rect.height - 200) + 150;
    
    const insect = {
        id: Date.now() + Math.random(),
        type: type,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * insectData.speed * 2,
        vy: (Math.random() - 0.5) * insectData.speed * 2,
        health: insectData.health,
        maxHealth: insectData.health,
        damage: insectData.damage,
        ...insectData,
    };
    
    const el = document.createElement('div');
    el.className = 'insect';
    el.dataset.id = insect.id;
    el.style.left = insect.x + 'px';
    el.style.top = insect.y + 'px';
    el.style.fontSize = insectData.size + 'px';
    el.innerHTML = `<span class="insect-emoji">${insectData.emoji}</span>`;
    
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        const weapon = WEAPONS[gameState.currentWeapon];
        damageInsect(insect, weapon.damage);
        createWeaponEffect(e.clientX, e.clientY, weapon.effect);
        audio.play(weapon.effect);
    });
    
    gameContainer.appendChild(el);
    insect.el = el;
    gameState.insects.push(insect);
}

function spawnBoss() {
    gameState.bossSpawned = true;
    
    elements.bossWarning.classList.add('active');
    audio.play('boss');
    
    setTimeout(() => {
        elements.bossWarning.classList.remove('active');
        
        const bossData = INSECT_TYPES.boss_queen;
        
        const gameContainer = document.getElementById('game-container');
        const rect = gameContainer.getBoundingClientRect();
        
        const x = rect.width / 2 - 60;
        const y = rect.height / 2 - 60;
        
        const boss = {
            id: Date.now(),
            type: 'boss_queen',
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            health: bossData.health,
            maxHealth: bossData.health,
            damage: bossData.damage,
            ...bossData,
        };
        
        const el = document.createElement('div');
        el.className = 'insect boss';
        el.dataset.id = boss.id;
        el.style.left = boss.x + 'px';
        el.style.top = boss.y + 'px';
        el.innerHTML = `<span class="insect-emoji">${bossData.emoji}</span>`;
        
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const weapon = WEAPONS[gameState.currentWeapon];
            damageInsect(boss, weapon.damage);
            createWeaponEffect(e.clientX, e.clientY, weapon.effect);
            audio.play(weapon.effect);
        });
        
        gameContainer.appendChild(el);
        boss.el = el;
        gameState.insects.push(boss);
        
        elements.gameContainer.classList.add('screen-shake');
        setTimeout(() => elements.gameContainer.classList.remove('screen-shake'), 500);
        
    }, 2000);
}

function spawnPowerup() {
    const types = Object.keys(POWERUPS);
    const type = types[Math.floor(Math.random() * types.length)];
    const powerupData = POWERUPS[type];
    
    const gameContainer = document.getElementById('game-container');
    const rect = gameContainer.getBoundingClientRect();
    
    const x = Math.random() * (rect.width - 100) + 50;
    const y = Math.random() * (rect.height - 200) + 150;
    
    const el = document.createElement('div');
    el.className = 'powerup-item';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.innerHTML = powerupData.emoji;
    el.title = powerupData.name;
    
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        collectPowerup(type, el);
    });
    
    gameContainer.appendChild(el);
}

function collectPowerup(type, el) {
    const powerupData = POWERUPS[type];
    gameState.powerups.push({ type, ...powerupData });
    audio.play('powerup');
    
    el.remove();
    updatePowerupBar();
    
    if (type === 'health') {
        applyPowerup(gameState.powerups.length - 1);
    }
}

function updatePowerupBar() {
    elements.powerupBar.innerHTML = '';
    
    gameState.powerups.forEach((powerup, index) => {
        const slot = document.createElement('div');
        slot.className = 'powerup-slot filled';
        slot.innerHTML = `
            ${powerup.emoji}
            <span class="key-hint">${index + 1}</span>
        `;
        slot.addEventListener('click', () => applyPowerup(index));
        elements.powerupBar.appendChild(slot);
    });
}

function applyPowerup(index) {
    const powerup = gameState.powerups[index];
    if (!powerup) return;
    
    gameState.activePowerup = powerup;
    audio.play('powerup');
    
    switch (powerup.effect) {
        case 'heal':
            gameState.health = Math.min(100, gameState.health + powerup.value);
            updateHealthUI();
            break;
        case 'shield':
            gameState.shieldActive = true;
            setTimeout(() => { 
                gameState.shieldActive = false; 
                gameState.activePowerup = null; 
            }, powerup.value);
            break;
        case 'multiplier':
            gameState.score += Math.floor(gameState.timeLeft * 10);
            setTimeout(() => { gameState.activePowerup = null; }, powerup.value);
            break;
        case 'slow':
            gameState.spawnInterval = 2000;
            setTimeout(() => { 
                gameState.activePowerup = null;
                gameState.spawnInterval = LEVELS[gameState.currentLevel].spawnRate;
            }, powerup.value);
            break;
        case 'nuke':
            gameState.insects.forEach(insect => {
                killInsect(insect, true);
            });
            audio.play('nuke');
            gameState.activePowerup = null;
            break;
        case 'triple':
            setTimeout(() => { gameState.activePowerup = null; }, powerup.value);
            break;
    }
    
    gameState.powerups.splice(index, 1);
    updatePowerupBar();
    updateUI();
}

function activatePowerup() {
    if (gameState.powerups.length > 0) {
        applyPowerup(0);
    }
}

function updateInsects() {
    const gameContainer = document.getElementById('game-container');
    const rect = gameContainer.getBoundingClientRect();
    
    gameState.insects.forEach(insect => {
        insect.x += insect.vx;
        insect.y += insect.vy;
        
        if (insect.x < 0 || insect.x > rect.width - 60) {
            insect.vx *= -1;
            insect.x = Math.max(0, Math.min(rect.width - 60, insect.x));
        }
        if (insect.y < 100 || insect.y > rect.height - 60) {
            insect.vy *= -1;
            insect.y = Math.max(100, Math.min(rect.height - 60, insect.y));
        }
        
        if (Math.random() < 0.02) {
            insect.vx += (Math.random() - 0.5) * insect.speed;
            insect.vy += (Math.random() - 0.5) * insect.speed;
        }
        
        if (insect.el) {
            insect.el.style.left = insect.x + 'px';
            insect.el.style.top = insect.y + 'px';
        }
        
        if (insect.isBoss) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            insect.vx = (centerX - insect.x) * 0.002;
            insect.vy = (centerY - insect.y) * 0.002;
        }
    });
}

function checkHits(x, y, weapon) {
    const hitRadius = weapon.area ? 80 : 40;
    const hitInsects = [];
    
    gameState.insects.forEach(insect => {
        const insectCenterX = insect.x + insect.size / 2;
        const insectCenterY = insect.y + insect.size / 2;
        const distance = Math.sqrt(Math.pow(x - insectCenterX, 2) + Math.pow(y - insectCenterY, 2));
        
        if (distance < hitRadius) {
            hitInsects.push(insect);
        }
    });
    
    return hitInsects;
}

function damageInsect(insect, damage) {
    if (gameState.activePowerup?.effect === 'triple') {
        damage *= 3;
    }
    
    insect.health -= damage;
    showDamageNumber(insect.x, insect.y, damage * gameState.combo, insect.health <= 0);
    
    if (insect.health <= 0) {
        killInsect(insect);
    } else {
        if (insect.el) {
            insect.el.classList.add('hit');
            setTimeout(() => insect.el?.classList.remove('hit'), 200);
        }
    }
}

function killInsect(insect, isNuke = false) {
    const now = Date.now();
    if (now - gameState.lastHitTime < CONFIG.COMBO_TIMEOUT) {
        gameState.combo = Math.min(10, gameState.combo + 1);
        gameState.streak++;
        audio.play('combo');
    }
    gameState.lastHitTime = now;
    
    let points = insect.points * gameState.combo;
    if (gameState.activePowerup?.effect === 'multiplier') {
        points *= 2;
    }
    
    gameState.score += points;
    gameState.kills++;
    gameState.maxStreak = Math.max(gameState.maxStreak, gameState.streak);
    gameState.bestCombo = Math.max(gameState.bestCombo, gameState.combo);
    
    createDeathParticles(insect.x, insect.y, isNuke ? '#ff0000' : '#00ff88');
    
    if (insect.el) {
        insect.el.classList.add('dying');
        setTimeout(() => insect.el?.remove(), 500);
    }
    
    gameState.insects = gameState.insects.filter(i => i.id !== insect.id);
    
    updateUI();
}

function resetCombo() {
    gameState.combo = 1;
    gameState.streak = 0;
    updateUI();
}

function createWeaponEffect(x, y, effectType) {
    const gameContainer = document.getElementById('game-container');
    const effect = document.createElement('div');
    effect.className = `weapon-effect ${effectType}-effect`;
    effect.style.left = (x - 50) + 'px';
    effect.style.top = (y - 50) + 'px';
    
    gameContainer.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
}

function createDeathParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = (Math.random() * 10 + 5) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        const angle = (Math.PI * 2 / 8) * i;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        });
        
        elements.particles.appendChild(particle);
        setTimeout(() => particle.remove(), 500);
    }
}

function showDamageNumber(x, y, damage, isKill) {
    const num = document.createElement('div');
    num.className = 'damage-number' + (isKill ? ' critical' : '') + (gameState.combo > 3 ? ' combo' : '');
    num.textContent = '+' + damage;
    num.style.left = x + 'px';
    num.style.top = y + 'px';
    
    elements.damageNumbers.appendChild(num);
    setTimeout(() => num.remove(), 1000);
}

function updateUI() {
    elements.score.textContent = gameState.score.toLocaleString();
    elements.combo.textContent = 'x' + gameState.combo;
    elements.streak.textContent = gameState.streak;
    
    elements.comboPanel.classList.toggle('active', gameState.combo > 1);
}

function updateTimerUI() {
    elements.time.textContent = gameState.timeLeft;
    
    const progress = (gameState.timeLeft / CONFIG.GAME_DURATION) * 283;
    elements.timerRing.style.strokeDashoffset = 283 - progress;
    elements.timerRing.classList.toggle('danger', gameState.timeLeft <= 10);
}

function updateHealthUI() {
    elements.health.textContent = Math.max(0, gameState.health);
    elements.healthFill.style.width = Math.max(0, gameState.health) + '%';
    
    // Health bar color changes
    if (gameState.health > 60) {
        elements.healthFill.style.background = 'linear-gradient(90deg, #00ff88 0%, #66ffaa 100%)';
    } else if (gameState.health > 30) {
        elements.healthFill.style.background = 'linear-gradient(90deg, #ffcc00 0%, #ffdd66 100%)';
    } else {
        elements.healthFill.style.background = 'linear-gradient(90deg, #ff3366 0%, #ff6699 100%)';
    }
}

function togglePause() {
    gameState.paused = !gameState.paused;
    elements.pauseScreen.classList.toggle('hidden', !gameState.paused);
    
    if (!gameState.paused) {
        requestAnimationFrame(gameLoop);
    }
}

function showHowto() {
    elements.startScreen.classList.add('hidden');
    elements.howtoScreen.classList.remove('hidden');
}

function hideHowto() {
    elements.howtoScreen.classList.add('hidden');
    elements.startScreen.classList.remove('hidden');
}

function endGame(won) {
    gameState.running = false;
    if (insectAttackInterval) clearInterval(insectAttackInterval);
    audio.play('gameover');
    
    const isNewHighScore = gameState.score > gameState.highScore;
    if (isNewHighScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('jungleSmashHighScore', gameState.highScore);
    }
    
    elements.gameoverTitle.textContent = won ? '🎉 VICTORY! 🎉' : '💀 GAME OVER 💀';
    elements.finalScore.textContent = gameState.score.toLocaleString();
    elements.finalKills.textContent = gameState.kills;
    elements.finalCombo.textContent = 'x' + gameState.bestCombo;
    elements.finalStreak.textContent = gameState.maxStreak;
    elements.newHighscore.classList.toggle('show', isNewHighScore);
    
    setTimeout(() => {
        elements.gameoverScreen.classList.remove('hidden');
    }, 500);
}

document.addEventListener('DOMContentLoaded', init);
