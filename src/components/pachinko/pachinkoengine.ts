export interface Peg {
  x: number;
  y: number;
  r: number;
}

export interface Bin {
  xStart: number;
  xEnd: number;
  multiplier: number;
}

export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alive: boolean;
  trail: { x: number; y: number }[];
  betAmount: number;
}

export interface GameState {
  balance: number;
  betAmount: number;
  ballsInPlay: number;
  totalBalls: number;
  score: number;
  gameOver: boolean;
}

export const GAME_CONFIG = {
  rows: 10,
  pegSpacingX: 28,
  pegSpacingY: 28,
  pegRadius: 4.5,
  ballRadius: 5.5,
  gravity: 0.32,
  bounceDamping: 0.68,
  jitter: 0.45,
  wallBounceDamping: 1.05,

  toothBounceDamping: 0.96,
  toothKick: 1.15,

  dividerRadius: 5,
  dividerBounceDamping: 0.82,
  dividerKick: 0.18,
  multipliers: [20, 5, 0.75, 2, 0.5, 1, 0, 1, 0.5, 2, 0.75, 5, 20],
  startingBalance: 1000,
  minBet: 0.01,
  maxBet: 1000000, // Allow any amount
};

export const TOP_MARGIN = 60;
// Small physical boundary so the ball never clips off the edge of the
// canvas - this is just a hard clamp, not the visual/gameplay wall.
const WALL_EDGE_INSET = 0;
// Shape of a wall tooth, shared between physics and rendering so the
// drawn triangle and its collision circle always line up.
export const TOOTH_REACH = 15; // how far the apex pokes inward from the wall
export const TOOTH_HALF_HEIGHT = 12; // vertical half-extent of the triangle

/**
 * The horizontal inset of the *even* peg rows from the canvas edge.
 * Odd rows are staggered inward by half a peg-spacing, so their own
 * inset is `computeXOffset(width) + pegSpacingX / 2`. Centralizing this
 * calculation means buildPegs() and wallInset() can never drift apart
 * and produce an off-center board again.
 */
export function computeXOffset(width: number): number {
  const { pegSpacingX } = GAME_CONFIG;
  const evenCols = Math.max(2, Math.floor(width / pegSpacingX));
  const evenGridWidth = (evenCols - 1) * pegSpacingX;
  return (width - evenGridWidth) / 2;
}

/**
 * Symmetric triangular peg grid: even rows get N pegs spanning the full
 * centered width, odd rows get N-1 pegs sitting in the gaps between them.
 * This guarantees every row's own left margin equals its own right
 * margin, so there's no side that's easier to skip past than the other.
 */
export function buildPegs(width: number): Peg[] {
  const pegs: Peg[] = [];
  const { rows, pegSpacingX, pegSpacingY, pegRadius } = GAME_CONFIG;
  const xOffset = computeXOffset(width);
  const evenCols = Math.max(2, Math.floor(width / pegSpacingX));
  const oddCols = evenCols - 1;

  for (let row = 0; row < rows; row++) {
    const isOdd = row % 2 === 1;
    const colsThisRow = isOdd ? oddCols : evenCols;
    const rowStartX = isOdd ? xOffset + pegSpacingX / 2 : xOffset;
    const y = TOP_MARGIN + row * pegSpacingY;
    for (let col = 0; col < colsThisRow; col++) {
      const x = rowStartX + col * pegSpacingX;
      pegs.push({ x, y, r: pegRadius });
    }
  }
  return pegs;
}

export interface WallTooth extends Peg {
  side: "left" | "right";
}

export interface CupDivider extends Peg {
  type: "divider";
}

/**
 * Cup dividers must sit ABOVE `binY` (a smaller y value), not below it.
 * A ball is marked `alive = false` the moment `ball.y + ball.r >= binY`
 * (see stepBall), so any collider placed at a y-position >= binY can
 * never be reached by a still-alive ball - it's dead code. Previously
 * this used `boardHeight() - 22`, which sat below `binY`, so dividers
 * rendered visually but never actually collided with anything.
 *
 * Now takes `binY` explicitly (rather than recomputing boardHeight()
 * independently) so the physics position can never drift out of sync
 * with the value the caller actually uses to decide when a ball lands.
 */
