import { useEffect } from 'react';

import styles from './Modal.module.css';

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: Function;
}) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = (e: { code: string }) => {
    if (e.code === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (
    e: React.MouseEvent & { target: any; currentTarget: any }
  ) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <div className={styles.Overlay} onClick={handleBackdropClick}>
      <div className={styles.Modal}>{children}</div>
    </div>
  );
}
