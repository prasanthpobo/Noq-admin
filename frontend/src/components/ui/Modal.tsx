import React, { ReactNode, useEffect } from 'react';
import { HiX } from 'react-icons/hi';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

const SIZES = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export const Modal = ({ open, onClose, title, subtitle, children, footer, size = 'lg' }: ModalProps) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${SIZES[size]} flex flex-col max-h-[90vh]`}>
        <header className="flex items-start justify-between p-6 border-b border-[#E3EAF2]">
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A]">{title}</h2>
            {subtitle && <p className="text-sm text-[#6B7C93] mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <HiX size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-3 p-6 border-t border-[#E3EAF2] bg-[#F5F8FC] rounded-b-2xl">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};
