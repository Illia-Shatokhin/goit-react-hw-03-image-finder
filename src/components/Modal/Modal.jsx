import { ModalWindow, ModalWindowImg, Overlay } from './Modal.styled';

export const Modal = ({ largeImage, closeModal }) => {
  return (
    <Overlay onClick={closeModal}>
      <ModalWindow>
        <ModalWindowImg src={largeImage} alt={largeImage} />
      </ModalWindow>
    </Overlay>
  );
};
