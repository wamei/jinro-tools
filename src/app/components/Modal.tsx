import { FC } from "react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={() => onClose()}
      />
      <div className="fixed inset-0 p-6 flex items-center justify-center pointer-events-none z-50">
        <div
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
};
