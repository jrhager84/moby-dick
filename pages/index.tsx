import { useRef, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'

// Components
import ResultsTable from '../components/ResultsTable'

// Styles
import styles from '../styles/Home.module.scss'

// Utils
import { processStopWords, processTextDocument } from '../util/fileProccessor'

const Home = () => {
  const [fileAdded, setFileAdded] = useState<boolean>(false)
  const [inputFile, setInputFile] = useState<File | undefined | null>(null)
  const [stopWords, setStopWords] = useState<File | undefined | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)
  const [results, setResults] = useState<[string, number][]>([])
  const [topSize, setTopSize] = useState<number>(100)
  const totalWords = useRef<number | null>(null)


  // Functions
  const handleInputFileChange = (file: File) => {
    setInputFile(file)
  }

  const handleStopWordFileChange = (file: File) => {
    setStopWords(file)
  }

  const handleResetValues = () => {
    setResults([])
    setInputFile(null)
    setStopWords(null)
    setFileAdded(prev => !prev)
  }
  
  const processTextFiles = async (e: any) => {
    e.preventDefault()
    if (!!!inputFile) return
    setProcessing(true)

    // Hash  Map
    let words = new Map<string, number>()

    // Process stop words first (if they exist)
    try {
      if (!!stopWords) words = await processStopWords(words, stopWords)
      const processedText = await processTextDocument(words, inputFile)
      console.log('processed text: ', processedText)
  
      // Set results and clear flags
      totalWords.current = processedText.totalWords
      setResults(processedText.sortedArray)
    } catch(e) {
      console.error('Error processing words')
    } finally {
      // UI State reset hook (known issue with drag and drop package)
      setFileAdded(prev => !prev)
      setProcessing(false)
    }
  }

  return (
    <div className={['medium', styles.container].join(" ")}>
      <h1 data-cy="title">Word Evaluator</h1>
      <div className={styles.formContainer}>
        <form data-id="input-form" id="input-form" onSubmit={processTextFiles}>
          <div className={styles.fileDropWrapper}>
            <div data-testid="inputFileUploader">
              <FileUploader
                data-cy="input"
                fileOrFiles={fileAdded}
                name="inputFile"
                accept=".txt"
                label="Upload or drag your txt to analyze"
                type="file"
                types={["TXT"]}
                handleChange={handleInputFileChange}
              />
              <p>{inputFile?.name ? inputFile.name : ''}</p>
            </div>
            <div>
              <FileUploader
                data-cy="input"
                fileOrFiles={fileAdded}
                name="stopWordFile"
                label="Upload or drag your stop words"
                type="file"
                types={["TXT"]}
                handleChange={handleStopWordFileChange}
              />
              <p>{stopWords?.name ? stopWords.name : ''}</p>
            </div>
          </div>
          <div className={styles.submitContainer}>
            <button data-cy="submit-btn" disabled={!!results.length || !!!inputFile || !!processing} type='submit' onClick={processTextFiles}>Submit</button>
            {!!results.length && <button data-cy="reset-btn" onClick={handleResetValues}>Reset</button>}
          </div>
        </form>
      </div>
      <div>
        {!!processing && 
          <div>
            Loading... This may take up to 10 seconds...
          </div>
        }
        {!!results.length && <ResultsTable items={results} limit={topSize} totalWords={totalWords.current}/> }
      </div>
    </div>
  )
}

export default Home