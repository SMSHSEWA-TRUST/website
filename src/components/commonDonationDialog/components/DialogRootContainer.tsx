import React from "react";

type DialogRootContainerProps = {
  children: React.ReactNode;
  onClose: () => void; // Add a prop to handle closing the dialog
};

const DialogRootContainer: React.FC<DialogRootContainerProps> = ({children, onClose}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const lockBodyScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const unlockBodyScroll = () => {
    document.body.style.overflow = "auto";
  };

  React.useLayoutEffect(() => {
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}>
      <div
        className="bg-white rounded-lg max-h-[90vh] shadow-xl overflow-auto"
        onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default DialogRootContainer;
