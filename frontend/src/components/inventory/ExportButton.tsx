import React from 'react';
import { Download } from 'lucide-react';
import type { InventoryTransaction } from '../../types/inventory';
import { buttonClasses } from '../ui/Button';

interface ExportButtonProps {
  transactions: InventoryTransaction[];
  filename?: string;
  className?: string;
}

// RFC 4180 quoting so commas, quotes and line breaks in remarks don't break columns
const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

function transactionsToCSV(transactions: InventoryTransaction[]): string {
  const headers = [
    'Date', 'Timestamp', 'Product', 'SKU', 'Type', 'Quantity', 'Previous Stock', 'Current Stock',
    'Reason', 'Supplier', 'Invoice No.', 'Purchase Cost (₹)', 'Performed By', 'Remarks',
  ];

  const rows = transactions.map((t) => [
    t.date,
    new Date(t.timestamp).toLocaleString('en-IN'),
    t.productTitle,
    t.sku,
    t.type,
    t.quantity,
    t.previousStock,
    t.currentStock,
    t.reason,
    t.supplier,
    t.invoiceNumber,
    t.purchaseCost,
    t.handledBy,
    t.remarks,
  ]);

  return [headers, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n');
}

const ExportButton: React.FC<ExportButtonProps> = ({ transactions, filename = 'inventory-history', className = '' }) => {
  const handleExport = () => {
    // BOM so Excel opens the ₹ symbol and Telugu text correctly
    const blob = new Blob(['﻿' + transactionsToCSV(transactions)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={transactions.length === 0}
      className={buttonClasses('admin-secondary', 'sm', false, className)}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Export CSV
      <span className="sr-only"> ({transactions.length} records)</span>
    </button>
  );
};

export default ExportButton;
