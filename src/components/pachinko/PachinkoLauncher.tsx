// PachinkoLauncher.tsx
import { useEffect, useState } from "react";
import { ArrowLeft, Volume2, VolumeX, Trophy } from "lucide-react";
import DraggableWindow from "./DraggableWindow";
import PachinkoGame from "./PachinkoGame";

interface PachinkoLauncherProps {
  isOpen: boolean;
  onClose: () => void;
}

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches || window.innerWidth < 768);
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return isTouch;
}

export default function PachinkoLauncher({ isOpen, onClose }: PachinkoLauncherProps) {
  const isTouch = useIsTouchDevice();

  // Lifted out of PachinkoGame so the sound/scores toggles can live in the
  // window title bar (desktop) and the fullscreen header (mobile) instead
  // of taking up room in the HUD.
  const [soundOn, setSoundOn] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  if (!isOpen) return null;

  const headerActions = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setSoundOn((s) => !s)}
        aria-label={soundOn ? "Mute sound" : "Unmute sound"}
        title={soundOn ? "Mute sound" : "Unmute sound"}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
      </button>
      <button
        onClick={() => setShowLeaderboard((s) => !s)}
        aria-label="Toggle high scores"
        title="High scores"
        className={
          showLeaderboard
            ? "text-foreground transition-colors"
            : "text-muted-foreground hover:text-foreground transition-colors"
        }
      >
        <Trophy size={13} />
      </button>
    </div>
  );

  if (isTouch) {
    const boardWidth = Math.min(window.innerWidth - 32, 420);
    return (
      <div className="fixed inset-0 z-[70] bg-background flex flex-col">
        <div className="flex items-center justify-between gap-3 px-4 h-14 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              aria-label="Back"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Pachinko
            </span>
          </div>
          {headerActions}
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 py-6">
          <PachinkoGame
            width={boardWidth}
            onExit={onClose}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((s) => !s)}
            showLeaderboard={showLeaderboard}
            onToggleLeaderboard={() => setShowLeaderboard((s) => !s)}
          />
        </div>
      </div>
    );
  }

  return (
    <DraggableWindow
      title="Pachinko"
      onClose={onClose}
      headerActions={headerActions}
    >
      <PachinkoGame
        width={400}
        compact
        onExit={onClose}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn(s => !s)}
        showLeaderboard={showLeaderboard}
        onToggleLeaderboard={() => setShowLeaderboard(s => !s)}
      />
    </DraggableWindow>
  );
}