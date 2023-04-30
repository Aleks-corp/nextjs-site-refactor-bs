import styles from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({
  webformatURL,
  tags,
}: {
  webformatURL: string;
  tags: string;
}) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.ImageGalleryItemImage}
      src={webformatURL}
      alt={tags}
      loading="lazy"
    />
  );
};
export default ImageGalleryItem;
