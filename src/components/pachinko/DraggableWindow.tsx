import { useRef, useState, useEffect, type ReactNode, type PointerEvent } from "react";
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

/**
 * A floating, draggable glass panel styled to match the site's terminal
 * aesthetic. Distinct from the section-wrapping Window component, this one
 * is meant to sit above the page content and be moved around.
 */
export default function DraggableWindow({
  title,
  onClose,
  children,
  initialX,
  initialY,
  headerActions,
}: DraggableWindowProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ dx: number; dy: number; dragging: boolean }>({
    dx: 0,
    dy: 0,
    dragging: false,
  });
  const [pos, setPos] = useState({ x: initialX ?? 80, y: initialY ?? 80 });

  useEffect(() => {
    if (initialX === undefined || initialY === undefined) {
      const x = Math.max(24, window.innerWidth - 420);
      const y = Math.max(24, window.innerHeight - 560);
      setPos({ x, y });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clampToViewport(x: number, y: number) {
    const panel = panelRef.current;
    const w = panel?.offsetWidth ?? 360;
    const h = panel?.offsetHeight ?? 500;
    return {
      x: Math.min(Math.max(0, x), window.innerWidth - w),
      y: Math.min(Math.max(0, y), window.innerHeight - h),
    };
  }

  function onPointerDown(e: PointerEvent) {
    dragState.current.dragging = true;
    dragState.current.dx = e.clientX - pos.x;
    dragState.current.dy = e.clientY - pos.y;
    (e.target as Element).setPointerCapture(e.pointerId);
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
    (e.target as Element).releasePointerCapture(e.pointerId);
  }

  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="fixed z-[70] border border-border bg-card/90 backdrop-blur-md shadow-2xl"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex items-center justify-between px-3 py-2 border-b border-border cursor-move bg-secondary/60"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          {title}
        </span>
        {/* Stop propagation so clicking an action or the close button never
            gets mistaken for the start of a drag. */}
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
      <div className="p-3">{children}</div>
    </div>
  );
}