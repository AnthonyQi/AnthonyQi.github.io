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

interface Position {
  x: number;
  y: number;
}

export default function DraggableWindow({
  title,
  onClose,
  children,
  initialX,
  initialY,
  headerActions,
}: DraggableWindowProps) {
  const panelRef =
    useRef<HTMLDivElement>(null);

  const dragState =
    useRef({
      dx: 0,
      dy: 0,
      dragging: false,
    });

  /*
   * Cache window dimensions so pointermove does not
   * repeatedly query offsetWidth / offsetHeight.
   */
  const panelSizeRef =
    useRef({
      width: 360,
      height: 500,
    });

  const hasCustomPosition =
    initialX !== undefined ||
    initialY !== undefined;

  const [pos, setPos] =
    useState<Position>({
      x: initialX ?? 0,
      y: initialY ?? 0,
    });

  /*
   * Keep the latest position available synchronously.
   * React state itself updates asynchronously.
   */
  const posRef =
    useRef<Position>(pos);

  posRef.current = pos;

  /*
   * Pointer events may fire much faster than the screen
   * can visually update.
   *
   * Store the newest requested position here, then commit
   * it once per animation frame.
   */
  const pendingPosRef =
    useRef<Position>(pos);

  const dragRafRef =
    useRef<number | null>(null);

  function commitPosition(
    next: Position
  ) {
    posRef.current = next;
    pendingPosRef.current =
      next;

    setPos(next);
  }

  function measurePanel() {
    const panel =
      panelRef.current;

    if (!panel) {
      return;
    }

    panelSizeRef.current = {
      width:
        panel.offsetWidth,

      height:
        panel.offsetHeight,
    };
  }

  function clampToViewport(
    x: number,
    y: number
  ): Position {
    const {
      width,
      height,
    } = panelSizeRef.current;

    const margin = 24;

    return {
      x: Math.min(
        Math.max(
          margin,
          x
        ),

        Math.max(
          margin,

          window.innerWidth -
            width -
            margin
        )
      ),

      y: Math.min(
        Math.max(
          margin,
          y
        ),

        Math.max(
          margin,

          window.innerHeight -
            height -
            margin
        )
      ),
    };
  }

  function positionBottomRight() {
    measurePanel();

    const {
      width,
      height,
    } = panelSizeRef.current;

    const margin = 24;

    commitPosition({
      x: Math.max(
        margin,

        window.innerWidth -
          width -
          margin
      ),

      y: Math.max(
        margin,

        window.innerHeight -
          height -
          margin
      ),
    });
  }

  /*
   * Initial placement.
   */
  useEffect(() => {
    if (
      hasCustomPosition
    ) {
      measurePanel();
      return;
    }

    const frame =
      requestAnimationFrame(
        () => {
          positionBottomRight();
        }
      );

    return () => {
      cancelAnimationFrame(
        frame
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Keep cached dimensions current.
   *
   * The Pachinko leaderboard can change the panel's
   * height, so ResizeObserver is still useful.
   */
  useEffect(() => {
    const panel =
      panelRef.current;

    if (!panel) {
      return;
    }

    const observer =
      new ResizeObserver(
        () => {
          measurePanel();

          if (
            dragState.current
              .dragging
          ) {
            return;
          }

          if (
            !hasCustomPosition
          ) {
            positionBottomRight();
          } else {
            commitPosition(
              clampToViewport(
                posRef.current.x,
                posRef.current.y
              )
            );
          }
        }
      );

    observer.observe(panel);

    return () =>
      observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCustomPosition]);

  function onPointerDown(
    e: PointerEvent
  ) {
    /*
     * Update cached dimensions once at the beginning
     * of the drag instead of reading layout every move.
     */
    measurePanel();

    dragState.current.dragging =
      true;

    dragState.current.dx =
      e.clientX -
      posRef.current.x;

    dragState.current.dy =
      e.clientY -
      posRef.current.y;

    (
      e.currentTarget as Element
    ).setPointerCapture(
      e.pointerId
    );
  }

  function onPointerMove(
    e: PointerEvent
  ) {
    if (
      !dragState.current
        .dragging
    ) {
      return;
    }

    pendingPosRef.current =
      clampToViewport(
        e.clientX -
          dragState.current.dx,

        e.clientY -
          dragState.current.dy
      );

    /*
     * Pointer events can fire faster than refresh rate.
     * Only schedule one visual update per frame.
     */
    if (
      dragRafRef.current !==
      null
    ) {
      return;
    }

    dragRafRef.current =
      requestAnimationFrame(
        () => {
          commitPosition(
            pendingPosRef.current
          );

          dragRafRef.current =
            null;
        }
      );
  }

  function onPointerUp(
    e: PointerEvent
  ) {
    dragState.current.dragging =
      false;

    const target =
      e.currentTarget as Element;

    if (
      target.hasPointerCapture(
        e.pointerId
      )
    ) {
      target.releasePointerCapture(
        e.pointerId
      );
    }
  }

  /*
   * Escape closes the window.
   */
  useEffect(() => {
    function onEscape(
      e: KeyboardEvent
    ) {
      if (
        e.key === "Escape"
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      onEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onEscape
      );
    };
  }, [onClose]);

  /*
   * Keep the window inside the viewport after browser
   * resizes.
   */
  useEffect(() => {
    function onResize() {
      if (
        dragState.current
          .dragging
      ) {
        return;
      }

      measurePanel();

      if (
        !hasCustomPosition
      ) {
        positionBottomRight();
      } else {
        commitPosition(
          clampToViewport(
            posRef.current.x,
            posRef.current.y
          )
        );
      }
    }

    window.addEventListener(
      "resize",
      onResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        onResize
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCustomPosition]);

  /*
   * Clean up any pending drag animation frame.
   */
  useEffect(() => {
    return () => {
      if (
        dragRafRef.current !==
        null
      ) {
        cancelAnimationFrame(
          dragRafRef.current
        );
      }
    };
  }, []);

  return (
    <div
      ref={panelRef}
      className="fixed left-0 top-0 z-[70] max-h-[calc(100vh-48px)] border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      {/* Header */}
      <div
        onPointerDown={
          onPointerDown
        }
        onPointerMove={
          onPointerMove
        }
        onPointerUp={
          onPointerUp
        }
        className="flex shrink-0 items-center justify-between px-3 py-2 border-b border-border cursor-move bg-secondary/60 touch-none"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          {title}
        </span>

        <div
          className="flex items-center gap-3"
          onPointerDown={(
            e
          ) =>
            e.stopPropagation()
          }
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