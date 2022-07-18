import styles from './App.module.css';

export function App() {
  return (
    <div className={styles['container']}>
      <svg>
        <g>
          <rect width="100" height="400"></rect>
        </g>
      </svg>
    </div>
  );
}

export default App;
