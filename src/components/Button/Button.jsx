import { ButtonLoad } from './Button.styled';

export const Button = ({ onClick }) => {
  return (
    <ButtonLoad type="button" onClick={onClick}>
      Load more
    </ButtonLoad>
  );
};
