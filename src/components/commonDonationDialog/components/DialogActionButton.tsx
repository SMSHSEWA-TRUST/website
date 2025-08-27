import React from "react";

type DialogActionProps = {
  handleClose: () => void;
  hanldeSubmit: () => void;
};

const DialogActionButton: React.FC<DialogActionProps> = ({handleClose, hanldeSubmit}) => {
  return (
    <div className="flex justify-end space-x-3">
      <button onClick={handleClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
        Cancel
      </button>
      <button className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700">Proceed</button>
    </div>
  );
};

export default DialogActionButton;
