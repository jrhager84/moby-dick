export type Row = [
  string,
  number
]

export type Table = {
  items: any
  limit: number
  totalWords?: number | null
}