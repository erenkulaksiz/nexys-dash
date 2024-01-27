import { useEffect } from "react";

import Portal from "@/components/Portal";
import Backdrop from "@/components/Modal/Backdrop";
import Content from "@/components/Modal/Content";
import View from "@/components/View";
import { MdClose } from "react-icons/md";
import type { ModalProps } from "./Modal.types";

export function Modal({
  isOpen,
  onClose,
  children,
  closeButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!isOpen) return null;

  return (
    <Portal portalName="nexys-modal">
      <Backdrop onClose={onClose}>
        <Content>
          {children}
          <View.If visible={closeButton}>
            <button className="absolute right-2 top-2 z-50" onClick={onClose}>
              <MdClose size={20} />
            </button>
          </View.If>
        </Content>
      </Backdrop>
    </Portal>
  );
}

export default Modal;
