import { FC, useEffect, useRef, useState } from "react";
import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  trigger: ReactNode;
  className?: string;
  offsetX?: number;
  offsetY?: number;
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  trigger,
  className,
  offsetX,
  offsetY,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hideTooltip = (e: MouseEvent) => {
      const checkNode = (node: HTMLElement | null) => {
        if (node === null) {
          return false;
        }
        if (node === ref.current) {
          return true;
        }
        return checkNode(node.parentElement);
      };
      if (checkNode(e.target as HTMLElement)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("click", hideTooltip);
    return () => document.removeEventListener("click", hideTooltip);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        onClickCapture={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute bg-white border border-gray-400 rounded-lg shadow-lg p-4 z-50 ${className}`}
          style={{
            ...(offsetX ? { left: `${offsetX}px` } : {}),
            ...(offsetY ? { top: `${offsetY}px` } : {}),
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
