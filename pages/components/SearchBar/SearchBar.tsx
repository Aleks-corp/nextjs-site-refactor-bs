import { BiSearch } from 'react-icons/bi';
import styles from './SearchBar.module.css';

const SearchBar = (props: { onSubmitForm: Function }) => (
  <header className={styles.Searchbar}>
    <form className={styles.SearchForm} onSubmit={(e) => props.onSubmitForm(e)}>
      <button type="submit" className={styles.SearchFormButton}>
        <BiSearch className={styles.SearchFormIcon} />
      </button>

      <input
        className={styles.SearchFormInput}
        name="searchValue"
        type="text"
        autoComplete="off"
        autoFocus
        placeholder="Search images and photos"
      />
    </form>
  </header>
);

export default SearchBar;
