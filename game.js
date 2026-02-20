// Newton United FC - Football Manager Ultra
// Game Engine

const CLUB = {
  name: "Newton United FC",
  nickname: "The Newtonians",
  colors: { primary: "#800000", secondary: "#FFFFFF", accent: "#000000" },
  stadium: "Newton Borough Ground",
  founded: 1897,
  reputation: 1
};

const POSITIONS = {
  GK: "Kiper",
  DEF: "Bek",
  MID: "Gelandang",
  FWD: "Penyerang"
};

const FORMATIONS = {
  "4-4-2": { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  "4-3-3": { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  "4-5-1": { GK: 1, DEF: 4, MID: 5, FWD: 1 },
  "3-5-2": { GK: 1, DEF: 3, MID: 5, FWD: 2 },
  "5-3-2": { GK: 1, DEF: 5, MID: 3, FWD: 2 }
};

let gameState = {
  money: 50000,
  week: 1,
  season: 1,
  reputation: 1,
  fans: 1200,
  stadiumCapacity: 3000,
  ticketPrice: 10,
  formation: "4-4-2",
  tactics: {
    style: "balanced",
    intensity: "medium",
    mentality: "balanced"
  },
  facilities: {
    stadium: 1,
    training: 1,
    medical: 1,
    analysis: 0
  },
  youthLevel: 1,
  squad: [],
  youthPlayers: [],
  transferList: [],
  fixtures: [],
  leagueTable: [],
  matchHistory: [],
  currentMatch: null,
  sponsors: {
    main: null,
    kit: null
  }
};

let firstNames = ["James", "William", "Jack", "Thomas", "Oliver", "George", "Harry", "Charlie", "Jacob", "Noah", "Alfie", "Oscar", "Henry", "Leo", "Archie", "Joshua", "Freddie", "Theo", "Ethan", "Alexander", "Joe", "Samuel", "Daniel", "Max", "Lucas", "Mason", "Logan", "Isaac", "Ryan", "Dylan", "Adam", "Luke", "Matthew", "Benjamin", "Harvey", "Tyler", "Liam", "Sebastian", "Jake", "Edward", "Alex", "Toby", "Kai", "Nathan", "Jamie", "Aaron", "Leon", "Zachary", "David", "Mohammed", "Reuben", "Elijah", "Jasper", "Finley", "Carter", "Louis", "Michael", "Jesse", "Gabriel", "Bobby"];
let lastNames = ["Smith", "Jones", "Taylor", "Brown", "Williams", "Wilson", "Johnson", "Davies", "Robinson", "Wright", "Thompson", "Evans", "Walker", "White", "Roberts", "Green", "Hall", "Wood", "Jackson", "Clarke", "Harris", "Cooper", "King", "Lee", "Martin", "Clarke", "Clark", "Harrison", "Scott", "Young", "Morris", "Hall", "Ward", "Turner", "Carter", "Phillips", "Mitchell", "Patel", "Adams", "Campbell", "Anderson", "Allen", "Cook", "Bailey", "Parker", "Miller", "Davis", "Murphy", "Price", "Bell", "Baker", "Griffiths", "Kelly", "Simpson", "Marshall", "Collins", "Bennett", "Cox", "Richardson", "Fox"];

// Utility Functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName() {
  return firstNames[randomInt(0, firstNames.length - 1)] + " " + lastNames[randomInt(0, lastNames.length - 1)];
}

function generatePlayer(age = null, position = null, isYouth = false) {
  const pos = position || Object.keys(POSITIONS)[randomInt(0, 3)];
  const playerAge = age || randomInt(isYouth ? 16 : 18, isYouth ? 19 : 35);
  
  let baseRating = isYouth ? randomInt(40, 65) : randomInt(45, 75);
  if (gameState.reputation > 3) baseRating += 5;
  if (gameState.reputation > 5) baseRating += 5;
  
  const potential = isYouth ? randomInt(baseRating + 10, 95) : baseRating + randomInt(-5, 10);
  
  const player = {
    id: Date.now() + Math.random(),
    name: generateName(),
    age: playerAge,
    position: pos,
    overall: baseRating,
    potential: potential,
    value: calculateValue(baseRating, playerAge, pos),
    wage: calculateWage(baseRating, playerAge),
    contract: randomInt(1, 4),
    stats: generateStats(pos, baseRating),
    form: randomInt(70, 100),
    fitness: 100,
    morale: randomInt(70, 100),
    injuries: 0,
    appearances: 0,
    goals: 0,
    assists: 0
  };
  
  return player;
}

function generateStats(position, overall) {
  const stats = {
    pace: randomInt(overall - 15, overall + 5),
    shooting: randomInt(overall - 15, overall + 5),
    passing: randomInt(overall - 15, overall + 5),
    dribbling: randomInt(overall - 15, overall + 5),
    defending: randomInt(overall - 15, overall + 5),
    physical: randomInt(overall - 15, overall + 5)
  };
  
  // Adjust based on position
  if (position === "GK") {
    stats.shooting = randomInt(20, 40);
    stats.defending = randomInt(overall, overall + 10);
  } else if (position === "DEF") {
    stats.defending = randomInt(overall, overall + 10);
    stats.shooting = randomInt(overall - 20, overall);
  } else if (position === "FWD") {
    stats.shooting = randomInt(overall, overall + 10);
    stats.defending = randomInt(overall - 20, overall);
  }
  
  // Cap at 99
  for (let key in stats) {
    stats[key] = Math.min(99, Math.max(1, stats[key]));
  }
  
  return stats;
}

function calculateValue(rating, age, position) {
  let base = rating * 1000;
  if (age < 23) base *= 1.5;
  if (age > 30) base *= 0.7;
  if (position === "FWD") base *= 1.2;
  if (position === "GK") base *= 0.8;
  return Math.floor(base);
}

function calculateWage(rating, age) {
  let base = rating * 50;
  if (age < 23) base *= 0.7;
  if (age > 30) base *= 1.2;
  return Math.floor(base);
}

function generateInitialSquad() {
  const squad = [];
  // Goalkeepers
  for (let i = 0; i < 2; i++) squad.push(generatePlayer(null, "GK"));
  // Defenders
  for (let i = 0; i < 6; i++) squad.push(generatePlayer(null, "DEF"));
  // Midfielders
  for (let i = 0; i < 6; i++) squad.push(generatePlayer(null, "MID"));
  // Forwards
  for (let i = 0; i < 4; i++) squad.push(generatePlayer(null, "FWD"));
  
  return squad;
}

function generateOpponent(difficulty = null) {
  const diff = difficulty || randomInt(1, 10);
  const names = ["Rovers", "Town", "City", "United", "Athletic", "Wanderers", "Rangers", "County", "Villa", "Park"];
  const locations = ["North", "South", "East", "West", "Central", "Upper", "Lower", "Old", "New", "Royal"];
  
  return {
    name: locations[randomInt(0, locations.length - 1)] + " " + names[randomInt(0, names.length - 1)],
    difficulty: diff,
    overall: 50 + (diff * 3),
    form: randomInt(60, 100)
  };
}

function generateFixtures() {
  const fixtures = [];
  const opponents = [];
  
  // Generate 20 unique opponents
  for (let i = 0; i < 19; i++) {
    opponents.push(generateOpponent(randomInt(1, 8)));
  }
  
  // Create home and away fixtures
  for (let week = 1; week <= 38; week++) {
    const isHome = week % 2 === 1;
    const opponent = opponents[(week - 1) % opponents.length];
    
    fixtures.push({
      week: week,
      opponent: opponent.name,
      isHome: isHome,
      played: false,
      result: null,
      goalsFor: 0,
      goalsAgainst: 0
    });
  }
  
  return fixtures;
}

function initLeagueTable() {
  const teams = [
    { name: "Newton United", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "North Rovers", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "South Town", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "East City", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "West United", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Central Athletic", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Upper Wanderers", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Lower Rangers", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Old County", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "New Villa", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Royal Park", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Bridge FC", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Hill United", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Valley Rovers", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Lake Town", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Forest City", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Meadow Athletic", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "River Wanderers", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Stone Rangers", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { name: "Green County", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }
  ];
  
  return teams;
}

// Game Initialization
function startGame() {
  // Load or initialize game state
  const saved = localStorage.getItem("newtonUnitedSave");
  
  if (saved) {
    gameState = JSON.parse(saved);
    showNotification("Karir dimuat kembali!");
  } else {
    gameState.squad = generateInitialSquad();
    gameState.fixtures = generateFixtures();
    gameState.leagueTable = initLeagueTable();
    generateTransferList();
    showNotification("Karir baru dimulai dengan Newton United FC!");
  }
  
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("mainGame").style.display = "block";
  
  updateUI();
  renderDashboard();
}

function saveGame() {
  localStorage.setItem("newtonUnitedSave", JSON.stringify(gameState));
}

// UI Functions
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".game-section").forEach(section => {
    section.classList.add("hidden");
  });
  
  // Show selected section
  document.getElementById(sectionId).classList.remove("hidden");
  
  // Update nav buttons
  document.querySelectorAll(".nav-menu button").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById("nav-" + sectionId).classList.add("active");
  
  // Render section specific content
  if (sectionId === "squad") renderSquad();
  if (sectionId === "tactics") renderTactics();
  if (sectionId === "matches") renderMatches();
  if (sectionId === "transfers") renderTransfers();
  if (sectionId === "youth") renderYouth();
  if (sectionId === "finances") renderFinances();
  if (sectionId === "facilities") renderFacilities();
}

