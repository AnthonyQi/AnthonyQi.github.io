// PachinkoGame.tsx
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type MouseEvent,
  type TouchEvent,
} from "react";

import {
  GAME_CONFIG,
  buildPegs,
  buildBins,
  buildWallTeeth,
  buildCupDividers,
  boardHeight,
  stepBall,
  binIndexForX,
  TOOTH_REACH,
  TOOTH_HALF_HEIGHT,
  playPegHit,
  playWallHit,
  playDrop,
  playScore,
  playWin,
  playGameOver,
  loadLeaderboard,
  isHighScore,
  saveLeaderboardEntry,
  getLeaderboardPlacement,
  setMasterVolume,
  type Ball,
  type StepEvent,
  type LeaderboardEntry,
} from "./pachinkoengine";

interface PachinkoGameProps {
  width: number;
  compact?: boolean;
  onExit?: () => void;
  /** Sound on/off is controlled by the parent so it can live in the window title bar. */
  soundOn: boolean;
  onToggleSound: () => void;
  /** Leaderboard visibility is controlled by the parent so it can live in the window title bar. */
  showLeaderboard: boolean;
  onToggleLeaderboard: () => void;
}

function readCssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

// Named short-scale suffixes from thousand up through decillion (10^33).
// Ordered largest-first so the lookup below finds the right tier on the
// first match. Anything past decillion has no commonly recognized name,
// so formatMoney falls back to scientific notation instead of guessing.
const MONEY_SUFFIXES: { value: number; suffix: string }[] = [
  { value: 1e33, suffix: "Dc" }, // decillion
  { value: 1e30, suffix: "No" }, // nonillion
  { value: 1e27, suffix: "Oc" }, // octillion
  { value: 1e24, suffix: "Sp" }, // septillion
  { value: 1e21, suffix: "Sx" }, // sextillion
  { value: 1e18, suffix: "Qi" }, // quintillion
  { value: 1e15, suffix: "Qa" }, // quadrillion
  { value: 1e12, suffix: "T" },  // trillion
  { value: 1e9, suffix: "B" },   // billion
  { value: 1e6, suffix: "M" },   // million
  { value: 1e3, suffix: "K" },   // thousand
];

// Formats currency compactly once numbers get large (e.g. $217.06M instead
// of $217057836.18) so the HUD never overflows or gets clipped. Uses named
// suffixes up through decillion (10^33), then switches to scientific
// notation beyond that since there's no widely-recognized name past it.
function formatMoney(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  if (abs >= 1e33) {
    return `${sign}$${abs.toExponential(2).replace("e+", "e")}`;
  }

  for (const { value, suffix } of MONEY_SUFFIXES) {
    if (abs >= value) {
      return `${sign}$${(abs / value).toFixed(2)}${suffix}`;
    }
  }

  return `${sign}$${abs.toFixed(2)}`;
}

// Draws one wall tooth as a small filled triangle whose flat edge sits
// flush against the wall, apex pointing inward toward the peg field -
// shares its dimensions with buildWallTeeth() so the drawn shape always
// matches its collision circle.
function drawTooth(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  side: "left" | "right",
  colors: { muted: string },
) {
  const halfHeight = TOOTH_HALF_HEIGHT;
  const reach = TOOTH_REACH;
  const flatEdgeX = side === "left" ? x - reach / 2 : x + reach / 2;
  const apexX = side === "left" ? x + reach / 2 : x - reach / 2;
  ctx.beginPath();
  ctx.moveTo(flatEdgeX, y - halfHeight);
  ctx.lineTo(flatEdgeX, y + halfHeight);
  ctx.lineTo(apexX, y);
  ctx.closePath();
  ctx.fillStyle = colors.muted;
  ctx.globalAlpha = 0.65;
  ctx.fill();
  ctx.globalAlpha = 1;
}

