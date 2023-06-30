import { ImageGalleryItemImage, Item } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({
  webformatURL,
  tags,
  openModal,
  largeImageURL,
}) => {
  return (
    <Item onClick={openModal}>
      <ImageGalleryItemImage
        src={webformatURL}
        alt={tags}
        data-large-image-url={largeImageURL}
      />
    </Item>
  );
};
