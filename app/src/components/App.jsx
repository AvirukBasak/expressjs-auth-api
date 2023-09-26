import React from 'react';
import printHelloWorld from '@/scripts/script';
import styles from '@/styles/App.module.css';

export default function App({ page }) {
  printHelloWorld();
  return (
    <>
      <div className={styles.app}>
        <h1>Demo App</h1>
        <p>This is a Paragraph</p>
        <img src="/images/background.jpg" />
      </div>
    </>
  );
}
