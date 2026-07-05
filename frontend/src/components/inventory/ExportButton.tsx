import React from 'react';
import { Download } from 'lucide-react';
import type { InventoryTransaction } from '../../types/inventory';

interface ExportButtonProps {
  transactions: InventoryTransaction[];
  filename?: string;
  className?: string;
}

function transactionsToCSV(transactions: InventoryTransaction[]): string {
  const headers = [
    'Date',
    'Timestamp',
    'Product',
    'SKU',
    'Type',
    'Quantity',
    'Previous Stock',
    'Current Stock',
    'Reason',
    'Supplier',
    'Invoice No.',
    'Purchase Cost (₹)',
    'Performed By',
    'Remarks',
  ];

  const rows = transactions.map((t) => [
    t.date,
    new Date(t.timestamp).toLocaleString('en-IN'),
    `"${t.productTitle}"`,
    t.sku,
    t.type,
    t.quantity,
    t.previousStock,
    t.currentStock,
    t.reason ?? '',
    t.supplier ?? '',
    t.invoiceNumber ?? '',
    t.purchaseCost ?? '',
    t.handledBy,
    t.remarks ?? '',
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

const ExportButton: React.FC<ExportButtonProps> = ({
  transactions,
  filename = 'inventory-history',
  className = '',
}) => {
  const handleExport = () => {
    const csv = transactionsToCSV(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${filename}-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={transactions.length === 0}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-[#0A3D91]/30 hover:text-[#0A3D91] hover:bg-[#EAF3FF] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      <Download className="w-3.5 h-3.5" />
      Export CSV
    </button>
  );
};

export default ExportButton;
