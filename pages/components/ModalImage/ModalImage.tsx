import React from 'react';
import styles from './ModalImage.module.css';
import Image from 'next/image';
// import { CgClose } from 'react-icons/cg';

const ModalImage = ({ src, alt }) => (
  <Image
    className={styles.ModalImage}
    src={src}
    alt={alt}
    width={800}
    height={500}
    loading="lazy"
  />
);

export default ModalImage;