export function buildCupDividers(width: number, binY: number): CupDivider[] {
  const binWidth = width / GAME_CONFIG.multipliers.length;
  // Sit a bit above the landing line so there's room for the ball's
  // radius + the divider's radius to resolve a collision before the
  // ball's y ever reaches binY and gets killed off.
  const dividerY = binY - 10;

  const dividers: CupDivider[] = [];

  for (let i = 1; i < GAME_CONFIG.multipliers.length; i++) {
    dividers.push({
      x: i * binWidth,
      y: dividerY,
      r: GAME_CONFIG.dividerRadius,
      type: "divider",
    });
  }

  return dividers;
}
/**
 * Discrete teeth that plug the gap on staggered (odd) rows only. Even
 * rows already have a real peg sitting at `xOffset` from the edge, so
 * they're already covered - it's only the odd rows, whose first peg
 * starts half a peg-spacing further in, that leave a bigger free-fall
 * strip next to the wall. Each tooth collides as a plain circle (the
 * same collision code as every other peg, already proven not to trap a
 * ball), so unlike a continuous sloped wall there's genuine open space
 * above, below, and between every tooth for the ball to pass through.
 * Teeth sit flush against the wall itself (their flat edge at
 * WALL_EDGE_INSET), not out at the peg margin, so they read as part of
 * the wall rather than a floating extra peg.
 */
export function buildWallTeeth(width: number): WallTooth[] {
  const { rows, pegSpacingY } = GAME_CONFIG;
  const toothRadius = TOOTH_REACH / 2;
  const leftX = WALL_EDGE_INSET + toothRadius;
  const rightX = width - WALL_EDGE_INSET - toothRadius;
  const teeth: WallTooth[] = [];
  for (let row = 0; row < rows; row++) {
    if (row % 2 === 0) continue;
    const y = TOP_MARGIN + row * pegSpacingY;
    teeth.push({ x: leftX, y, r: toothRadius, side: "left" });
    teeth.push({ x: rightX, y, r: toothRadius, side: "right" });
  }
  return teeth;
}

export function buildBins(width: number): Bin[] {
  const binWidth = width / GAME_CONFIG.multipliers.length;
  return GAME_CONFIG.multipliers.map((m, i) => ({
    xStart: i * binWidth,
    xEnd: (i + 1) * binWidth,
    multiplier: m,
  }));
}

export function boardHeight(): number {
  return TOP_MARGIN + GAME_CONFIG.rows * GAME_CONFIG.pegSpacingY + 70;
}

export type StepEvent =
  | { type: "peg"; x: number; y: number }
  | { type: "wall"; x: number; y: number };

export function stepBall(
  ball: Ball,
  pegs: Peg[],
  width: number,
  binY: number,
  events: StepEvent[],
): void {
  if (!ball.alive) return;

  ball.vy += GAME_CONFIG.gravity;
  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.trail.push({ x: ball.x, y: ball.y });
  if (ball.trail.length > 6) ball.trail.shift();

  // Flat physical boundary - just keeps the ball on the canvas. The
  // actual gameplay obstacles near the edges are the wall teeth, which
  // ride along in the `pegs` array and get handled by the peg collision
  // loop below like any other peg.
  if (ball.x - ball.r < WALL_EDGE_INSET) {
    ball.x = WALL_EDGE_INSET + ball.r;
    ball.vx *= -GAME_CONFIG.wallBounceDamping;
    events.push({ type: "wall", x: ball.x, y: ball.y });
  } else if (ball.x + ball.r > width - WALL_EDGE_INSET) {
    ball.x = width - WALL_EDGE_INSET - ball.r;
    ball.vx *= -GAME_CONFIG.wallBounceDamping;
    events.push({ type: "wall", x: ball.x, y: ball.y });
  }

  // Collisions with pegs, side teeth, and cup dividers.
  const ballR = ball.r;

  for (const peg of pegs) {
    const dx = ball.x - peg.x;
    const dy = ball.y - peg.y;
    const distSq = dx * dx + dy * dy;
    const minDist = ballR + peg.r;
    const minDistSq = minDist * minDist;

    if (distSq < minDistSq && distSq > 0.0001) {
      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const ny = dy / dist;

      const overlap = minDist - dist;

      ball.x += nx * overlap;
      ball.y += ny * overlap;

      const dot = ball.vx * nx + ball.vy * ny;

      const isTooth =
        "side" in peg &&
        (peg.side === "left" || peg.side === "right");

      const isDivider =
        "type" in peg &&
        peg.type === "divider";

      const damping = isTooth
        ? GAME_CONFIG.toothBounceDamping
        : isDivider
          ? GAME_CONFIG.dividerBounceDamping
          : GAME_CONFIG.bounceDamping;

      ball.vx = (ball.vx - 2 * dot * nx) * damping;
      ball.vy = (ball.vy - 2 * dot * ny) * damping;

      // Normal peg jitter.
      if(!isDivider) {
        ball.vx +=
          (Math.random() - 0.5) *
          GAME_CONFIG.jitter;
      }

      // Side teeth get a stronger kick toward the center and upward.
      if(isTooth) {
        const inward =
          "side" in peg && peg.side === "left"
            ? 1
            : -1;

        ball.vx += inward * GAME_CONFIG.toothKick;

        // This is what makes the teeth feel like they're kicking
        // the ball upward instead of simply reflecting it.
        ball.vy -= GAME_CONFIG.toothKick * 0.75;
      }

      // Cup dividers get a small velocity boost without becoming
      // nearly as violent as the side teeth.
      if (isDivider) {
        ball.vy -= GAME_CONFIG.dividerKick;

        // Slightly push the ball away from the divider horizontally.
        ball.vx += nx * GAME_CONFIG.dividerKick;
      }

      events.push({
        type: isDivider ? "peg" : isTooth ? "wall" : "peg",
        x: peg.x,
        y: peg.y,
      });
    }
  }
  if (ball.y + ball.r >= binY) {
    ball.alive = false;
  }
}

