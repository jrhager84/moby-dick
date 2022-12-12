import React, { useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { FileDrop } from 'react-file-drop'

export default function Home() {
  const fileDropRef = useRef(null)

  // Functions
  const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
  }
  return (
    <div className={styles.container}>
      <div>
        <FileDrop>
          <div className='file-drop'>
            <input
              accept="text/plain"
              ref={fileDropRef}
              type="file"
              className="invisible"
              onChange={handleInputFileChange}
            />
          </div>
        </FileDrop>
      </div>
    </div>
  )
}
