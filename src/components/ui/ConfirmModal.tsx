'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, Trash2, ShieldAlert } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
}: ConfirmModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
            <Trash2 className="w-6 h-6" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-lg">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-700 hover:bg-red-600 text-white font-bold border-red-500/40';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-500 text-white font-bold border-amber-400/40';
      case 'info':
      default:
        return 'bg-gold hover:bg-gold-light text-maroon font-bold';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {getIcon()}
        <div className="space-y-2 flex-1">
          <h3 className="font-cinzel text-lg font-bold text-gold-light">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-ivory/85 font-sans leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gold/20 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="border-gold/30 text-ivory/80 hover:text-ivory hover:bg-gold/10 text-xs"
        >
          {cancelText}
        </Button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-xs transition-all shadow-md flex items-center gap-1.5 ${getConfirmButtonVariant()} ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
