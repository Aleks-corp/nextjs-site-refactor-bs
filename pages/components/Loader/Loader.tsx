import React from 'react';
import { Oval, ProgressBar } from 'react-loader-spinner';
import styles from './Loader.module.css';

export const Loader = () => (
  <div className={styles.Loader}>
    <Oval
      height={80}
      width={80}
      color="#4fa94d"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#4fa94d"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  </div>
);
export const LoaderForMoreImage = () => (
  <div className={styles.Loader}>
    <ProgressBar
      height="80"
      width="80"
      ariaLabel="progress-bar-loading"
      wrapperStyle={{}}
      wrapperClass="progress-bar-wrapper"
      borderColor="#F4442E"
      barColor="#51E5FF"
    />
  </div>
);