export function binIndexForX(x: number, bins: Bin[]): number {
  for (let i = 0; i < bins.length; i++) {
    if (x >= bins[i].xStart && x < bins[i].xEnd) return i;
  }
  return Math.max(0, Math.min(bins.length - 1, Math.floor(x / (bins[0]?.xEnd || 1))));
}

// ---- Sound System with Volume Control ----

let audioCtx: AudioContext | null = null;
let masterVolume = 0.5; // 0-1, default 50%

export function setMasterVolume(volume: number): void {
  masterVolume = Math.max(0, Math.min(1, volume));
}

export function getMasterVolume(): number {
  return masterVolume;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.07,
) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    // Apply master volume
    gain.gain.value = volume * masterVolume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // audio unavailable, fail silently
  }
}

export function playPegHit() {
  playTone(560 + Math.random() * 220, 0.045, "square", 0.035);
}

export function playWallHit() {
  playTone(180, 0.05, "triangle", 0.03);
}

export function playDrop() {
  playTone(240, 0.08, "sine", 0.05);
}

export function playScore(multiplier: number) {
  let base = 220;
  if (multiplier >= 20) base = 880;
  else if (multiplier >= 5) base = 660;
  else if (multiplier >= 2) base = 440;
  else if (multiplier > 0) base = 330;
  else base = 160; // 0x multiplier

  playTone(base, 0.1, "triangle", 0.06);
  if (multiplier >= 20) {
    setTimeout(() => playTone(base * 1.5, 0.2, "triangle", 0.06), 80);
  }
}

export function playWin(amount: number) {
  if (amount >= 100) {
    playTone(523, 0.1, "sawtooth", 0.05);
    setTimeout(() => playTone(659, 0.1, "sawtooth", 0.05), 100);
    setTimeout(() => playTone(784, 0.2, "sawtooth", 0.05), 200);
  } else if (amount >= 10) {
    playTone(440, 0.15, "sawtooth", 0.06);
    setTimeout(() => playTone(554, 0.15, "sawtooth", 0.06), 80);
  } else if (amount > 0) {
    playTone(330, 0.1, "sine", 0.04);
  }
}

export function playGameOver(highScore: boolean) {
  if (highScore) {
    playTone(523, 0.15, "sawtooth", 0.06);
    setTimeout(() => playTone(659, 0.15, "sawtooth", 0.06), 120);
    setTimeout(() => playTone(784, 0.25, "sawtooth", 0.06), 240);
  } else {
    playTone(220, 0.3, "sawtooth", 0.05);
  }
}

// ---- Leaderboard (localStorage) ----

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const LEADERBOARD_KEY = "pachinko:leaderboard";
const MAX_ENTRIES = 10;

export function loadAllLeaderboardScores(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(LEADERBOARD_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (entry): entry is LeaderboardEntry =>
          entry &&
          typeof entry.name === "string" &&
          typeof entry.score === "number" &&
          typeof entry.date === "string"
      )
      .sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  return loadAllLeaderboardScores().slice(0, MAX_ENTRIES);
}
export function isHighScore(score: number): boolean {
  if (score <= 0) return false;

  const board = loadAllLeaderboardScores();

  if (board.length < MAX_ENTRIES) return true;

  return score > board[MAX_ENTRIES - 1].score;
}

export function saveLeaderboardEntry(
  entry: LeaderboardEntry
): LeaderboardEntry[] {
  const board = loadAllLeaderboardScores();

  board.push(entry);

  board.sort((a, b) => b.score - a.score);

  try {
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
  } catch {
    // storage unavailable, ignore
  }

  // The UI leaderboard still only displays the top 10.
  return board.slice(0, MAX_ENTRIES);
}

export function getLeaderboardPlacement(
  entry: LeaderboardEntry
): number | null {
  const board = loadAllLeaderboardScores();

  const index = board.findIndex(
    (item) =>
      item.name === entry.name &&
      item.score === entry.score &&
      item.date === entry.date
  );

  if (index === -1) return null;

  return index + 1;
}