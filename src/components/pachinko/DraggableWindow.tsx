import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type PointerEvent,
} from "react";

import { X } from "lucide-react";

interface DraggableWindowProps {
  title: string;
  onClose: () => void;
  children: ReactNode;

  initialX?: number;
  initialY?: number;

  /** Extra icon buttons rendered in the title bar, before the close button. */
  headerActions?: ReactNode;
}

export default function DraggableWindow({
  title,
  onClose,
  children,
  initialX,
  initialY,
  headerActions,
}: DraggableWindowProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const dragState = useRef<{
    dx: number;
    dy: number;
    dragging: boolean;
  }>({
    dx: 0,
    dy: 0,
    dragging: false,
  });

  const hasCustomPosition =
    initialX !== undefined || initialY !== undefined;

  const [pos, setPos] = useState({
    x: initialX ?? 0,
    y: initialY ?? 0,
  });

  function positionBottomRight() {
    const panel = panelRef.current;
    if (!panel) return;

    const margin = 24;

    const w = panel.offsetWidth;
    const h = panel.offsetHeight;

    setPos({
      x: Math.max(margin, window.innerWidth - w - margin),
      y: Math.max(margin, window.innerHeight - h - margin),
    });
  }

  useEffect(() => {
    if (hasCustomPosition) return;

    requestAnimationFrame(() => {
      positionBottomRight();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Reposition the window whenever its size changes.
   *
   * This is what makes the window move upward when the
   * leaderboard appears.
   */
  useEffect(() => {
    if (hasCustomPosition) return;

    const panel = panelRef.current;
    if (!panel) return;

    const observer = new ResizeObserver(() => {
      if (dragState.current.dragging) return;

      const margin = 24;
      const width = panel.offsetWidth;
      const height = panel.offsetHeight;

      setPos({
        x: Math.max(margin, window.innerWidth - width - margin),
        y: Math.max(margin, window.innerHeight - height - margin),
      });
    });

    observer.observe(panel);

    return () => observer.disconnect();
  }, [hasCustomPosition]);

  function clampToViewport(x: number, y: number) {
    const panel = panelRef.current;

    const w = panel?.offsetWidth ?? 360;
    const h = panel?.offsetHeight ?? 500;

    const margin = 24;

    return {
      x: Math.min(
        Math.max(margin, x),
        Math.max(margin, window.innerWidth - w - margin),
      ),
      y: Math.min(
        Math.max(margin, y),
        Math.max(margin, window.innerHeight - h - margin),
      ),
    };
  }

  function onPointerDown(e: PointerEvent) {
    dragState.current.dragging = true;

    dragState.current.dx = e.clientX - pos.x;
    dragState.current.dy = e.clientY - pos.y;

    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragState.current.dragging) return;

    const next = clampToViewport(
      e.clientX - dragState.current.dx,
      e.clientY - dragState.current.dy,
    );

    setPos(next);
  }

  function onPointerUp(e: PointerEvent) {
    dragState.current.dragging = false;

    const target = e.currentTarget as Element;

    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }
  }

  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [onClose]);

  useEffect(() => {
    function onResize() {
      if (dragState.current.dragging) return;

      if (!hasCustomPosition) {
        positionBottomRight();
      } else {
        setPos((current) =>
          clampToViewport(current.x, current.y),
        );
      }
    }

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCustomPosition]);

  return (
    <div
      ref={panelRef}
      className="fixed z-[70] max-h-[calc(100vh-48px)] border border-border bg-card/90 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden"
      style={{
        left: pos.x,
        top: pos.y,
      }}
    >
      {/* Header */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex shrink-0 items-center justify-between px-3 py-2 border-b border-border cursor-move bg-secondary/60 touch-none"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          {title}
        </span>

        <div
          className="flex items-center gap-3"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {headerActions}

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 overflow-y-auto overscroll-contain p-3">
        {children}
      </div>
    </div>
  );
}