function updateUI() {
  document.getElementById("moneyDisplay").textContent = "£" + formatMoney(gameState.money);
  document.getElementById("weekDisplay").textContent = gameState.week;
  document.getElementById("seasonDisplay").textContent = (2024 + gameState.season - 1) + "/" + (25 + gameState.season - 1);
  document.getElementById("reputationDisplay").textContent = "⭐".repeat(gameState.reputation);
  document.getElementById("fansDisplay").textContent = formatNumber(gameState.fans);
  document.getElementById("clubLevel").textContent = 9 - gameState.reputation;
}

function formatMoney(amount) {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + "M";
  if (amount >= 1000) return (amount / 1000).toFixed(0) + "K";
  return amount.toString();
}

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.remove();
  }, 3000);
}

// Dashboard
function renderDashboard() {
  const nextMatch = gameState.fixtures.find(f => !f.played);
  const nextMatchDiv = document.getElementById("nextMatch");
  
  if (nextMatch) {
    nextMatchDiv.innerHTML = `
      <div style="font-size: 1.2em; margin-bottom: 10px;">
        <strong>Minggu ${nextMatch.week}</strong>
      </div>
      <div style="font-size: 1.5em; color: #ffd700;">
        Newton United vs ${nextMatch.isHome ? nextMatch.opponent : nextMatch.opponent + " (A)"}
      </div>
      <div style="margin-top: 10px;">
        ${nextMatch.isHome ? "🏠 Kandang" : "✈️ Tandang"}
      </div>
    `;
  } else {
    nextMatchDiv.innerHTML = "<p>Musim selesai!</p>";
  }
  
  // Mini league table (top 5)
  const sortedTable = [...gameState.leagueTable].sort((a, b) => b.points - a.points || b.gd - a.gd);
  let tableHTML = "<table style='width: 100%;'><tr><th>#</th><th>Tim</th><th>Poin</th></tr>";
  sortedTable.slice(0, 5).forEach((team, index) => {
    const highlight = team.name === "Newton United" ? "style='color: #ffd700; font-weight: bold;'" : "";
    tableHTML += `<tr ${highlight}><td>${index + 1}</td><td>${team.name}</td><td>${team.points}</td></tr>`;
  });
  tableHTML += "</table>";
  document.getElementById("miniLeagueTable").innerHTML = tableHTML;
  
  // Recent form
  const recentMatches = gameState.matchHistory.slice(-5);
  let formHTML = "<div style='display: flex; gap: 10px;'>";
  recentMatches.forEach(match => {
    const color = match.result === "W" ? "#00ff88" : match.result === "D" ? "#ffd700" : "#ff4444";
    formHTML += `<div style="background: ${color}; color: #000; padding: 10px 15px; border-radius: 5px; font-weight: bold;">${match.result}</div>`;
  });
  formHTML += "</div>";
  document.getElementById("recentForm").innerHTML = formHTML || "<p>Belum ada pertandingan</p>";
}

