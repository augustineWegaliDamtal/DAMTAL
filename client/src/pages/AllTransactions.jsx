import React, { useEffect, useState, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule
} from 'ag-grid-community';
import { Link } from 'react-router-dom';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  NumberFilterModule,
  DateFilterModule,
  TextFilterModule,
]);

export const DeleteButtonRenderer = ({ data, profile, handleDelete }) => {
  const role = profile?.role?.toLowerCase();
  const canDelete = role === 'admin' || role === 'agent';

  if (!canDelete) {
    return <span className="text-gray-400 italic text-xs">No access</span>;
  }
  if (!data?._id) {
    return <span className="text-yellow-400 italic text-xs">No ID found</span>;
  }

  return (
    <button
      onClick={() => handleDelete(data._id)}
      className="text-red-500 text-xs hover:underline"
    >
      Delete
    </button>
  );
};

const mockProfile = { role: 'admin' };

const TransactionsTable = ({ profile }) => {
  const [rows, setRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [isDeleting, setIsDeleting] = useState(false);
  const gridApiRef = useRef(null);

  const token = localStorage.getItem('token');
  const userRole = profile?.role?.toLowerCase();
  const canDelete = userRole === 'admin' || userRole === 'agent';

  const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

  // Manual filter application
const applyGridFiltersToRows = (allRows, api) => {
  const model = api.getFilterModel();
  if (!model || !Object.keys(model).length) return allRows;

  return allRows.filter(row =>
    Object.entries(model).every(([field, filter]) => {
      const value = getNestedValue(row, field);

      if (filter.filterType === 'text') {
        const f = (filter.filter ?? '').toLowerCase();
        const v = String(value ?? '').toLowerCase();
        switch (filter.type) {
          case 'contains': return v.includes(f);
          case 'equals': return v === f;
          case 'startsWith': return v.startsWith(f);
          case 'endsWith': return v.endsWith(f);
        }
      }

      if (filter.filterType === 'number') {
        const num = Number(value);
        const fnum = Number(filter.filter);
        if (isNaN(num) || isNaN(fnum)) return false;
        switch (filter.type) {
          case 'equals': return num === fnum;
          case 'greaterThan': return num > fnum;
          case 'lessThan': return num < fnum;
        }
      }

      if (filter.filterType === 'date') {
        const rowDate = new Date(value);
        const fDate = new Date(filter.dateFrom);
        switch (filter.type) {
          case 'equals': return rowDate.toDateString() === fDate.toDateString();
          case 'lessThan': return rowDate < fDate;
          case 'greaterThan': return rowDate > fDate;
        }
      }

      return true;
    })
  );
};



  const handleDelete = async id => {
    if (!canDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/transact/deleteTransactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Delete failed');
      }

      const { message } = await res.json();
      alert(message || 'Transaction deleted');

      // remove from both data sets
      const remaining = rows.filter(tx => tx._id !== id);
      setRows(remaining);
      setVisibleRows(prev => prev.filter(tx => tx._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetch('/api/transact/getAllTransactions', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        // drop incomplete records
        const all = data.filter(
          tx => tx.clientId?.accountNumber && tx.agentId?.username
        );
        setRows(all);
        setVisibleRows(all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // Totals recalculated whenever visibleRows changes
  const [totals, setTotals] = useState({ deposit: 0, withdrawal: 0, balance: 0 });


  const columnDefs = useMemo(() => [
    {
      field: 'createdAt',
      headerName: 'Date',
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      valueFormatter: ({ value }) =>
        new Date(value).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
      filterParams: {
        comparator: (filterDate, cellValue) => {
          const d = new Date(cellValue);
          if (d.toDateString() === filterDate.toDateString()) return 0;
          return d < filterDate ? -1 : 1;
        }
      }
    },
    {
  field: 'clientId.accountNumber',
  headerName: 'Account #',
  filter: 'agTextColumnFilter',
  floatingFilter: true,
  valueGetter: ({ data }) => data.clientId?.accountNumber ?? '-',
  filterValueGetter: ({ data }) => data.clientId?.accountNumber ?? ''
}
,
   {
  field: 'clientId.name',
  headerName: 'Client Name',
  filter: 'agTextColumnFilter',
  floatingFilter: true,
  valueGetter: ({ data }) => data.clientId?.name ?? '-',
  filterValueGetter: ({ data }) => data.clientId?.name ?? ''
}
,
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      cellClassRules: {
        'deposit-type': p => p.value === 'deposit',
        'withdrawal-type': p => p.value === 'withdrawal'
      }
    },
    {
      field: 'amount',
      headerName: 'Amount (₵)',
      width: 130,
      valueFormatter: ({ value }) => `₵${Number(value).toFixed(2)}`,
      cellClass: params => {
        const withdraw = params.data?.type === 'withdrawal';
        const editable = profile?.role === 'admin';
        return `${editable ? 'custom-editable-cell' : ''} ${
          withdraw ? 'text-red-500 font-bold' : ''
        }`;
      }
    },
    {
      field: 'balanceAfter',
      headerName: 'Balance After',
      width: 130,
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
      valueFormatter: ({ value }) => `₵${Number(value).toFixed(2)}`
    },
  {
  field: 'agentId.username',
  headerName: 'Processed By',
  filter: 'agTextColumnFilter',
  floatingFilter: true,
  valueGetter: ({ data }) => data.agentId?.username ?? '-',
  filterValueGetter: ({ data }) => data.agentId?.username ?? ''
},
    {
      field: 'actions',
      headerName: 'Actions',
      editable: false,
      cellRenderer: DeleteButtonRenderer,
      cellRendererParams: { profile, handleDelete }
    }
  ], [profile]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
      placeholder: 'Filter...'
    },
    cellClass: params => {
      const withdraw = params.data?.type === 'withdrawal';
      return withdraw ? 'withdrawal-type' : '';
    }
  };

  return (
    <div className="px-4 py-6 mt-6">
      {loading
        ? <p>Loading transactions...</p>
        : (
          <>
            <p className="text-sm text-gray-500 mb-2 mt-6">
              Showing {visibleRows.length} transactions
            </p>

            <div className="mb-4 flex items-center gap-2 text-sm text-white">
              <label htmlFor="limitSelect">Show:</label>
              <select
                id="limitSelect"
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
                className="bg-neutral-900 border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={visibleRows.length}>All</option>
              </select>
            </div>

            <div style={{ maxHeight: '600px', overflow: 'auto' }}>
              <div className="ag-theme-alpine " style={{ background: '#0d0d0d' }}>
                <AgGridReact
                  rowData={visibleRows.slice(0, limit)}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  context={{ userRole }}
                  frameworkComponents={{ DeleteButtonRenderer }}
                  animateRows
                  startEditingOnCellClicked
                  stopEditingWhenCellsLoseFocus
                  domLayout="autoHeight"
                  rowHeight={35}
                  onGridReady={({ api }) => (gridApiRef.current = api)}
                  onFilterChanged={() => {
                    console.log('Filter changed');
                    const api = gridApiRef.current;
  const filtered = applyGridFiltersToRows(rows, api);
  setVisibleRows(filtered);

  let deposit = 0;
  let withdrawal = 0;

  filtered.forEach(row => {
    const amt = parseFloat(String(row.amount).replace(/[^\d.-]/g, ''));
    if (isNaN(amt)) return;

    const type = row.type?.toLowerCase();
    if (type === 'deposit') deposit += amt;
    else if (type === 'withdrawal') withdrawal += amt;
  });

  setTotals({
    deposit: Math.round(deposit),
    withdrawal: Math.round(withdrawal),
    balance: Math.round(deposit - withdrawal),
  });
                  }}
                />
              </div>
            </div>

            {visibleRows.length > 0 && (
              <p className="text-sm text-gray-600 mb-2 italic">
                Showing totals for{' '}
                <strong>
                  {visibleRows.every(r => r.agentId?.username === visibleRows[0]?.agentId?.username)
                    ? visibleRows[0]?.agentId?.username
                    : 'filtered view'}
                </strong>{' '}
                — {visibleRows.length} transaction
                {visibleRows.length > 1 ? 's' : ''}
              </p>
            )}

            <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-white">
              <div className="bg-black border border-white text-green-500 p-3 rounded">
                <strong>Total Deposits:</strong> ₵{totals.deposit.toFixed(2)}
              </div>
              <div className="bg-black border border-white text-red-500 p-3 rounded">
                <strong>Total Withdrawals:</strong> ₵{totals.withdrawal.toFixed(2)}
              </div>
              <div className="bg-black border border-white text-blue-600 p-3 rounded">
                <strong>Latest Balance:</strong> ₵{totals.balance.toFixed(2)}
              </div>

            </div>
            <div className='mt-6 flex gap-4'>
                          <Link to='/withdrawal' className=' border bg-black p-2 text-red-500 font-bold underline text-sm'>
                            Withdraw
                          </Link>
                          <Link to='/admin' className='border bg-black p-2  font-bold text-green-700 underline text-sm'>
                            Deposit Form
                          </Link>
                        </div>
          </>
        )
      }

      <style>{`
        .ag-theme-alpine {
          --ag-background-color: #0d0d0d;
          --ag-header-background-color: #1a1a1a;
          --ag-foreground-color: #f5f5f5;
          --ag-border-color: #ffffff;
          --ag-row-hover-color: #1f1f1f;
          --ag-input-border-color: #ffffff;
          --ag-font-size: 14px;
          --ag-font-family: 'Inter', sans-serif;
        }
        .deposit-type {
          color: #4caf50;
          font-weight: 600;
        }
        .withdrawal-type {
          color: #fff;
          background-color: #800000;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .custom-editable-cell,
        .ag-cell.ag-cell-editable.custom-editable-cell {
          background-color: #1a1a1a !important;
          border: 1px solid #555 !important;
          cursor: text !important;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
          position: relative;
        }
        .ag-cell.ag-cell-editable.custom-editable-cell:hover::after {
          content: '✏️';
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default function TransactionsPage() {
  return <TransactionsTable profile={mockProfile} />;
}
