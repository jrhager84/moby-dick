export type Row = [
  string,
  number
]

export type Table = {
  items: Row[]
  limit: number
  totalWords?: number | null
}