import { ModalWindow, ModalWindowImg, Overlay } from './Modal.styled';
import PropTypes from 'prop-types';

export const Modal = ({ largeImage, closeModal }) => {
  return (
    <Overlay onClick={closeModal}>
      <ModalWindow>
        <ModalWindowImg src={largeImage} alt={largeImage} />
      </ModalWindow>
    </Overlay>
  );
};

Modal.propTypes = {
  largeImage: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
