import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import styles from './ImageGallery.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import LoaderForMoreImage from '../Loader/LoaderBar';
import Button from '../Button';

interface ImageGalleryLayout {
  id: number;
  webformatURL: string;
  tags: string;
  largeImageURL: string;
}

interface ResponceList {
  data: {
    hits: [];
    totalHits: number;
  };
}

axios.defaults.baseURL = 'https://pixabay.com/api/';
const constants = {
  PER_PAGE: 12,
  API_KEY: '30167952-193c03fd6f2705e99f5e35c58',
};

export default function ImageGallery({
  searchValue,
  openImageInModal,
}: {
  searchValue: string;
  openImageInModal: Function;
}) {
  const [imageGalleryList, setImageGalleryList] = useState<
    Array<ImageGalleryLayout>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const { PER_PAGE, API_KEY } = constants;
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: ResponceList = await axios.get('', {
          params: {
            key: API_KEY,
            q: searchValue,
            image_type: 'photo',
            orientation: 'horizontal',
            per_page: PER_PAGE,
            page: 1,
            signal: controller.signal,
          },
        });
        setImageGalleryList([...response.data.hits]);
        setTotalPages(Math.ceil(Number(response.data.totalHits) / PER_PAGE));
        setNextPage(2);
      } catch (error) {
        console.log('App ~ error', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [searchValue]);

  const fetchImageGallery = async (searchValue: string, page: number = 1) => {
    const response = await axios.get('', {
      params: {
        key: constants.API_KEY,
        q: searchValue,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: constants.PER_PAGE,
        page: page,
      },
    });

    return response.data;
  };

  function galleryMountFilteredById(newImageList: ImageGalleryLayout[]) {
    //Поиск повторяющихся картинок и их фильтр
    //Чтобы не было проблем с повторяющимися ID
    const imageList = [...imageGalleryList];
    const imageIdList: number[] = [];
    imageList.map((imageItm) => imageIdList.push(imageItm.id));
    newImageList.map(
      (newImageItem) =>
        !imageIdList.includes(newImageItem.id) && imageList.push(newImageItem)
    );
    //Добавление в state после проверки и фильтра
    setImageGalleryList(imageList);
  }

  const loadMoreImageHandler = async () => {
    try {
      setIsLoadMore(true);
      // sourceAbortToken.current.abort();
      // sourceAbortToken.current = new AbortController();
      // console.log('sourceAbortMore', sourceAbortToken.current);
      const response = await fetchImageGallery(searchValue, nextPage);
      galleryMountFilteredById(response.hits);
      //Добавление в state без проверки повторяющихся ID
      // this.setState({
      //   imageGalleryList: [...this.state.imageGalleryList, ...response.hits],
      // });
      setNextPage((prevState) => prevState + 1);
    } catch (error) {
      console.log('App ~ error', error);
    } finally {
      setIsLoadMore(false);
    }
  };

  const openInModal = (id: number) => {
    const selectedImage = imageGalleryList.find(
      (imageObj) => imageObj.id === id
    );
    if (!selectedImage) {
      return;
    }
    openImageInModal(selectedImage);
  };

  return (
    <>
      {imageGalleryList.length > 0 && !isLoading && (
        <ul className={styles.ImageGallery}>
          {imageGalleryList.map((imageGalleryItm) => (
            <li
              className={styles.ImageGalleryItem}
              key={imageGalleryItm.id}
              onClick={() => openInModal(imageGalleryItm.id)}
            >
              <ImageGalleryItem {...imageGalleryItm} />
            </li>
          ))}
        </ul>
      )}
      {isLoading && <Loader />}
      {imageGalleryList.length === 0 && (
        <p>Sorry, we did not find images, please try again</p>
      )}
      {isLoadMore ? (
        <LoaderForMoreImage />
      ) : (
        nextPage <= totalPages &&
        totalPages !== 0 &&
        !isLoading && (
          <Button type="button" onClick={loadMoreImageHandler}>
            Load More...
          </Button>
        )
      )}
    </>
  );
}

// ImageGallery.getStaticProps = async ({ req }: NextPageContext) => {
//   if (!req) {
//     return { imageGalleryList: null };
//   }

//   const response = await fetch(`https://.../images`);
//   const imageGalleryList: ImageGalleryLayout = await response.json();

//   return {
//     imageGalleryList,
//   };
// };
