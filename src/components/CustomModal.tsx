import { useEffect } from "react";
import { CustomModalTypes } from "../types";

export default function CustomModal({ children, show, onHide }: CustomModalTypes) {
  useEffect(() => {
    function handleEscClick(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onHide();
      }
    }

    if (show) {
      window.addEventListener("keydown", handleEscClick);
    } else {
      window.removeEventListener("keydown", handleEscClick)
      onHide(); // controls show state value
    }
  }, [show]);

  return (
    <dialog id="custom_modal" className={`modal ${show && "modal-open"}`}>
      {children}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onHide}>close</button>
      </form>
    </dialog>
  )
}
