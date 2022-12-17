import React, { useEffect, useMemo, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'

// Styles
import styles from '../styles/ResultsTable.module.scss'

// Types
import { Row, Table } from '../types/tableTypes'

const ResultsTable = ({items, limit = items.length < 100 ? items.length : 100, totalWords}: Table) => {
  // State
  const [results, setResults] = useState<Row[]>([])
  const [rowsPerPage, setRowsPerPage] = useState<number>(20)
  const [sorting, setSorting] = useState<SortingState>([])
  const [topSize, setTopSize] = useState(limit > items.length ? items.length : limit)
  const [topSizeInput, setTopSizeInput] = useState<number>(limit > items.length ? items.length : limit ?? 0)

  // Regex matcher
  const numMatchRegex = new RegExp(/^[1-9][0-9]*$/g)

  // Functions
  const handleTopSize = ({target: { value }}: React.BaseSyntheticEvent) => {
    // Handle error cases (non-number and larger/smaller than size)
    if (value != '' && !value.match(numMatchRegex)) return

    setTopSizeInput(value)
  }

  const handleTopSizeSubmit = () => {
    // If it's too high or low
    if (topSizeInput > items.length) {
      setTopSizeInput(items.length)
      setTopSize(items.length)
      return
    }
    if (topSizeInput <= 0) {
      setTopSize(1)
      setTopSizeInput(1)
    }

    console.log('not too high or low')

    setTopSizeInput(topSizeInput)
    setTopSize(topSizeInput)
  }

  const columns = useMemo<ColumnDef<Row>[]>(() => [
        {
          id: 'Word',
          accessorFn: info => info[0],
          cell: info => info.getValue(),
          header: () => 'Word'
        },
        {
          id: 'Occurence',
          accessorFn: info => info[1],
          cell: info => info.getValue(),
          header: () => 'Occurence'
        }
  ], [])

  // Table
  const table = useReactTable({
    data: results,
    columns,
    onSortingChange: setSorting,
    state: {
      sorting
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    // Set results to specified limit and slice when topSize changes
    setResults(items.slice(0, topSize <= items.length ? topSize : items.length - 1))
    if (items.length < topSize) setTopSize(items.length)
  }, [items, topSize])
  
  return (
    <div className='slim'>
      <div className={styles.topLine}>
      {!!totalWords && <p data-cy="num-results">Total Words: {totalWords}</p>}
      <p data-cy="top-num-title">Top {topSize} words</p>
      </div>
      {results && (
        <div>
          <table data-cy="results-table">
            <thead>
              {!!table.getHeaderGroups() && table?.getHeaderGroups()?.map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup?.headers?.map(header => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                          { ...{
                            className: header.column.getCanSort() ? 'can-sort' : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )},
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                              }[header.column.getIsSorted() as string] ?? null
                            }
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, rowsPerPage)
                .map((row, idx) => {
                  return (
                    <tr key={row.id} className={idx % 2 === 0 ? 'left-content' : 'right-content'}>
                      {row.getVisibleCells().map(cell => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        )
                      })
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div className="h-2" />
            <div className="flex items-center gap-2 table-buttons">
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
            </div>
            <div className="flex-row space-between" style={{marginTop: '3rem'}}>
              <div className="flex-column">
                <label>Num. of words to show:</label>
                <input data-cy="top-num-changer" placeholder={topSize} onChange={handleTopSize} value={topSizeInput ?? ''} />
              </div>
              <button data-cy="top-num-submit" style={{justifySelf: 'flex-end'}} onClick={() => setTopSize(handleTopSizeSubmit)}>Change</button>
            </div>
        </div>
        )}
    </div>
  )
  }

export default ResultsTable