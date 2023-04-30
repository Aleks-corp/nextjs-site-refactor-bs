import styles from './Button.module.css';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

const Button = ({ type, onClick, children }: ButtonProps) => (
  <button className={styles.Button} type={type} onClick={onClick}>
    {children}
  </button>
);

export default Button;
