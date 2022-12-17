import { processTextDocument, processStopWords, convertMapToArray } from '../util/fileProccessor'

import '@testing-library/jest-dom'
import { expect } from '@jest/globals'

// Mock data
import { inputFileMock, stopWordsMock } from './mocks/mockFiles'

// Global files for testing
let words = new Map<string, number>()

const inputFileBlob = new Blob([inputFileMock], {
  type: 'text/plain'
})

const inputFile = new File([inputFileBlob], "../cypress/fixtures/test.txt", {
  type: "text/plain"
})

const stopWordsBlob = new Blob([stopWordsMock], {
  type: 'text/plain'
})

const stopWords = new File([stopWordsBlob], 'stop-words.txt', {
  type: 'text/plain'
})

beforeEach(() => {
  // Re initialize words map
  words = new Map<string, number>()
})

describe("Convert map to array function", () => {
  it("should convertSetToArray should convert a Map<string, number> into an Array [string, number][]", () => {
    const testSet: Map<string, number> = new Map([["test", 20], ["file", 1]])
    const actualResult = convertMapToArray(testSet)
    const expectedResult = [["test", 20], ["file", 1]]
    expect(actualResult).toEqual(expectedResult)
  })

  it("Should filter out all negative values (stop words)", () => {
    const testSet: Map<string, number> = new Map([["test", 20], ["flagged", -1], ["file", 1]])
    const actualResult = convertMapToArray(testSet)
    const expectedResult = [["test", 20], ["file", 1]]
    expect(actualResult).toEqual(expectedResult)
  })

  it("should return the array sorted largest first", () => {
    const testSet: Map<string, number> = new Map([["test", 2], ["file", 10]])
    const actualResult = convertMapToArray(testSet)
    const expectedResult = [["file", 10], ["test", 2]]
    expect(actualResult).toEqual(expectedResult)
  })
})

describe("Test stop words map functions, as well as processTextFile", () => {

  const expectedStopWordsMap = new Map<string, number>([["test", 3], ["file", 2]])

  it("should accept an input file", async () => {
    const processedStopWords = await processStopWords(words, stopWords)
    expect(processedStopWords).toBeTruthy
  })

  it("should accept a stop word file", async () => {
    const processedInputFile = await processTextDocument(words, inputFile)
    expect(processTextDocument).toBeTruthy
  })

  it("should return a map of all negative values", async () => {
    const stopWordMap = await processStopWords(words, stopWords)
    const expectedResult = new Map<string, number>([["flagged", -1]])
    expect(stopWordMap).toEqual(expectedResult)
  })

  it("should return an object with an array of all words (without stop-words list)", async () => {
    const processedText = await processTextDocument(words, inputFile)
    const expectedReturn = [['test', 3], ['file', 2], ['flagged', 2]]
    expect(processedText.sortedArray).toEqual(expectedReturn)
  })

  it("should have processTextFile add values to map that aren't flagged", async () => {
    await processStopWords(words, stopWords)
    const processedText = await processTextDocument(words, inputFile)
    expect(processedText.sortedArray).toEqual([['test', 3], ['file', 2]])
  })
})