import { useEffect, useState, useMemo } from 'react';
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

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  NumberFilterModule,
  DateFilterModule,
  TextFilterModule
]);

const TransactionsTable = () => {
  const [rows, setRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [loading, setLoading] = useState(true);
const [limit, setLimit] = useState(5); // default to 5 transactions


const applyGridFiltersToRows = (rows, api) => {
  const filterModel = api.getFilterModel();

  return rows.filter(row => {
    // ✅ Date filter
    if (filterModel.createdAt?.dateFrom) {
      const filterDate = new Date(filterModel.createdAt.dateFrom);
      const filterY = filterDate.getFullYear();
      const filterM = filterDate.getMonth();
      const filterD = filterDate.getDate();

      const rowDate = new Date(row.createdAt);
      const rowY = rowDate.getFullYear();
      const rowM = rowDate.getMonth();
      const rowD = rowDate.getDate();

      if (!(rowY === filterY && rowM === filterM && rowD === filterD)) return false;
    }

    // ✅ Type filter
    if (filterModel.type?.filter) {
      const value = filterModel.type.filter;
      if (row.type !== value) return false;
    }

    // ✅ Account number
    if (filterModel['clientId.accountNumber']?.filter) {
      const value = filterModel['clientId.accountNumber'].filter.toLowerCase();
      if (!row.clientId?.accountNumber?.toLowerCase().includes(value)) return false;
    }

    // ✅ Client name
    if (filterModel['clientId.username']?.filter) {
      const value = filterModel['clientId.username'].filter.toLowerCase();
      if (!row.clientId?.username?.toLowerCase().includes(value)) return false;
    }

    return true;
  });
};


  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/transact/getAllTransactions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          tx => tx.clientId?.accountNumber && tx.agentId?.username
        );
        console.log("📦 Fetched rows:", data.length);
        console.log("✅ Filtered usable rows:", filtered.length);
        setRows(filtered);
        setVisibleRows(filtered); // Initial sync
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

const totals = useMemo(() => {
  if (!visibleRows.length) return { deposit: 0, withdrawal: 0, balance: 0 };

  let deposit = 0;
  let withdrawal = 0;

  visibleRows.forEach(tx => {
    if (tx.type === 'deposit') deposit += Number(tx.amount);
    if (tx.type === 'withdrawal') withdrawal += Number(tx.amount);
  });

  const computedBalance = deposit - withdrawal;

  return { deposit, withdrawal, balance: computedBalance };
}, [visibleRows]);




  const columnDefs = useMemo(() => [
    {
      field: 'createdAt',
      headerName: 'Date',
      valueFormatter: ({ value }) =>
        new Date(value).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      filterParams: {
        comparator: (filterDate, cellValue) => {
          if (!cellValue) return -1;
          const cellDate = new Date(cellValue);
          const filterY = filterDate.getFullYear();
          const filterM = filterDate.getMonth();
          const filterD = filterDate.getDate();
          const cellY = cellDate.getFullYear();
          const cellM = cellDate.getMonth();
          const cellD = cellDate.getDate();

          if (cellY === filterY && cellM === filterM && cellD === filterD) return 0;
          return cellDate < filterDate ? -1 : 1;
        },
        

      },
      
    },
   {
  field: 'clientId.accountNumber',
  headerName: 'Client Account #',
  width: 140,
  filter: 'agTextColumnFilter',
  floatingFilter: true
},
{
  headerName: 'Client Name',
  width: 200,
  valueGetter: ({ data }) => data.clientId?.name ?? '—',
  filter: 'agTextColumnFilter',
  floatingFilter: true
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
  filter: 'agNumberColumnFilter',
  floatingFilter: true,
  valueFormatter: ({ value }) => `₵${Number(value).toFixed(2)}`,
  cellClass: params => {
    const isWithdrawal = params?.data?.type === 'withdrawal';
    return isWithdrawal ? 'withdrawal-number' : '';
  }
}

,
    {
      field: 'balanceAfter',
      headerName: 'Balance After',
      width: 130,
      valueFormatter: ({ value }) => `₵${Number(value).toFixed(2)}`,
      filter: 'agNumberColumnFilter',
      floatingFilter: true
    },
    {
      headerName: 'Processed By',
      valueGetter: ({ data }) => data.agentId?.username ?? '—',
      filter: 'agTextColumnFilter',
      floatingFilter: true
    }
  ], []);

  return (
    <div className="px-4 py-6 ">
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-2 ">
            Showing {visibleRows.length} transactions
          </p>
<div className="mb-4 flex items-center gap-2 text-sm text-white">
  <label htmlFor="limitSelect">Show:</label>
  <select
    id="limitSelect"
    value={limit}
    onChange={e => setLimit(Number(e.target.value))}
    className="bg-neutral-900 border border-white rounded px-2 py-1"
  >
    <option value={5}>5 transactions</option>
    <option value={10}>10 transactions</option>
    <option value={20}>20 transactions</option>
    <option value={visibleRows.length}>Show all</option>
  </select>
</div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <div className="ag-theme-alpine" style={{ height: '100%', backgroundColor: '#0d0d0d', color: '#f5f5f5' }}>

 <AgGridReact
  rowData={visibleRows.slice(0, limit)}
  columnDefs={columnDefs}
  defaultColDef={{
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
      placeholder: 'Type to filter...'
    }
  }}
  animateRows
  domLayout="autoHeight"
  rowHeight={35}
  onFilterChanged={params => {
    const api = params.api;
    const filteredRows = applyGridFiltersToRows(rows, api);
    setVisibleRows(filteredRows);
  }}
/>


            </div>
          </div>
          {visibleRows.length > 0 && (
  <p className="text-sm text-gray-600 mb-2 italic">
    Showing totals for{" "}
    <strong>
      {visibleRows.every(r => r.clientId?.username === visibleRows[0]?.clientId?.username)
        ? visibleRows[0]?.clientId?.username
        : "filtered view"}
    </strong>{" "}
    — {visibleRows.length} transaction{visibleRows.length > 1 ? "s" : ""}
  </p>
)}

          {/* 🧾 Totals Bar */}
         <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-white">
<div className="bg-black border border-white text-green-500 p-3 rounded">
  <strong>Total Deposits:</strong> ₵{totals.deposit.toFixed(2)}
</div>
<div className="bg-black border border-white text-red-500 p-3 rounded">
  <strong>Total Withdrawals:</strong> ₵{totals.withdrawal.toFixed(2)}
</div>
<div className="bg-black border border-white p-3 text-blue-600 rounded">
  <strong>Latest Balance:</strong> ₵{totals.balance.toFixed(2)}
</div>

          </div>
        </>
      )}

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

/* Cell styling for deposit and withdrawal types */
.deposit-type {
  color: #4caf50; /* Green text for deposit */
  font-weight: 600;
}

.withdrawal-type {
  color: #fff;
  background-color: #800000;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.ag-theme-alpine .ag-row {
  background-color: #0d0d0d !important;
  color: #f5f5f5 !important;
}

.ag-theme-alpine .ag-cell {
  background-color: #0d0d0d !important;
  color: #f5f5f5 !important;
  border-color: #333 !important;
}

.ag-theme-alpine .ag-header-cell {
  background-color: #1a1a1a !important;
  color: #f5f5f5 !important;
  border-color: #333 !important;
}

.ag-theme-alpine .ag-center-cols-clipper {
  background-color: #0d0d0d !important;
}

.ag-floating-filter-input {
  background-color: #1a1a1a !important;
  color: #1a1a1a !important;
  border: 1px solid #ffffff !important;
}





      `}</style>
    </div>
  );
};

export default TransactionsTable;