export default function PachinkoGame({
  width,
  compact = false,
  onExit,
  soundOn,
  //onToggleSound,
  showLeaderboard,
  //onToggleLeaderboard,
}: PachinkoGameProps) {
  const [balance, setBalance] = useState(GAME_CONFIG.startingBalance);
  const [betAmount, setBetAmount] = useState(10);
  const [score, setScore] = useState(0);
  const [ballsInPlay, setBallsInPlay] = useState(0);
  const [, setTotalBalls] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [qualifiesHighScore, setQualifiesHighScore] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submittedEntry, setSubmittedEntry] =
    useState<LeaderboardEntry | null>(null);
  const [submittedPlacement, setSubmittedPlacement] =
    useState<number | null>(null);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [customBet, setCustomBet] = useState<string>("10");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const nextBallId = useRef(0);
  const flashRef = useRef<{ binIndex: number; until: number } | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const soundOnRef = useRef(soundOn);
  soundOnRef.current = soundOn;
  const gameLoopRef = useRef<(() => void) | null>(null);

  const height = boardHeight();
  const binY = height - 46;

  const pegs = buildPegs(width);
  const bins = buildBins(width);
  const teeth = buildWallTeeth(width);
  // binY is passed in so dividers sit just above the ball's landing line -
  // see the comment on buildCupDividers for why that ordering matters.
  const dividers = buildCupDividers(width, binY);
  const collidables = [...pegs, ...teeth, ...dividers];

  useEffect(() => {
    setLeaderboard(loadLeaderboard());
    setMasterVolume(volume);
  }, []);

  const resetGame = useCallback(() => {
    ballsRef.current = [];
    nextBallId.current = 0;
    flashRef.current = null;
    setScore(0);
    setBallsInPlay(0);
    setTotalBalls(0);
    setGameOver(false);
    setScoreSubmitted(false);
    setQualifiesHighScore(false);
    setSubmittedEntry(null);
    setSubmittedPlacement(null);
    setLastWin(null);
    setBalance(GAME_CONFIG.startingBalance);
  }, []);

  // Shared game-over trigger, used both by the auto "out of balance" check
  // and the manual End Game button.
  const triggerGameOver = useCallback(() => {
    setGameOver((already) => {
      if (already) return already;
      const hs = isHighScore(score);
      setQualifiesHighScore(hs);
      if (soundOnRef.current) playGameOver(hs);
      return true;
    });
  }, [score]);

  // Clear the transient win/loss indicator after a short delay so it
  // never sticks around on screen between drops.
  useEffect(() => {
    if (lastWin === null) return;
    const timeout = setTimeout(() => setLastWin(null), 1500);
    return () => clearTimeout(timeout);
  }, [lastWin]);

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setMasterVolume(val);
  }

  function handleBetChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCustomBet(value);

    // Parse the value, default to 0 if empty or invalid
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      // Don't clamp here - only on blur
      setBetAmount(numValue);
    }
  }

  function handleBetBlur() {
    // If empty or invalid, set to default of 1
    if (!customBet || customBet.trim() === "" || isNaN(parseFloat(customBet))) {
      setCustomBet("1");
      setBetAmount(1);
      return;
    }

    const numValue = parseFloat(customBet);
    // Clamp to valid range
    const clamped = Math.max(GAME_CONFIG.minBet, Math.min(numValue, balance));
    setCustomBet(clamped.toString());
    setBetAmount(clamped);
  }

  function setBetPercentage(percentage: number) {
    const amount = balance * percentage;
    const rounded = Math.round(amount * 100) / 100; // Round to 2 decimals
    const clamped = Math.max(GAME_CONFIG.minBet, Math.min(rounded, balance));
    setCustomBet(clamped.toString());
    setBetAmount(clamped);
  }

  function dropBall(clientXRatio: number) {
    if (gameOver) return;
    if (balance < betAmount) {
      // Not enough balance
      return;
    }

    const x = Math.max(10, Math.min(width - 10, clientXRatio * width));
    const ball: Ball = {
      id: nextBallId.current++,
      x,
      y: 8,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0,
      r: GAME_CONFIG.ballRadius,
      alive: true,
      trail: [],
      betAmount,
    };
    ballsRef.current.push(ball);

    setBalance(prev => prev - betAmount);
    setBallsInPlay(prev => prev + 1);
    setTotalBalls(prev => prev + 1);

    if (soundOnRef.current) playDrop();
  }

  function handleCanvasClick(e: MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    dropBall((e.clientX - rect.left) / rect.width);
  }

  function handleCanvasTouch(e: TouchEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    dropBall((touch.clientX - rect.left) / rect.width);
  }

  // Game loop with optimized rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const colors = {
      border: readCssVar("--border", "#cccccc"),
      foreground: readCssVar("--foreground", "#111111"),
      muted: readCssVar("--muted-foreground", "#6b6b6b"),
      card: readCssVar("--card", "#ffffff"),
      accent: readCssVar("--accent", "#d0d0d0"),
    };

    const draw = () => {
      const events: StepEvent[] = [];
      for (const ball of ballsRef.current) {
        stepBall(ball, collidables, width, binY, events);
      }

      // Process events
      let totalWinnings = 0;
      for (const ev of events) {
        if (soundOnRef.current) {
          if (ev.type === "peg") playPegHit();
          else if (ev.type === "wall") playWallHit();
        }
      }

      const stillFalling: Ball[] = [];
      for (const ball of ballsRef.current) {
        if (ball.alive) {
          stillFalling.push(ball);
          continue;
        }
        const idx = binIndexForX(ball.x, bins);
        const multiplier = bins[idx]?.multiplier ?? 0;
        const winnings = multiplier * ball.betAmount;
        totalWinnings += winnings;

        flashRef.current = { binIndex: idx, until: performance.now() + 260 };
        if (soundOnRef.current) playScore(multiplier);
      }
      ballsRef.current = stillFalling;

      // Apply winnings
      if (totalWinnings > 0) {
        setBalance(prev => prev + totalWinnings);
        setScore(prev => prev + totalWinnings);
        setLastWin(totalWinnings);
        if (soundOnRef.current && totalWinnings > 0) {
          playWin(totalWinnings);
        }
      } else if (totalWinnings === 0 && ballsRef.current.length === 0) {
        // Player lost the bet (0x multiplier)
        setLastWin(0);
      }

      // Update balls in play
      setBallsInPlay(ballsRef.current.length);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw pegs
      for (const peg of pegs) {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.r, 0, Math.PI * 2);
        ctx.fillStyle = colors.muted;
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw wall teeth
      for (const tooth of teeth) {
        drawTooth(ctx, tooth.x, tooth.y, tooth.side, colors);
      }
      // Draw cup dividers
      for (const divider of dividers) {
        const dividerHeight = 18;
        ctx.beginPath();

        ctx.moveTo(
          divider.x - divider.r,
          binY
        );

        ctx.lineTo(
          divider.x - divider.r,
          binY + dividerHeight
        );

        ctx.quadraticCurveTo(
          divider.x,
          binY + dividerHeight + 4,
          divider.x + divider.r,
          binY + dividerHeight
        );

        ctx.lineTo(
          divider.x + divider.r,
          binY
        );

        ctx.closePath();

        ctx.fillStyle = colors.muted;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw bins
      const flash = flashRef.current;
      const now = performance.now();
      bins.forEach((bin, i) => {
        const isFlashing = flash && flash.binIndex === i && flash.until > now;
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(bin.xStart, binY, bin.xEnd - bin.xStart, height - binY);
        if (isFlashing) {
          ctx.fillStyle = colors.foreground;
          ctx.globalAlpha = 0.18;
          ctx.fillRect(bin.xStart, binY, bin.xEnd - bin.xStart, height - binY);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = colors.muted;
        ctx.font = "9px 'Geist Mono', monospace";
        ctx.textAlign = "center";
        const label = bin.multiplier === 0 ? "0" : `${bin.multiplier}x`;
        ctx.fillText(label, (bin.xStart + bin.xEnd) / 2, binY + (height - binY) / 2 + 3);
      });

      // Draw balls
      for (const ball of ballsRef.current) {
        ball.trail.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, ball.r * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = colors.foreground;
          ctx.globalAlpha = (i / ball.trail.length) * 0.15;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fillStyle = colors.foreground;
        ctx.fill();
      }

      // Drop rail hint
      ctx.strokeStyle = colors.border;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo(width, 4);
      ctx.stroke();
      ctx.setLineDash([]);

      rafRef.current = requestAnimationFrame(draw);
    };

    gameLoopRef.current = draw;
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [width, height]);

  // Auto game over when out of balance. This has to watch `ballsInPlay`
  // (state), not just `balance` - on a losing (0x) drop, balance was
  // already deducted when the bet was placed and never changes again once
  // the ball lands, so an effect keyed only on `balance` would never
  // re-fire to notice the ball has settled. `ballsInPlay` does change,
  // from 1 to 0, right when the ball lands, which is exactly the moment
  // we need to re-check.
  useEffect(() => {
    if (gameOver) return;
    if (balance < GAME_CONFIG.minBet && ballsInPlay === 0) {
      const timeout = setTimeout(() => {
        triggerGameOver();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [balance, ballsInPlay, gameOver, triggerGameOver]);

  function submitScore() {
    const name = nameInput.trim().slice(0, 12) || "PLAYER";

    const entry: LeaderboardEntry = {
      name,
      score,
      date: new Date().toISOString().slice(0, 10),
    };

    const updated = saveLeaderboardEntry(entry);
    const placement = getLeaderboardPlacement(entry);

    setLeaderboard(updated);
    setSubmittedEntry(entry);
    setSubmittedPlacement(placement);
    setScoreSubmitted(true);
  }

  const canEndGame = !gameOver && ballsInPlay === 0;

  return (
    <div className="select-none" style={{ width }}>
      {/* HUD - sound/scores now live in the window title bar, so this row only
          needs to fit the stats and the End Game control. */}
      <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
        <div className="flex items-center gap-3 min-w-0 overflow-hidden whitespace-nowrap">
          <span>
            Balance <span className="text-foreground">{formatMoney(balance)}</span>
          </span>
          <span>
            Score <span className="text-foreground">{formatMoney(score)}</span>
          </span>
          <span>
            Balls <span className="text-foreground">{ballsInPlay}</span>
          </span>
          {lastWin !== null && lastWin > 0 && (
            <span className="text-green-500 animate-pulse flex-shrink-0">
              +{formatMoney(lastWin)}
            </span>
          )}
          {lastWin === 0 && ballsInPlay === 0 && (
            <span className="text-red-500 flex-shrink-0">
              -{formatMoney(betAmount)}
            </span>
          )}
        </div>
        <button
          onClick={triggerGameOver}
          disabled={!canEndGame}
          title={ballsInPlay > 0 ? "Wait for balls to land" : "End the game"}
          className="flex-shrink-0 border border-border px-2 py-0.5 hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          End Game
        </button>
      </div>

      {/* Bet Controls - Single line with percentage buttons and textbox */}
      <div className="flex items-center gap-2 mb-2 flex-nowrap overflow-x-auto">
        <button
          onClick={() => setBetPercentage(0.1)}
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          10%
        </button>
        <button
          onClick={() => setBetPercentage(0.25)}
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          25%
        </button>
        <button
          onClick={() => setBetPercentage(0.5)}
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          50%
        </button>
        <button
          onClick={() => setBetPercentage(0.75)}
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          75%
        </button>
        <button
          onClick={() => setBetPercentage(1)}
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          Max
        </button>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[10px] text-muted-foreground">$</span>
          <input
            type="number"
            value={customBet}
            onChange={handleBetChange}
            onBlur={handleBetBlur}
            min={GAME_CONFIG.minBet}
            max={balance}
            step={0.01}
            className="w-20 px-2 py-1 border border-border bg-transparent text-center font-mono text-xs focus:outline-none focus:border-foreground"
            placeholder="Amount"
          />
        </div>
        {!compact && (
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <span className="text-[9px] text-muted-foreground">Vol</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-border rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Board */}
      <div className="relative border border-border bg-card/40">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onTouchStart={handleCanvasTouch}
          className="block cursor-crosshair"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Game Over
            </p>
            <p className="text-2xl font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {formatMoney(score)}
            </p>
            <p className="text-xs text-muted-foreground">
              Final Balance: {formatMoney(balance)}
            </p>
            {!scoreSubmitted && (
              <div className="flex flex-col items-center gap-2 w-full max-w-[220px]">

                {qualifiesHighScore && (
                  <p className="font-mono text-[9px] tracking-widest uppercase text-foreground">
                    New high score!
                  </p>
                )}

                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={12}
                  placeholder="Your name"
                  className="w-full bg-input-background border border-border px-2 py-1.5 text-sm text-center font-mono uppercase tracking-wider outline-none focus:border-foreground"
                />

                <button
                  onClick={submitScore}
                  className="w-full bg-foreground text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-foreground/80 transition-colors"
                >
                  Save score
                </button>

              </div>
            )}
            {scoreSubmitted && submittedEntry && (
              <div className="flex flex-col items-center gap-1 w-full max-w-[220px]">
                <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
                  Your score
                </p>

                <div className="flex items-center justify-between w-full border border-border px-3 py-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{submittedPlacement ?? "?"}
                  </span>

                  <span className="font-mono text-xs text-foreground">
                    {formatMoney(submittedEntry.score)}
                  </span>
                </div>

                {submittedPlacement && submittedPlacement > 10 && (
                  <p className="font-mono text-[8px] tracking-wider uppercase text-muted-foreground">
                    Outside the top 10
                  </p>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={resetGame}
                className="font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 border border-border hover:bg-secondary transition-colors"
              >
                Play again
              </button>
              {onExit && (
                <button
                  onClick={onExit}
                  className="font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 border border-border hover:bg-secondary transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!compact && (
        <p className="mt-2 font-mono text-[9px] tracking-wider text-muted-foreground uppercase whitespace-nowrap overflow-hidden text-ellipsis">
          Click the top rail to drop a ball
        </p>
      )}

      {showLeaderboard && (
        <div className="mt-3 border border-border bg-card/60 p-3">
          <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-2">
            High scores
          </p>
          {leaderboard.length === 0 ? (
            <p className="text-xs text-muted-foreground font-light">No scores yet. Play a game!</p>
          ) : (
            <ol className="space-y-1">
              {leaderboard.map((entry, i) => (
                <li
                  key={`${entry.name}-${entry.date}-${i}`}
                  className="flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-muted-foreground">
                    {i + 1}. {entry.name}
                  </span>
                  <span className="text-foreground">
                    {formatMoney(entry.score)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}