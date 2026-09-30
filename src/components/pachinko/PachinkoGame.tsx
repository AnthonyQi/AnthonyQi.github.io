// PachinkoGame.tsx
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
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

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

// Named short-scale suffixes from thousand through decillion.
const MONEY_SUFFIXES: { value: number; suffix: string }[] = [
  { value: 1e33, suffix: "Dc" },
  { value: 1e30, suffix: "No" },
  { value: 1e27, suffix: "Oc" },
  { value: 1e24, suffix: "Sp" },
  { value: 1e21, suffix: "Sx" },
  { value: 1e18, suffix: "Qi" },
  { value: 1e15, suffix: "Qa" },
  { value: 1e12, suffix: "T" },
  { value: 1e9, suffix: "B" },
  { value: 1e6, suffix: "M" },
  { value: 1e3, suffix: "K" },
];

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

function drawTooth(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  side: "left" | "right",
  colors: { muted: string }
) {
  const halfHeight = TOOTH_HALF_HEIGHT;
  const reach = TOOTH_REACH;

  const flatEdgeX =
    side === "left"
      ? x - reach / 2
      : x + reach / 2;

  const apexX =
    side === "left"
      ? x + reach / 2
      : x - reach / 2;

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
  // onToggleSound,
  showLeaderboard,
  // onToggleLeaderboard,
}: PachinkoGameProps) {
  const [balance, setBalance] = useState(
    GAME_CONFIG.startingBalance
  );

  const [betAmount, setBetAmount] = useState(10);
  const [score, setScore] = useState(0);
  const [ballsInPlay, setBallsInPlay] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>([]);

  const [nameInput, setNameInput] = useState("");
  const [qualifiesHighScore, setQualifiesHighScore] =
    useState(false);

  const [scoreSubmitted, setScoreSubmitted] =
    useState(false);

  const [submittedEntry, setSubmittedEntry] =
    useState<LeaderboardEntry | null>(null);

  const [submittedPlacement, setSubmittedPlacement] =
    useState<number | null>(null);

  const [lastWin, setLastWin] =
    useState<number | null>(null);

  const [customBet, setCustomBet] =
    useState<string>("10");

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const ballsRef =
    useRef<Ball[]>([]);

  const nextBallId =
    useRef(0);

  const flashRef =
    useRef<{
      binIndex: number;
      until: number;
    } | null>(null);

  const rafRef =
    useRef<number | undefined>(undefined);

  const startLoopRef =
    useRef<(() => void) | null>(null);

  const soundOnRef =
    useRef(soundOn);

  soundOnRef.current = soundOn;

  const height = boardHeight();
  const binY = height - 46;

  /*
   * Board geometry only depends on board size.
   *
   * Previously these arrays were rebuilt every time React
   * rerendered due to balance, score, bet changes, etc.
   */
  const geometry = useMemo(() => {
    const pegs = buildPegs(width);
    const bins = buildBins(width);
    const teeth = buildWallTeeth(width);

    const dividers =
      buildCupDividers(width, binY);

    return {
      pegs,
      bins,
      teeth,
      dividers,

      collidables: [
        ...pegs,
        ...teeth,
        ...dividers,
      ],
    };
  }, [width, binY]);

  const {
    pegs,
    bins,
    teeth,
    dividers,
    collidables,
  } = geometry;

  useEffect(() => {
    setLeaderboard(loadLeaderboard());
    setMasterVolume(volume);
  }, []);

  const resetGame = useCallback(() => {
    ballsRef.current.length = 0;

    nextBallId.current = 0;
    flashRef.current = null;

    setScore(0);
    setBallsInPlay(0);
    setGameOver(false);
    setScoreSubmitted(false);
    setQualifiesHighScore(false);
    setSubmittedEntry(null);
    setSubmittedPlacement(null);
    setLastWin(null);

    setBalance(
      GAME_CONFIG.startingBalance
    );
  }, []);

  const triggerGameOver =
    useCallback(() => {
      setGameOver((already) => {
        if (already) {
          return already;
        }

        const hs =
          isHighScore(score);

        setQualifiesHighScore(hs);

        if (soundOnRef.current) {
          playGameOver(hs);
        }

        return true;
      });
    }, [score]);

  useEffect(() => {
    if (lastWin === null) {
      return;
    }

    const timeout =
      setTimeout(
        () => setLastWin(null),
        1500
      );

    return () =>
      clearTimeout(timeout);
  }, [lastWin]);

  function handleVolumeChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const val =
      parseFloat(e.target.value);

    setVolume(val);
    setMasterVolume(val);
  }

  function handleBetChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const value =
      e.target.value;

    setCustomBet(value);

    const numValue =
      parseFloat(value);

    if (
      !isNaN(numValue) &&
      numValue >= 0
    ) {
      setBetAmount(numValue);
    }
  }

  function handleBetBlur() {
    if (
      !customBet ||
      customBet.trim() === "" ||
      isNaN(parseFloat(customBet))
    ) {
      setCustomBet("1");
      setBetAmount(1);
      return;
    }

    const numValue =
      parseFloat(customBet);

    const clamped =
      Math.max(
        GAME_CONFIG.minBet,
        Math.min(numValue, balance)
      );

    setCustomBet(
      clamped.toString()
    );

    setBetAmount(clamped);
  }

  function setBetPercentage(
    percentage: number
  ) {
    const amount =
      balance * percentage;

    const rounded =
      Math.round(amount * 100) / 100;

    const clamped =
      Math.max(
        GAME_CONFIG.minBet,
        Math.min(rounded, balance)
      );

    setCustomBet(
      clamped.toString()
    );

    setBetAmount(clamped);
  }

  function dropBall(
    clientXRatio: number
  ) {
    if (gameOver) {
      return;
    }

    if (balance < betAmount) {
      return;
    }

    const x =
      Math.max(
        10,
        Math.min(
          width - 10,
          clientXRatio * width
        )
      );

    const ball: Ball = {
      id: nextBallId.current++,
      x,
      y: 8,

      vx:
        (Math.random() - 0.5) *
        0.6,

      vy: 0,

      r:
        GAME_CONFIG.ballRadius,

      alive: true,

      trail: [],

      betAmount,
    };

    ballsRef.current.push(ball);

    setBalance(
      (prev) =>
        prev - betAmount
    );

    setBallsInPlay(
      (prev) =>
        prev + 1
    );

    if (soundOnRef.current) {
      playDrop();
    }

    /*
     * The render loop normally sleeps completely.
     * Wake it only when a ball actually needs animation.
     */
    startLoopRef.current?.();
  }

  function handleCanvasClick(
    e: MouseEvent<HTMLCanvasElement>
  ) {
    const rect =
      e.currentTarget.getBoundingClientRect();

    dropBall(
      (e.clientX - rect.left) /
        rect.width
    );
  }

  function handleCanvasTouch(
    e: TouchEvent<HTMLCanvasElement>
  ) {
    const touch =
      e.touches[0];

    if (!touch) {
      return;
    }

    const rect =
      e.currentTarget.getBoundingClientRect();

    dropBall(
      (touch.clientX - rect.left) /
        rect.width
    );
  }

  /*
   * Canvas rendering.
   *
   * Important optimizations:
   *
   * 1. Static board graphics are rendered once to an
   *    offscreen canvas.
   *
   * 2. The live loop runs at at most 60 Hz even on
   *    120 Hz displays.
   *
   * 3. The loop shuts down completely when there are
   *    no active balls or bin flashes.
   *
   * 4. React is not updated every frame.
   */
  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    /*
     * Keep retina sharpness, but don't let very high-DPI
     * devices explode canvas pixel count.
     */
    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    canvas.width =
      Math.round(width * dpr);

    canvas.height =
      Math.round(height * dpr);

    canvas.style.width =
      `${width}px`;

    canvas.style.height =
      `${height}px`;

    ctx.scale(dpr, dpr);

    const colors = {
      border:
        readCssVar(
          "--border",
          "#cccccc"
        ),

      foreground:
        readCssVar(
          "--foreground",
          "#111111"
        ),

      muted:
        readCssVar(
          "--muted-foreground",
          "#6b6b6b"
        ),

      card:
        readCssVar(
          "--card",
          "#ffffff"
        ),

      accent:
        readCssVar(
          "--accent",
          "#d0d0d0"
        ),
    };

    /*
     * ----------------------------------------
     * STATIC BOARD BUFFER
     * ----------------------------------------
     *
     * Pegs, teeth, cup dividers, bin outlines,
     * multiplier labels, and the top drop rail
     * never move.
     *
     * Render them once and reuse the resulting
     * bitmap every frame.
     */
    const staticCanvas =
      document.createElement("canvas");

    staticCanvas.width =
      canvas.width;

    staticCanvas.height =
      canvas.height;

    const staticCtx =
      staticCanvas.getContext("2d");

    if (!staticCtx) {
      return;
    }

    staticCtx.scale(dpr, dpr);

    /*
     * Pegs.
     */
    staticCtx.fillStyle =
      colors.muted;

    staticCtx.globalAlpha =
      0.55;

    staticCtx.beginPath();

    for (const peg of pegs) {
      staticCtx.moveTo(
        peg.x + peg.r,
        peg.y
      );

      staticCtx.arc(
        peg.x,
        peg.y,
        peg.r,
        0,
        Math.PI * 2
      );
    }

    staticCtx.fill();

    staticCtx.globalAlpha =
      1;

    /*
     * Wall teeth.
     */
    for (const tooth of teeth) {
      drawTooth(
        staticCtx,
        tooth.x,
        tooth.y,
        tooth.side,
        colors
      );
    }

    /*
     * Cup dividers.
     */
    staticCtx.fillStyle =
      colors.muted;

    staticCtx.globalAlpha =
      0.8;

    const dividerHeight = 18;

    for (
      const divider of dividers
    ) {
      staticCtx.beginPath();

      staticCtx.moveTo(
        divider.x - divider.r,
        binY
      );

      staticCtx.lineTo(
        divider.x - divider.r,
        binY + dividerHeight
      );

      staticCtx.quadraticCurveTo(
        divider.x,
        binY +
          dividerHeight +
          4,

        divider.x +
          divider.r,

        binY +
          dividerHeight
      );

      staticCtx.lineTo(
        divider.x +
          divider.r,

        binY
      );

      staticCtx.closePath();
      staticCtx.fill();
    }

    staticCtx.globalAlpha =
      1;

    /*
     * Bin outlines and labels.
     */
    staticCtx.strokeStyle =
      colors.border;

    staticCtx.lineWidth = 1;

    staticCtx.fillStyle =
      colors.muted;

    staticCtx.font =
      "9px 'IBM Plex Mono', monospace";

    staticCtx.textAlign =
      "center";

    for (const bin of bins) {
      staticCtx.strokeRect(
        bin.xStart,
        binY,
        bin.xEnd -
          bin.xStart,
        height - binY
      );

      const label =
        bin.multiplier === 0
          ? "0"
          : `${bin.multiplier}x`;

      staticCtx.fillText(
        label,

        (
          bin.xStart +
          bin.xEnd
        ) / 2,

        binY +
          (
            height -
            binY
          ) /
            2 +
          3
      );
    }

    /*
     * Top drop rail.
     */
    staticCtx.strokeStyle =
      colors.border;

    staticCtx.setLineDash(
      [2, 4]
    );

    staticCtx.beginPath();

    staticCtx.moveTo(
      0,
      4
    );

    staticCtx.lineTo(
      width,
      4
    );

    staticCtx.stroke();

    staticCtx.setLineDash([]);

    /*
     * ----------------------------------------
     * LIVE LOOP
     * ----------------------------------------
     */

    const FRAME_INTERVAL =
      1000 / 60;

    let running = false;
    let lastFrame = 0;

    const draw =
      (now: number) => {
        /*
         * Cap simulation/rendering at 60 Hz.
         *
         * Without this, requestAnimationFrame can
         * run at 120 Hz on high-refresh displays.
         */
        if (
          lastFrame !== 0 &&
          now - lastFrame <
            FRAME_INTERVAL
        ) {
          rafRef.current =
            requestAnimationFrame(
              draw
            );

          return;
        }

        const elapsed =
          now - lastFrame;

        lastFrame =
          lastFrame === 0
            ? now
            : now -
              (
                elapsed %
                FRAME_INTERVAL
              );

        /*
         * Physics events are only used for sound.
         */
        const events:
          StepEvent[] = [];

        const balls =
          ballsRef.current;

        const previousBallCount =
          balls.length;

        /*
         * Physics step.
         */
        for (
          let i = 0;
          i < balls.length;
          i++
        ) {
          stepBall(
            balls[i],
            collidables,
            width,
            binY,
            events
          );
        }

        /*
         * Collision sounds.
         */
        if (soundOnRef.current) {
          for (
            let i = 0;
            i < events.length;
            i++
          ) {
            const ev =
              events[i];

            if (
              ev.type === "peg"
            ) {
              playPegHit();
            } else if (
              ev.type === "wall"
            ) {
              playWallHit();
            }
          }
        }

        /*
         * Compact the balls array IN PLACE.
         *
         * This avoids allocating a new
         * stillFalling[] array every frame.
         */
        let writeIndex = 0;
        let totalWinnings = 0;

        for (
          let readIndex = 0;
          readIndex <
          balls.length;
          readIndex++
        ) {
          const ball =
            balls[readIndex];

          if (ball.alive) {
            balls[
              writeIndex++
            ] = ball;

            continue;
          }

          const idx =
            binIndexForX(
              ball.x,
              bins
            );

          const multiplier =
            bins[idx]
              ?.multiplier ??
            0;

          const winnings =
            multiplier *
            ball.betAmount;

          totalWinnings +=
            winnings;

          flashRef.current = {
            binIndex: idx,
            until:
              now + 260,
          };

          if (
            soundOnRef.current
          ) {
            playScore(
              multiplier
            );
          }
        }

        balls.length =
          writeIndex;

        const landedCount =
          previousBallCount -
          writeIndex;

        /*
         * React only needs an update when the
         * number of balls actually changes.
         *
         * Previously this state update happened
         * every animation frame.
         */
        if (
          landedCount > 0
        ) {
          setBallsInPlay(
            writeIndex
          );

          if (
            totalWinnings > 0
          ) {
            setBalance(
              (prev) =>
                prev +
                totalWinnings
            );

            setScore(
              (prev) =>
                prev +
                totalWinnings
            );

            setLastWin(
              totalWinnings
            );

            if (
              soundOnRef.current
            ) {
              playWin(
                totalWinnings
              );
            }
          } else {
            setLastWin(0);
          }
        }

        /*
         * Start each frame from the cached
         * static board.
         */
        ctx.clearRect(
          0,
          0,
          width,
          height
        );

        ctx.drawImage(
          staticCanvas,
          0,
          0,
          width,
          height
        );

        /*
         * Temporary bin flash.
         */
        const flash =
          flashRef.current;

        const flashActive =
          flash !== null &&
          flash.until > now;

        if (
          flash &&
          flashActive
        ) {
          const bin =
            bins[
              flash.binIndex
            ];

          if (bin) {
            ctx.fillStyle =
              colors.foreground;

            ctx.globalAlpha =
              0.18;

            ctx.fillRect(
              bin.xStart,
              binY,

              bin.xEnd -
                bin.xStart,

              height -
                binY
            );

            ctx.globalAlpha =
              1;
          }
        } else if (
          flash !== null
        ) {
          flashRef.current =
            null;
        }

        /*
         * Dynamic balls and trails.
         */
        ctx.fillStyle =
          colors.foreground;

        for (
          let i = 0;
          i < balls.length;
          i++
        ) {
          const ball =
            balls[i];

          const trail =
            ball.trail;

          for (
            let j = 0;
            j <
            trail.length;
            j++
          ) {
            const point =
              trail[j];

            ctx.beginPath();

            ctx.arc(
              point.x,
              point.y,
              ball.r * 0.6,
              0,
              Math.PI * 2
            );

            ctx.globalAlpha =
              (
                j /
                trail.length
              ) *
              0.15;

            ctx.fill();
          }

          ctx.globalAlpha =
            1;

          ctx.beginPath();

          ctx.arc(
            ball.x,
            ball.y,
            ball.r,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }

        ctx.globalAlpha = 1;

        /*
         * Only continue animation while there is
         * something that visibly changes.
         */
        if (
          balls.length > 0 ||
          flashActive
        ) {
          rafRef.current =
            requestAnimationFrame(
              draw
            );
        } else {
          running = false;
          rafRef.current =
            undefined;
        }
      };

    /*
     * Wake-up function.
     *
     * Multiple ball drops while the loop is
     * already active do NOT create extra RAF
     * loops.
     */
    const startLoop = () => {
      if (running) {
        return;
      }

      running = true;

      rafRef.current =
        requestAnimationFrame(
          draw
        );
    };

    startLoopRef.current =
      startLoop;

    /*
     * Paint the initial static board once.
     *
     * Since there are no balls, the loop stops
     * immediately after that frame.
     */
    startLoop();

    return () => {
      running = false;

      startLoopRef.current =
        null;

      if (
        rafRef.current !==
        undefined
      ) {
        cancelAnimationFrame(
          rafRef.current
        );
      }

      rafRef.current =
        undefined;
    };
  }, [
    width,
    height,
    binY,
    geometry,
  ]);

  /*
   * Auto game-over when player is completely
   * out of usable balance and all balls have
   * finished falling.
   */
  useEffect(() => {
    if (gameOver) {
      return;
    }

    if (
      balance <
        GAME_CONFIG.minBet &&
      ballsInPlay === 0
    ) {
      const timeout =
        setTimeout(() => {
          triggerGameOver();
        }, 400);

      return () =>
        clearTimeout(timeout);
    }
  }, [
    balance,
    ballsInPlay,
    gameOver,
    triggerGameOver,
  ]);

  function submitScore() {
    const name =
      nameInput
        .trim()
        .slice(0, 12) ||
      "PLAYER";

    const entry:
      LeaderboardEntry = {
      name,
      score,

      date:
        new Date()
          .toISOString()
          .slice(0, 10),
    };

    const updated =
      saveLeaderboardEntry(
        entry
      );

    const placement =
      getLeaderboardPlacement(
        entry
      );

    setLeaderboard(updated);
    setSubmittedEntry(entry);
    setSubmittedPlacement(
      placement
    );

    setScoreSubmitted(true);
  }

  const canEndGame =
    !gameOver &&
    ballsInPlay === 0;

  return (
    <div
      className="select-none"
      style={{ width }}
    >
      {/* HUD */}
      <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
        <div className="flex items-center gap-3 min-w-0 overflow-hidden whitespace-nowrap">
          <span>
            Balance{" "}
            <span className="text-foreground">
              {formatMoney(
                balance
              )}
            </span>
          </span>

          <span>
            Score{" "}
            <span className="text-foreground">
              {formatMoney(
                score
              )}
            </span>
          </span>

          <span>
            Balls{" "}
            <span className="text-foreground">
              {
                ballsInPlay
              }
            </span>
          </span>

          {lastWin !==
            null &&
            lastWin > 0 && (
              <span className="text-green-500 animate-pulse flex-shrink-0">
                +
                {formatMoney(
                  lastWin
                )}
              </span>
            )}

          {lastWin === 0 &&
            ballsInPlay ===
              0 && (
              <span className="text-red-500 flex-shrink-0">
                -
                {formatMoney(
                  betAmount
                )}
              </span>
            )}
        </div>

        <button
          onClick={
            triggerGameOver
          }
          disabled={
            !canEndGame
          }
          title={
            ballsInPlay > 0
              ? "Wait for balls to land"
              : "End the game"
          }
          className="flex-shrink-0 border border-border px-2 py-0.5 hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          End Game
        </button>
      </div>

      {/* Bet controls */}
      <div className="flex items-center gap-2 mb-2 flex-nowrap overflow-x-auto">
        <button
          onClick={() =>
            setBetPercentage(
              0.1
            )
          }
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          10%
        </button>

        <button
          onClick={() =>
            setBetPercentage(
              0.25
            )
          }
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          25%
        </button>

        <button
          onClick={() =>
            setBetPercentage(
              0.5
            )
          }
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          50%
        </button>

        <button
          onClick={() =>
            setBetPercentage(
              0.75
            )
          }
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          75%
        </button>

        <button
          onClick={() =>
            setBetPercentage(1)
          }
          className="px-2 py-1 border border-border text-xs hover:bg-secondary transition-colors flex-shrink-0"
        >
          Max
        </button>

        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[10px] text-muted-foreground">
            $
          </span>

          <input
            type="number"
            value={customBet}
            onChange={
              handleBetChange
            }
            onBlur={
              handleBetBlur
            }
            min={
              GAME_CONFIG.minBet
            }
            max={balance}
            step={0.01}
            className="w-20 px-2 py-1 border border-border bg-transparent text-center font-mono text-xs focus:outline-none focus:border-foreground"
            placeholder="Amount"
          />
        </div>

        {!compact && (
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <span className="text-[9px] text-muted-foreground">
              Vol
            </span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={
                handleVolumeChange
              }
              className="w-16 h-1 bg-border rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Board */}
      <div className="relative border border-border bg-card/40">
        <canvas
          ref={canvasRef}
          onClick={
            handleCanvasClick
          }
          onTouchStart={
            handleCanvasTouch
          }
          className="block cursor-crosshair"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Game Over
            </p>

            <p className="text-2xl font-semibold">
              {formatMoney(
                score
              )}
            </p>

            <p className="text-xs text-muted-foreground">
              Final Balance:{" "}
              {formatMoney(
                balance
              )}
            </p>

            {!scoreSubmitted && (
              <div className="flex flex-col items-center gap-2 w-full max-w-[220px]">
                {qualifiesHighScore && (
                  <p className="font-mono text-[9px] tracking-widest uppercase text-foreground">
                    New high
                    score!
                  </p>
                )}

                <input
                  value={
                    nameInput
                  }
                  onChange={(e) =>
                    setNameInput(
                      e.target
                        .value
                    )
                  }
                  maxLength={12}
                  placeholder="Your name"
                  className="w-full bg-input-background border border-border px-2 py-1.5 text-sm text-center font-mono uppercase tracking-wider outline-none focus:border-foreground"
                />

                <button
                  onClick={
                    submitScore
                  }
                  className="w-full bg-foreground text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-foreground/80 transition-colors"
                >
                  Save score
                </button>
              </div>
            )}

            {scoreSubmitted &&
              submittedEntry && (
                <div className="flex flex-col items-center gap-1 w-full max-w-[220px]">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
                    Your score
                  </p>

                  <div className="flex items-center justify-between w-full border border-border px-3 py-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      #
                      {submittedPlacement ??
                        "?"}
                    </span>

                    <span className="font-mono text-xs text-foreground">
                      {formatMoney(
                        submittedEntry.score
                      )}
                    </span>
                  </div>

                  {submittedPlacement &&
                    submittedPlacement >
                      10 && (
                      <p className="font-mono text-[8px] tracking-wider uppercase text-muted-foreground">
                        Outside the
                        top 10
                      </p>
                    )}
                </div>
              )}

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={
                  resetGame
                }
                className="font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 border border-border hover:bg-secondary transition-colors"
              >
                Play again
              </button>

              {onExit && (
                <button
                  onClick={
                    onExit
                  }
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
          Click the top rail
          to drop a ball
        </p>
      )}

      {showLeaderboard && (
        <div className="mt-3 border border-border bg-card/60 p-3">
          <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-2">
            High scores
          </p>

          {leaderboard.length ===
          0 ? (
            <p className="text-xs text-muted-foreground font-light">
              No scores yet.
              Play a game!
            </p>
          ) : (
            <ol className="space-y-1">
              {leaderboard.map(
                (
                  entry,
                  i
                ) => (
                  <li
                    key={`${entry.name}-${entry.date}-${i}`}
                    className="flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-muted-foreground">
                      {i + 1}.{" "}
                      {
                        entry.name
                      }
                    </span>

                    <span className="text-foreground">
                      {formatMoney(
                        entry.score
                      )}
                    </span>
                  </li>
                )
              )}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}