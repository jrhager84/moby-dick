// Types
import { ProcessedTextFile } from "../types/fileProcessorTypes"

// Add stop words to the referenced set
export const processStopWords = async (words: Map<string, number>, stopWords: File): Promise<Map<string, number>> => {
  return new Promise((resolve, reject) => {
    let stopWordReader = new FileReader()

    stopWordReader.onload = (event) => {
      let str = event?.target?.result?.toString()
      if (!!str) {
        // We want to slice the string by words
        const arr = str.match(/([A-Z,a-z])\w+/g)

        // Add all words to hash map lowercase (case insensitive)
        arr?.forEach(word => {
          words.set(word.toLowerCase(), -1)
        })
      }
      console.log('words processed: ', words)
      resolve(words)
    }

    stopWordReader.onerror = (err) => {
      reject(err)
    }
    stopWordReader.readAsText(stopWords)
  })
}

// Analyzes text document and returns the sorted array along with the total word count
export const processTextDocument = async (words: Map<string, number>, inputFile: File): Promise<ProcessedTextFile> => {
  console.log("we're processing the file")
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader()
    let totalWords
    
    fileReader.onload = (event) => {
      let str = event?.target?.result?.toString()
      if (!!str) {
        // We want to slice the string by words
        const arr = str.match(/([A-Z,a-z'])\w+/g)
        totalWords = arr?.length ? arr.length + 1 : null
        
        // Add all words to hash map lowercase (case insensitive)
        arr?.forEach(word => {
          // Set current word (to reduce lookups)
          let currWord = words.get(word.toLowerCase())

          // If word is flagged don't count it
          if (currWord == -1) {
            return
          }
          // If word isn't in yet, set to 1
          else if (currWord == null || currWord == undefined) {
            words.set(word.toLowerCase(), 1)
          }
          // If word is being counted already
          else if (currWord >= 1) {
            words.set(word.toLowerCase(), currWord + 1)
          }
        })
        
        resolve({
          sortedArray: convertMapToArray(words),
          totalWords: totalWords ?? null
        })
      }
    }

    fileReader.onerror = (err) => {
      reject(err)
    }

    fileReader.readAsText(inputFile)
  })
}

// Abstracted in case other function/component may use it
export const convertMapToArray = (words: Map<string, number>): [string, number][] | null => {
  // Convert hash/set to array, filter out stop words, sort by occurence
  if (!!!words) return null
  try {
    const arr = Array.from(words?.entries())?.filter(([_, value]) => value > 0).sort(([aKey, aValue], [bKey, bValue]) => bValue - aValue)
    return !!arr ? arr : []
  } catch(e) {
    console.log('Error with conversion')
    return []
  }
}