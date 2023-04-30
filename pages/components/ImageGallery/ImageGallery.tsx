import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import styles from './ImageGallery.module.css';

interface ImageGalleryLayout {
  imageGalleryList: {
    id: number;
    webformatURL: string;
    tags: string;
  }[];
  onClickIdSelect: Function;
}

const ImageGallery = ({
  imageGalleryList,
  onClickIdSelect,
}: ImageGalleryLayout) => (
  <ul className={styles.ImageGallery}>
    {imageGalleryList.map((imageGalleryItm) => (
      <li
        className={styles.ImageGalleryItem}
        key={imageGalleryItm.id}
        onClick={() => onClickIdSelect(imageGalleryItm.id)}
      >
        <ImageGalleryItem {...imageGalleryItm} />
      </li>
    ))}
  </ul>
);
export default ImageGallery;
