import Head from 'next/head';
import styles from '@/styles/Home.module.css';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageGallery from './components/ImageGallery';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader/Loader';
import LoaderForMoreImage from './components/Loader/LoaderBar';
import Modal from './components/Modal';
import ModalImage from './components/ModalImage';
import Button from './components/Button';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const constants = {
  PER_PAGE: 12,
  API_KEY: '30167952-193c03fd6f2705e99f5e35c58',
};

export default function App() {
  const [imageGalleryList, setImageGalleryList] = useState<any>([]);

  const [shownImageInModalSrc, setShownImageInModalSrc] = useState<string>('');
  const [shownImageInModalAlt, setShownImageInModalAlt] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [nextPage, setNextPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  interface ResponceList {
    data: {
      hits: [];
      totalHits: number;
    };
  }
  interface FormSubmitLayout {
    target: { value: string }[];
  }

  useEffect(() => {
    const { PER_PAGE, API_KEY } = constants;
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: ResponceList = await axios.get('', {
          params: {
            key: API_KEY,
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
  }, []);

  const fetchImageGallery = async (
    searchValue: string = '',
    page: number = 1
  ) => {
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

  function galleryMountFilteredById(newImageList: any[]) {
    //Поиск повторяющихся картинок и их фильтр
    //Чтобы не было проблем с повторяющимися ID
    const imageList = [...imageGalleryList];
    const imageIdList: any[] = [];
    imageList.map((imageItm) => imageIdList.push(imageItm.id));
    newImageList.map(
      (newImageItem: { id: any }) =>
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

  const onSubmitForm = async (
    event: React.SyntheticEvent & FormSubmitLayout
  ) => {
    event.preventDefault();
    const { PER_PAGE } = constants;
    if (searchValue === event.target[1].value.trim()) {
      event.target[1].value = '';
      return;
    }
    setIsLoading(true);
    // sourceAbortToken.current.abort();
    // sourceAbortToken.current = new AbortController();
    // console.log('sourceAbortFinder', sourceAbortToken.current);
    setSearchValue(event.target[1].value.trim());
    try {
      const response = await fetchImageGallery(event.target[1].value.trim());
      setImageGalleryList([...response.hits]);
      setTotalPages(Math.ceil(Number(response.totalHits) / PER_PAGE));
      setNextPage(2);

      event.target[1].value = '';
    } catch (error) {
      console.log('App ~ error', error);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const openImageInModal = (id: any) => {
    const selectedImage = imageGalleryList.find(
      (imageOption: { id: any }) => imageOption.id === id
    );

    setShownImageInModalSrc(selectedImage.largeImageURL);
    setShownImageInModalAlt(selectedImage.tags);

    toggleModal();
  };

  return (
    <>
      <Head>
        <title>Next App Image Finder</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SearchBar onSubmitForm={onSubmitForm} />
      <main className={styles.App}>
        {imageGalleryList.length > 0 && !isLoading && (
          <ImageGallery
            onClickIdSelect={openImageInModal}
            imageGalleryList={imageGalleryList}
          />
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
        {showModal && (
          <Modal onClose={toggleModal}>
            <ModalImage src={shownImageInModalSrc} alt={shownImageInModalAlt} />
          </Modal>
        )}
      </main>
      <footer className={styles.Footer}>
        Created By Next.JS & TypeScript-
        <a
          className={styles.FooterLink}
          href="https://github.com/Aleks-corp"
          target="_blank"
        >
          Aleks_corp
        </a>
      </footer>
    </>

    // <>
    //   <Head>
    //     <title>Create Next App</title>
    //     <meta name="description" content="Generated by create next app" />
    //     <meta name="viewport" content="width=device-width, initial-scale=1" />
    //     <link rel="icon" href="/favicon.ico" />
    //   </Head>
    //   <main className={`${styles.main} ${inter.className}`}>
    //     <div className={styles.description}>
    //       <p>
    //         Get started by editing&nbsp;
    //         <code className={styles.code}>pages/index.tsx</code>
    //       </p>
    //       <div>
    //         <a
    //           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //         >
    //           By{' '}
    //           <Image
    //             src="/vercel.svg"
    //             alt="Vercel Logo"
    //             className={styles.vercelLogo}
    //             width={100}
    //             height={24}
    //             priority
    //           />
    //         </a>
    //       </div>
    //     </div>

    //     <div className={styles.center}>
    //       <Image
    //         className={styles.logo}
    //         src="/next.svg"
    //         alt="Next.js Logo"
    //         width={180}
    //         height={37}
    //         priority
    //       />
    //     </div>

    //     <div className={styles.grid}>
    //       <a
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
    //         className={styles.card}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <h2>
    //           Docs <span>-&gt;</span>
    //         </h2>
    //         <p>
    //           Find in-depth information about Next.js features and&nbsp;API.
    //         </p>
    //       </a>

    //       <a
    //         href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
    //         className={styles.card}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <h2>
    //           Learn <span>-&gt;</span>
    //         </h2>
    //         <p>
    //           Learn about Next.js in an interactive course with&nbsp;quizzes!
    //         </p>
    //       </a>

    //       <a
    //         href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
    //         className={styles.card}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <h2>
    //           Templates <span>-&gt;</span>
    //         </h2>
    //         <p>
    //           Discover and deploy boilerplate example Next.js&nbsp;projects.
    //         </p>
    //       </a>

    //       <a
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
    //         className={styles.card}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <h2>
    //           Deploy <span>-&gt;</span>
    //         </h2>
    //         <p>
    //           Instantly deploy your Next.js site to a shareable URL
    //           with&nbsp;Vercel.
    //         </p>
    //       </a>
    //     </div>
    //   </main>
    // </>
  );
}