// Squad Management
function renderSquad(filter = "all") {
  const container = document.getElementById("squadContainer");
  container.innerHTML = "";
  
  let players = gameState.squad;
  if (filter !== "all") {
    players = players.filter(p => p.position === filter);
  }
  
  players.forEach(player => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <div class="player-name">${player.name}</div>
      <div class="player-position">${POSITIONS[player.position]} | ${player.age} th</div>
      <div class="player-rating">${player.overall}</div>
      <div class="player-stats">
        <div>Kecepatan: ${player.stats.pace}</div>
        <div>Tembak: ${player.stats.shooting}</div>
        <div>Umpan: ${player.stats.passing}</div>
        <div>Dribel: ${player.stats.dribbling}</div>
      </div>
      <div style="margin-top: 10px; font-size: 0.8em;">
        Form: ${player.form}% | Fitness: ${player.fitness}%
      </div>
      <div style="margin-top: 5px; color: #00ff88;">
        £${formatMoney(player.value)}
      </div>
    `;
    card.onclick = () => showPlayerDetails(player);
    container.appendChild(card);
  });
}

function showSquadFilter(filter) {
  renderSquad(filter);
}

function showPlayerDetails(player) {
  const modal = document.getElementById("playerModal");
  const content = document.getElementById("playerModalContent");
  
  content.innerHTML = `
    <h2>${player.name}</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
      <div>
        <p><strong>Posisi:</strong> ${POSITIONS[player.position]}</p>
        <p><strong>Umur:</strong> ${player.age} tahun</p>
        <p><strong>Overall:</strong> ${player.overall}</p>
        <p><strong>Potensi:</strong> ${player.potential}</p>
        <p><strong>Nilai:</strong> £${formatMoney(player.value)}</p>
        <p><strong>Gaji:</strong> £${player.wage}/minggu</p>
        <p><strong>Kontrak:</strong> ${player.contract} tahun</p>
      </div>
      <div>
        <h4>Statistik</h4>
        <p>Kecepatan: ${player.stats.pace}</p>
        <p>Menembak: ${player.stats.shooting}</p>
        <p>Mengumpan: ${player.stats.passing}</p>
        <p>Dribbling: ${player.stats.dribbling}</p>
        <p>Bertahan: ${player.stats.defending}</p>
        <p>Fisik: ${player.stats.physical}</p>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <h4>Performa Musim Ini</h4>
      <p>Penampilan: ${player.appearances} | Gol: ${player.goals} | Assist: ${player.assists}</p>
    </div>
    <div style="margin-top: 20px;">
      <button class="btn btn-primary" onclick="extendContract(${player.id})">Perpanjang Kontrak</button>
      <button class="btn btn-danger" onclick="listForTransfer(${player.id})">Jual Pemain</button>
    </div>
  `;
  
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("playerModal").style.display = "none";
}

function extendContract(playerId) {
  const player = gameState.squad.find(p => p.id === playerId);
  if (player) {
    const cost = player.wage * 10;
    if (gameState.money >= cost) {
      gameState.money -= cost;
      player.contract += 2;
      saveGame();
      updateUI();
      showNotification(`Kontrak ${player.name} diperpanjang!`);
      closeModal();
    } else {
      showNotification("Uang tidak cukup!");
    }
  }
}

function listForTransfer(playerId) {
  const playerIndex = gameState.squad.findIndex(p => p.id === playerId);
  if (playerIndex > -1) {
    const player = gameState.squad[playerIndex];
    gameState.transferList.push({
      ...player,
      askingPrice: Math.floor(player.value * 0.8)
    });
    gameState.squad.splice(playerIndex, 1);
    saveGame();
    showNotification(`${player.name} dilepas ke daftar jual!`);
    closeModal();
    renderSquad();
  }
}

// Tactics
function renderTactics() {
  renderFormation();
}

function renderFormation() {
  const formation = FORMATIONS[gameState.formation];
  const display = document.getElementById("formationDisplay");
  display.innerHTML = "";
  
  // GK
  const gkRow = document.createElement("div");
  gkRow.className = "position-row";
  gkRow.innerHTML = `<div class="position-slot filled">GK</div>`;
  display.appendChild(gkRow);
  
  // DEF
  const defRow = document.createElement("div");
  defRow.className = "position-row";
  for (let i = 0; i < formation.DEF; i++) {
    defRow.innerHTML += `<div class="position-slot">DEF</div>`;
  }
  display.appendChild(defRow);
  
  // MID
  const midRow = document.createElement("div");
  midRow.className = "position-row";
  for (let i = 0; i < formation.MID; i++) {
    midRow.innerHTML += `<div class="position-slot">MID</div>`;
  }
  display.appendChild(midRow);
  
  // FWD
  const fwdRow = document.createElement("div");
  fwdRow.className = "position-row";
  for (let i = 0; i < formation.FWD; i++) {
    fwdRow.innerHTML += `<div class="position-slot">FWD</div>`;
  }
  display.appendChild(fwdRow);
}

function changeFormation() {
  gameState.formation = document.getElementById("formationSelect").value;
  saveGame();
  renderFormation();
}

// Matches
function renderMatches() {
  const tbody = document.getElementById("fixturesBody");
  tbody.innerHTML = "";
  
  gameState.fixtures.forEach(fixture => {
    const row = document.createElement("tr");
    const resultText = fixture.played ? `${fixture.goalsFor}-${fixture.goalsAgainst}` : "-";
    const resultClass = fixture.result === "W" ? "color: #00ff88;" : fixture.result === "L" ? "color: #ff4444;" : fixture.result === "D" ? "color: #ffd700;" : "";
    
    row.innerHTML = `
      <td>${fixture.week}</td>
      <td>${fixture.opponent}</td>
      <td>${fixture.isHome ? "Kandang" : "Tandang"}</td>
      <td style="${resultClass} font-weight: bold;">${resultText}</td>
    `;
    tbody.appendChild(row);
  });
}

function playMatch() {
  const fixture = gameState.fixtures.find(f => f.week === gameState.week);
  if (!fixture || fixture.played) {
    showNotification("Tidak ada pertandingan minggu ini!");
    return;
  }
  
  const btn = document.getElementById("playMatchBtn");
  btn.disabled = true;
  btn.textContent = "Pertandingan Berlangsung...";
  
  const opponent = generateOpponent(randomInt(1, 8));
  const eventsDiv = document.getElementById("matchEvents");
  eventsDiv.innerHTML = "";
  
  let homeScore = 0;
  let awayScore = 0;
  let minute = 0;
  
  // Calculate team strengths
  const myStrength = calculateTeamStrength();
  const oppStrength = opponent.overall;
  
  const matchEvents = [];
  
  // Simulate match minute by minute
  const interval = setInterval(() => {
    minute += 5;
    document.getElementById("matchTime").textContent = minute + "'";
    
    // Random events
    if (randomInt(1, 20) === 1) {
      // Goal chance
      const homeAdvantage = fixture.isHome ? 10 : 0;
      const myChance = myStrength + homeAdvantage;
      const total = myChance + oppStrength;
      
      if (randomInt(1, total) <= myChance) {
        // We score
        homeScore++;
        const scorer = gameState.squad[randomInt(0, gameState.squad.length - 1)];
        scorer.goals++;
        matchEvents.push({ minute, text: `GOAL! ${scorer.name} mencetak gol!` });
        addEventToDisplay(minute, `⚽ GOAL! ${scorer.name} mencetak gol untuk Newton United!`);
      } else {
        // They score
        awayScore++;
        matchEvents.push({ minute, text: `Goal untuk ${opponent.name}` });
        addEventToDisplay(minute, `⚽ Goal untuk ${opponent.name}`);
      }
      
      updateScore(fixture.isHome ? homeScore : awayScore, fixture.isHome ? awayScore : homeScore);
    }
    
    if (randomInt(1, 50) === 1) {
      // Yellow card
      addEventToDisplay(minute, "🟨 Kartu kuning diberikan");
    }
    
    if (minute >= 90) {
      clearInterval(interval);
      finishMatch(fixture, homeScore, awayScore, opponent.name);
    }
  }, 100);
}

function calculateTeamStrength() {
  const avgRating = gameState.squad.reduce((sum, p) => sum + p.overall, 0) / gameState.squad.length;
  const formBonus = gameState.squad.reduce((sum, p) => sum + p.form, 0) / gameState.squad.length / 100;
  return Math.floor(avgRating * formBonus);
}

function updateScore(us, them) {
  document.getElementById("matchScore").textContent = `${us} - ${them}`;
}

function addEventToDisplay(minute, text) {
  const eventsDiv = document.getElementById("matchEvents");
  const event = document.createElement("div");
  event.className = "event";
  event.innerHTML = `<span class="event-time">${minute}'</span> ${text}`;
  eventsDiv.insertBefore(event, eventsDiv.firstChild);
}

function finishMatch(fixture, homeScore, awayScore, opponentName) {
  const ourScore = fixture.isHome ? homeScore : awayScore;
  const theirScore = fixture.isHome ? awayScore : homeScore;
  
  fixture.played = true;
  fixture.goalsFor = ourScore;
  fixture.goalsAgainst = theirScore;
  
  let result;
  if (ourScore > theirScore) {
    result = "W";
    showNotification(`Kemenangan! ${ourScore}-${theirScore} vs ${opponentName}`);
  } else if (ourScore === theirScore) {
    result = "D";
    showNotification(`Imbang ${ourScore}-${theirScore} vs ${opponentName}`);
  } else {
    result = "L";
    showNotification(`Kekalahan ${ourScore}-${theirScore} vs ${opponentName}`);
  }
  
  fixture.result = result;
  gameState.matchHistory.push({ opponent: opponentName, result, gf: ourScore, ga: theirScore });
  
  // Update league table
  updateLeagueTable("Newton United", ourScore, theirScore, result);
  updateLeagueTable(opponentName, theirScore, ourScore, result === "W" ? "L" : result === "L" ? "W" : "D");
  
  // Financial rewards
  const prizeMoney = result === "W" ? 5000 : result === "D" ? 2000 : 1000;
  const ticketRevenue = fixture.isHome ? gameState.fans * gameState.ticketPrice : 0;
  gameState.money += prizeMoney + ticketRevenue;
  
  // Update fan base
  if (result === "W") gameState.fans = Math.floor(gameState.fans * 1.02);
  
  // Player development
  gameState.squad.forEach(player => {
    player.appearances++;
    player.form = Math.min(100, player.form + randomInt(-5, 10));
    player.fitness = Math.max(50, player.fitness - randomInt(5, 15));
  });
  
  saveGame();
  updateUI();
  renderMatches();
  
  document.getElementById("playMatchBtn").disabled = false;
  document.getElementById("playMatchBtn").textContent = "Mainkan Pertandingan";
}

function updateLeagueTable(teamName, gf, ga, result) {
  const team = gameState.leagueTable.find(t => t.name === teamName);
  if (team) {
    team.played++;
    team.gf += gf;
    team.ga += ga;
    team.gd = team.gf - team.ga;
    
    if (result === "W") {
      team.won++;
      team.points += 3;
    } else if (result === "D") {
      team.drawn++;
      team.points += 1;
    } else {
      team.lost++;
    }
  }
}

// Transfers
function generateTransferList() {
  gameState.transferList = [];
  for (let i = 0; i < 10; i++) {
    const player = generatePlayer();
    player.askingPrice = Math.floor(player.value * randomInt(80, 120) / 100);
    gameState.transferList.push(player);
  }
  renderTransfers();
  showNotification("Daftar transfer diperbarui!");
}

function renderTransfers() {
  const container = document.getElementById("transferList");
  container.innerHTML = "";
  
  if (gameState.transferList.length === 0) {
    generateTransferList();
    return;
  }
  
  gameState.transferList.forEach((player, index) => {
    const item = document.createElement("div");
    item.className = "transfer-item";
    item.innerHTML = `
      <div class="transfer-info">
        <h4>${player.name} (${player.age})</h4>
        <p>${POSITIONS[player.position]} | Rating: ${player.overall} | Potensi: ${player.potential}</p>
      </div>
      <div style="text-align: right;">
        <div class="transfer-price">£${formatMoney(player.askingPrice)}</div>
        <div style="font-size: 0.8em;">Gaji: £${player.wage}/minggu</div>
        <button class="btn btn-success" onclick="buyPlayer(${index})" style="margin-top: 5px;">Beli</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function buyPlayer(index) {
  const player = gameState.transferList[index];
  if (gameState.money >= player.askingPrice) {
    gameState.money -= player.askingPrice;
    gameState.squad.push(player);
    gameState.transferList.splice(index, 1);
    saveGame();
    updateUI();
    showNotification(`${player.name} bergabung dengan Newton United!`);
    renderTransfers();
  } else {
    showNotification("Uang tidak cukup!");
  }
}

function scoutPlayers() {
  const search = document.getElementById("scoutInput").value.toLowerCase();
  if (!search) {
    renderTransfers();
    return;
  }
  
  const filtered = gameState.transferList.filter(p => 
    p.name.toLowerCase().includes(search) || 
    POSITIONS[p.position].toLowerCase().includes(search)
  );
  
  const container = document.getElementById("transferList");
  container.innerHTML = "";
  
  filtered.forEach((player, index) => {
    const originalIndex = gameState.transferList.indexOf(player);
    const item = document.createElement("div");
    item.className = "transfer-item";
    item.innerHTML = `
      <div class="transfer-info">
        <h4>${player.name} (${player.age})</h4>
        <p>${POSITIONS[player.position]} | Rating: ${player.overall}</p>
      </div>
      <div style="text-align: right;">
        <div class="transfer-price">£${formatMoney(player.askingPrice)}</div>
        <button class="btn btn-success" onclick="buyPlayer(${originalIndex})">Beli</button>
      </div>
    `;
    container.appendChild(item);
  });
}

// Youth Academy
function renderYouth() {
  document.getElementById("youthLevel").textContent = gameState.youthLevel;
  document.getElementById("youthProgress").style.width = (gameState.youthLevel * 20) + "%";
  document.getElementById("youthUpgradeCost").textContent = gameState.youthLevel * 10000;
  
  const container = document.getElementById("youthContainer");
  container.innerHTML = "";
  
  gameState.youthPlayers.forEach((player, index) => {
    const card = document.createElement("div");
    card.className = "player-card youth-player";
    card.innerHTML = `
      <div class="player-name">${player.name}</div>
      <div class="player-position">${POSITIONS[player.position]} | ${player.age} th</div>
      <div class="player-rating">${player.overall}</div>
      <div style="margin-top: 10px;">
        <div style="font-size: 0.8em;">Potensi:</div>
        <div class="potential-bar">
          <div class="potential-fill" style="width: ${player.potential}%"></div>
        </div>
      </div>
      <button class="btn btn-success" onclick="promoteYouth(${index})" style="margin-top: 10px; width: 100%;">
        Promosikan ke Tim Utama
      </button>
    `;
    container.appendChild(card);
  });
}

function recruitYouth() {
  const cost = 5000;
  if (gameState.money < cost) {
    showNotification("Uang tidak cukup untuk merekrut pemuda!");
    return;
  }
  
  if (gameState.youthPlayers.length >= 5) {
    showNotification("Akademi penuh! Promosikan atau lepaskan pemain dulu.");
    return;
  }
  
  gameState.money -= cost;
  const player = generatePlayer(randomInt(16, 18), null, true);
  gameState.youthPlayers.push(player);
  saveGame();
  updateUI();
  renderYouth();
  showNotification(`${player.name} bergabung dengan akademi!`);
}

function promoteYouth(index) {
  const player = gameState.youthPlayers[index];
  gameState.squad.push(player);
  gameState.youthPlayers.splice(index, 1);
  saveGame();
  renderYouth();
  showNotification(`${player.name} dipromosikan ke tim utama!`);
}

function upgradeYouthAcademy() {
  const cost = gameState.youthLevel * 10000;
  if (gameState.money >= cost && gameState.youthLevel < 5) {
    gameState.money -= cost;
    gameState.youthLevel++;
    saveGame();
    updateUI();
    renderYouth();
    showNotification("Akademi pemuda ditingkatkan!");
  } else {
    showNotification("Uang tidak cukup atau sudah level maksimal!");
  }
}

// Finances
function renderFinances() {
  const weeklyWages = gameState.squad.reduce((sum, p) => sum + p.wage, 0);
  const matchDayRevenue = gameState.fans * gameState.ticketPrice / 10; // Average per week
  const sponsorIncome = (gameState.sponsors.main ? 5000 : 0) + (gameState.sponsors.kit ? 3000 : 0);
  
  const income = matchDayRevenue + sponsorIncome;
  const expense = weeklyWages + (gameState.facilities.training * 1000) + (gameState.facilities.medical * 800);
  
  document.getElementById("currentBalance").textContent = "£" + formatMoney(gameState.money);
  document.getElementById("weeklyIncome").textContent = "£" + formatMoney(income);
  document.getElementById("weeklyExpense").textContent = "£" + formatMoney(expense);
  document.getElementById("clubValue").textContent = "£" + formatMoney(gameState.squad.reduce((sum, p) => sum + p.value, 0) + gameState.money);
  
  const sponsorsDiv = document.getElementById("sponsorsList");
  sponsorsDiv.innerHTML = `
    <p>Sponsor Utama: <strong>${gameState.sponsors.main || "Belum ada"}</strong> ${gameState.sponsors.main ? "(£5,000/minggu)" : ""}</p>
    <p>Kit Sponsor: <strong>${gameState.sponsors.kit || "Belum ada"}</strong> ${gameState.sponsors.kit ? "(£3,000/minggu)" : ""}</p>
  `;
}

function negotiateSponsor() {
  if (gameState.reputation < 2) {
    showNotification("Reputasi terlalu rendah untuk sponsor!");
    return;
  }
  
  const sponsors = ["Nike", "Adidas", "Puma", "Carling", "Bet365", "Local Business", "Tech Corp"];
  const type = Math.random() > 0.5 ? "main" : "kit";
  
  if (!gameState.sponsors[type]) {
    gameState.sponsors[type] = sponsors[randomInt(0, sponsors.length - 1)];
    showNotification(`Kesepakatan sponsor ${type === "main" ? "utama" : "kit"} dengan ${gameState.sponsors[type]}!`);
    saveGame();
    renderFinances();
  } else {
    showNotification("Slot sponsor sudah terisi!");
  }
}

// Facilities
function renderFacilities() {
  const qualities = ["Standar", "Bagus", "Sangat Bagus", "Excelent", "World Class"];
  document.getElementById("stadiumCapacity").textContent = gameState.stadiumCapacity.toLocaleString();
  document.getElementById("stadiumQuality").textContent = qualities[gameState.facilities.stadium - 1] || "Standar";
  document.getElementById("trainingLevel").textContent = gameState.facilities.training;
  document.getElementById("medicalLevel").textContent = gameState.facilities.medical;
  document.getElementById("analysisLevel").textContent = gameState.facilities.analysis;
}

function upgradeStadium() {
  const cost = 25000 * gameState.facilities.stadium;
  if (gameState.money >= cost) {
    gameState.money -= cost;
    gameState.facilities.stadium++;
    gameState.stadiumCapacity += 1000;
    saveGame();
    updateUI();
    renderFacilities();
    showNotification("Stadion ditingkatkan! Kapasitas bertambah 1,000");
  } else {
    showNotification("Uang tidak cukup!");
  }
}

function upgradeTraining() {
  const cost = 20000 * gameState.facilities.training;
  if (gameState.money >= cost && gameState.facilities.training < 5) {
    gameState.money -= cost;
    gameState.facilities.training++;
    saveGame();
    renderFacilities();
    showNotification("Pusat latihan ditingkatkan!");
  } else {
    showNotification("Uang tidak cukup atau sudah maksimal!");
  }
}

function upgradeMedical() {
  const cost = 15000 * gameState.facilities.medical;
  if (gameState.money >= cost && gameState.facilities.medical < 5) {
    gameState.money -= cost;
    gameState.facilities.medical++;
    saveGame();
    renderFacilities();
    showNotification("Fasilitas medis ditingkatkan!");
  } else {
    showNotification("Uang tidak cukup atau sudah maksimal!");
  }
}

function upgradeAnalysis() {
  const cost = 30000 * (gameState.facilities.analysis + 1);
  if (gameState.money >= cost && gameState.facilities.analysis < 3) {
    gameState.money -= cost;
    gameState.facilities.analysis++;
    saveGame();
    renderFacilities();
    showNotification("Analisis data ditingkatkan!");
  } else {
    showNotification("Uang tidak cukup atau sudah maksimal!");
  }
}

// Week progression
function nextWeek() {
  gameState.week++;
  
  // Weekly wages
  const totalWages = gameState.squad.reduce((sum, p) => sum + p.wage, 0);
  gameState.money -= totalWages;
  
  // Weekly income from fans/sponsors
  const baseIncome = Math.floor(gameState.fans * 0.5);
  const sponsorIncome = (gameState.sponsors.main ? 5000 : 0) + (gameState.sponsors.kit ? 3000 : 0);
  gameState.money += baseIncome + sponsorIncome;
  
  // Player development
  gameState.squad.forEach(player => {
    // Recover fitness
    player.fitness = Math.min(100, player.fitness + 20);
    
    // Age and improve
    if (randomInt(1, 100) <= 5 && player.overall < player.potential) {
      player.overall++;
      player.value = calculateValue(player.overall, player.age, player.position);
    }
  });
  
  // Youth development
  gameState.youthPlayers.forEach(player => {
    if (randomInt(1, 100) <= 10 && player.overall < player.potential) {
      player.overall++;
    }
  });
  
  // Check season end
  if (gameState.week > 38) {
    endSeason();
  }
  
  saveGame();
  updateUI();
  renderDashboard();
  showNotification(`Minggu ${gameState.week} dimulai!`);
}

function endSeason() {
  const position = gameState.leagueTable.findIndex(t => t.name === "Newton United") + 1;
  
  let message = `Musim berakhir! Posisi: ${position}`;
  
  if (position <= 2) {
    gameState.reputation++;
    message += "\nPromosi! Reputasi meningkat!";
    showNotification(message);
  } else if (position >= 18) {
    message += "\nTetap di divisi yang sama.";
    showNotification(message);
  } else {
    message += "\nTetap di divisi yang sama.";
    showNotification(message);
  }
  
  // Reset for new season
  gameState.week = 1;
  gameState.season++;
  gameState.fixtures = generateFixtures();
  gameState.leagueTable = initLeagueTable();
  gameState.matchHistory = [];
  
  // Age players
  gameState.squad.forEach(p => {
    p.age++;
    p.contract--;
    if (p.contract <= 0) {
      showNotification(`${p.name} kontrak habis dan meninggalkan klub!`);
    }
  });
  
  // Remove expired contracts
  gameState.squad = gameState.squad.filter(p => p.contract > 0);
  
  saveGame();
}

// Initialize
window.onload = function() {
  // Check for existing save
  const saved = localStorage.getItem("newtonUnitedSave");
  if (saved) {
    document.querySelector(".start-btn").textContent = "Lanjutkan Karir";
  }
};

window.onclick = function(event) {
  const modal = document.getElementById("playerModal");
  if (event.target === modal) {
    closeModal();
  }
};
