const state = { game: null, keeps: new Set(), busy: false, selectedCategory: null };

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const REEL_DECOYS = {
  season: ["2023–24", "2024–25", "2025–26"],
  team: ["ATL", "BOS", "BKN", "CHI", "DAL", "DEN", "GSW", "LAL", "MIA", "MIL", "NYK", "OKC", "PHX", "SAS"],
  player: ["J. Brunson", "S. Gilgeous-Alexander", "N. Jokić", "A. Edwards", "J. Tatum", "L. Dončić", "G. Antetokounmpo", "S. Curry"],
};

const CATEGORY_CODES = {
  all_nba_third: "NBA 3", all_nba_second: "NBA 2", all_nba_first: "NBA 1",
  champion: "CHAMP", all_defense_second: "DEF 2", all_defense_first: "DEF 1",
  major_award: "MVP+",
};

async function request(path, body = null) {
  const options = body === null ? {} : {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

function categoryRow(category) {
  const score = category.used ? category.score : category.preview;
  const qualifies = category.section === "Accolades" && !category.used && (category.preview ?? 0) > 0;
  const elite = !category.used && category.glow_threshold && (category.preview ?? 0) >= category.glow_threshold;
  const selected = !category.used && state.selectedCategory === category.id;
  const scoredHighlight = category.used && (
    (category.section === "Accolades" && category.score > 0) ||
    (category.glow_threshold && category.score >= category.glow_threshold)
  );
  const detail = category.used && category.selection
    ? `${category.selection.player} · ${category.selection.season} ${category.selection.team}`
    : category.preview !== null ? "Available for this player" : "Spin to preview";
  const valueLabel = category.formula || (category.fixed_value ? `${category.fixed_value} pts` : "");
  const code = CATEGORY_CODES[category.id];
  const badge = code ? `<i class="category-code" aria-hidden="true">${code}</i>` : "";
  const status = category.used ? `<span class="category-status" aria-label="Scored">✓</span>` : "";
  const classes = [category.used && "used", qualifies && "qualified", elite && "elite", selected && "selected", scoredHighlight && "scored-highlight"].filter(Boolean).join(" ");
  return `<button class="category ${classes}" data-category="${category.id}" ${category.used || category.preview === null ? "disabled" : ""}>
    ${badge}<span class="category-copy"><strong>${category.label} <em>${valueLabel}</em></strong><small>${detail}</small></span>
    <b>${score ?? "—"}</b>${status}
  </button>`;
}

function render(game, { preserveReels = false } = {}) {
  state.game = game;
  if (state.selectedCategory) {
    const selected = game.categories.find(category => category.id === state.selectedCategory);
    if (!selected || selected.used || selected.preview === null) state.selectedCategory = null;
  }

  $("#header-turn").textContent = game.complete ? "Final" : `${game.turn} / ${game.turns_total}`;
  $("#turn-label").textContent = game.complete ? "Game complete" : `Turn ${game.turn} of ${game.turns_total}`;
  $("#spin-label").textContent = game.spins_used ? `Spin ${game.spins_used} of ${game.spins_total}` : "Ready to spin";
  $("#total-score").textContent = game.total_score;
  $("#upper-score").textContent = game.upper_total;
  $("#bonus-score").textContent = game.bonus ? `+${game.bonus}` : "0";
  $("#bonus-progress").style.width = `${Math.min(100, (game.upper_total / game.upper_target) * 100)}%`;

  const player = game.player;
  if (!preserveReels) {
    $("#season-value").textContent = player?.season || "—";
    $("#team-value").textContent = player?.team || "—";
    $("#player-value").textContent = player?.name || "—";
  }

  $("#player-card").classList.toggle("hidden", !player);
  if (player) {
    $("#player-context").textContent = `${player.season}  ·  ${player.team}`;
    $("#player-name").textContent = player.name;
    $("#jersey").textContent = `#${player.jersey}`;
    $("#jersey").style.setProperty("--team-primary", player.team_colors.primary);
    $("#jersey").style.setProperty("--team-secondary", player.team_colors.secondary);
    $("#stats").innerHTML = Object.entries(player.stats)
      .map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("");
    $("#awards").innerHTML = player.awards.length
      ? player.awards.map(award => `<div class="award-badge"><span>${award.label.split(" ").map(word => word[0]).join("").slice(0, 3)}</span><strong>${award.label}</strong></div>`).join("")
      : `<p class="no-awards">No qualifying accolades</p>`;
  }

  const grouped = game.categories.reduce((groups, item) => {
    (groups[item.section] ||= []).push(item);
    return groups;
  }, {});
  $("#scorecard").innerHTML = ["Stats", "Accolades", "Joker"].map(section => `
    <section class="score-section"><h3>${section}</h3>${(grouped[section] || []).map(categoryRow).join("")}</section>
  `).join("");
  $$(".category:not(:disabled)").forEach(button => button.addEventListener("click", () => selectCategory(button.dataset.category)));

  $$(".slot").forEach(button => {
    const keepName = button.dataset.keep;
    button.disabled = !player || game.rerolls_left === 0 || state.busy;
    button.classList.toggle("kept", state.keeps.has(keepName));
    button.setAttribute("aria-pressed", state.keeps.has(keepName) ? "true" : "false");
    button.querySelector(".keep-text").textContent = state.keeps.has(keepName) ? `${keepName} kept` : `Keep ${keepName}`;
  });

  const allKept = state.keeps.size === 3;
  const spinButton = $("#spin");
  spinButton.disabled = state.busy || game.complete || (player && (game.rerolls_left === 0 || allKept));
  spinButton.querySelector(".spin-copy").textContent = player
    ? (game.rerolls_left ? "Spin open reels" : "Choose a score")
    : "Spin the roulette";
  $("#spin-count").textContent = player
    ? (game.rerolls_left ? `${game.rerolls_left} reroll${game.rerolls_left === 1 ? "" : "s"} remaining` : "No spins remaining")
    : "3 spins available";

  const selectedCategory = game.categories.find(category => category.id === state.selectedCategory);
  $("#score-confirm").classList.toggle("hidden", !player);
  $("#selected-category").textContent = selectedCategory
    ? `${selectedCategory.label} · ${selectedCategory.preview} points`
    : "Choose a scorecard category";
  $("#confirm-score").disabled = !selectedCategory || state.busy;
  $("#confirm-score").textContent = selectedCategory ? `Score ${selectedCategory.preview} points` : "Confirm score";

  if (game.complete) {
    $("#final-score").textContent = game.total_score;
    $("#finished").showModal();
  }
}

function cycleReel(name, finalValue, duration) {
  const value = $(`#${name}-value`);
  const slot = value.closest(".slot");
  if (state.keeps.has(name) || reducedMotion.matches) {
    value.textContent = finalValue;
    return Promise.resolve();
  }
  const choices = REEL_DECOYS[name];
  slot.classList.add("spinning");
  let index = Math.floor(Math.random() * choices.length);
  const timer = window.setInterval(() => {
    value.textContent = choices[index % choices.length];
    index += 1 + Math.floor(Math.random() * 2);
  }, 62);
  return new Promise(resolve => {
    window.setTimeout(() => {
      window.clearInterval(timer);
      value.textContent = finalValue;
      slot.classList.remove("spinning");
      slot.classList.add("landed");
      window.setTimeout(() => slot.classList.remove("landed"), 360);
      resolve();
    }, duration);
  });
}

async function animateReels(game) {
  const player = game.player;
  if (!player) return;
  $("#player-card").classList.add("is-waiting");
  await Promise.all([
    cycleReel("season", player.season, 700),
    cycleReel("team", player.team, 1080),
    cycleReel("player", player.name, 1540),
  ]);
  $("#player-card").classList.remove("is-waiting");
}

async function spin() {
  if (state.busy) return;
  setBusy(true);
  state.selectedCategory = null;
  try {
    const game = await request("/api/spin", { keeps: [...state.keeps] });
    $("#message").textContent = "";
    await animateReels(game);
    setBusy(false);
    render(game);
  } catch (error) {
    $("#message").textContent = error.message;
    setBusy(false);
    if (state.game) render(state.game);
  }
}

function selectCategory(category) {
  if (state.busy) return;
  state.selectedCategory = state.selectedCategory === category ? null : category;
  render(state.game);
}

async function score(category) {
  if (state.busy || !category) return;
  setBusy(true);
  try {
    const game = await request("/api/score", { category });
    state.keeps.clear();
    state.selectedCategory = null;
    setBusy(false);
    render(game);
  } catch (error) {
    $("#message").textContent = error.message;
    setBusy(false);
    render(state.game);
  }
}

async function newGame() {
  setBusy(true);
  try {
    const game = await request("/api/new", {});
    state.keeps.clear();
    state.selectedCategory = null;
    $("#finished").close();
    setBusy(false);
    render(game);
  } catch (error) {
    $("#message").textContent = error.message;
    setBusy(false);
  }
}

function setBusy(value) {
  state.busy = value;
  document.body.classList.toggle("busy", value);
}

$$(".slot").forEach(button => button.addEventListener("click", () => {
  if (state.busy) return;
  const keep = button.dataset.keep;
  state.keeps.has(keep) ? state.keeps.delete(keep) : state.keeps.add(keep);
  render(state.game);
}));
$("#spin").addEventListener("click", spin);
$("#confirm-score").addEventListener("click", () => score(state.selectedCategory));
$("#new-game").addEventListener("click", newGame);
$("#play-again").addEventListener("click", newGame);

request("/api/state").then(render).catch(error => { $("#message").textContent = error.message; });
