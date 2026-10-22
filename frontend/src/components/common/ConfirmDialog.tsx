import React from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title=""
    size="sm"
    footer={
      <>
        <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div className="flex flex-col items-center text-center gap-3 py-2">
      <div className={`p-3 rounded-2xl ${danger ? 'bg-rose-500/10 text-rose-400' : 'bg-brand-500/10 text-brand-400'} border ${danger ? 'border-rose-500/20' : 'border-brand-500/20'}`}>
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description && <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>}
      </div>
    </div>
  </Modal>
);
