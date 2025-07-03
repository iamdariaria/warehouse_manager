import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import EditExpenseModal from './EditExpenseModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const ExpensesTable = ({ expenses, projects, warehouseData, onEditExpense, onDeleteExpense }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedExpenses = React.useMemo(() => {
    let sortableExpenses = [...expenses];
    if (sortConfig.key) {
      sortableExpenses.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle different data types
        if (sortConfig.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableExpenses;
  }, [expenses, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-muted" strokeWidth={2} />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" strokeWidth={2} />
      : <Icon name="ArrowDown" size={14} className="text-primary" strokeWidth={2} />;
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = (expense) => {
    setDeletingExpense(expense);
  };

  const handleEditSubmit = (expenseId, updatedData) => {
    onEditExpense(expenseId, updatedData);
    setEditingExpense(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingExpense) {
      onDeleteExpense(deletingExpense.id);
      setDeletingExpense(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-4">
          <Icon name="FileText" size={32} className="text-text-muted" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-text-primary font-heading mb-2">
          No Expenses Found
        </h3>
        <p className="text-text-secondary font-body">
          Start by adding your first expense allocation to track project inventory usage.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading"
                >
                  <span>Date</span>
                  {getSortIcon('date')}
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('projectName')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading"
                >
                  <span>Project</span>
                  {getSortIcon('projectName')}
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('article')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading"
                >
                  <span>Article</span>
                  {getSortIcon('article')}
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('productName')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading"
                >
                  <span>Product</span>
                  {getSortIcon('productName')}
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('quantity')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading"
                >
                  <span>Quantity</span>
                  {getSortIcon('quantity')}
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('totalCost')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading"
                >
                  <span>Total Cost</span>
                  {getSortIcon('totalCost')}
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <span className="text-sm font-semibold text-text-primary font-heading">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((expense) => (
              <tr key={expense.id} className="border-b border-border hover:bg-secondary-50 transition-smooth">
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-text-primary font-body">
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-text-muted font-body">
                    {new Date(expense.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-text-primary font-body">
                    {expense.projectName}
                  </div>
                  <div className="text-xs text-text-muted font-body">
                    {projects.find(p => p.id === expense.projectId)?.code}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-text-primary font-data">
                    {expense.article}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-text-primary font-body">
                    {expense.productName}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-text-primary font-body">
                    {expense.quantity} units
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-text-primary font-body">
                    ${expense.totalCost.toFixed(2)}
                  </div>
                  <div className="text-xs text-text-muted font-body">
                    ${expense.unitCost.toFixed(2)} per unit
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      title="Edit expense"
                    >
                      <Icon name="Edit2" size={16} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleDelete(expense)}
                      className="p-2 text-text-secondary hover:text-error hover:bg-error-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                      title="Delete expense"
                    >
                      <Icon name="Trash2" size={16} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          projects={projects}
          warehouseData={warehouseData}
          onSave={handleEditSubmit}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingExpense && (
        <DeleteConfirmationModal
          expense={deletingExpense}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingExpense(null)}
        />
      )}
    </>
  );
};

export default ExpensesTable;