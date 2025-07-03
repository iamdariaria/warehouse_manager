import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MainNavigation from '../../components/ui/MainNavigation';
import Icon from '../../components/AppIcon';
import AddExpenseForm from './components/AddExpenseForm';
import ExpensesTable from './components/ExpensesTable';
import ExpenseFilters from './components/ExpenseFilters';

const ExpensesTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    project: '',
    dateFrom: '',
    dateTo: ''
  });
  const [notification, setNotification] = useState(null);

  // Mock warehouse data
  const mockWarehouseData = [
    {
      id: 1,
      article: "PNL-001",
      name: "Standard Wall Panel 2400x1200",
      remainingStock: 45,
      costPrice: 125.50
    },
    {
      id: 2,
      article: "PNL-002",
      name: "Insulated Panel 2400x600",
      remainingStock: 23,
      costPrice: 89.75
    },
    {
      id: 3,
      article: "DIV-001",
      name: "Office Divider 1800x900",
      remainingStock: 12,
      costPrice: 156.25
    },
    {
      id: 4,
      article: "DIV-002",
      name: "Glass Partition 2100x1200",
      remainingStock: 8,
      costPrice: 234.80
    },
    {
      id: 5,
      article: "ACC-001",
      name: "Mounting Brackets Set",
      remainingStock: 156,
      costPrice: 12.45
    },
    {
      id: 6,
      article: "ACC-002",
      name: "Sealing Strip 3m",
      remainingStock: 89,
      costPrice: 8.90
    }
  ];

  // Mock projects data
  const mockProjects = [
    { id: 1, name: "Office Building A - Phase 1", code: "OBA-P1" },
    { id: 2, name: "Warehouse Expansion", code: "WH-EXP" },
    { id: 3, name: "Retail Store Renovation", code: "RS-REN" },
    { id: 4, name: "Factory Floor Upgrade", code: "FF-UPG" },
    { id: 5, name: "Administrative Complex", code: "ADM-CX" }
  ];

  // Mock expenses data
  const mockExpenses = [
    {
      id: 1,
      date: "2024-01-15",
      projectId: 1,
      projectName: "Office Building A - Phase 1",
      article: "PNL-001",
      productName: "Standard Wall Panel 2400x1200",
      quantity: 15,
      unitCost: 125.50,
      totalCost: 1882.50,
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      date: "2024-01-16",
      projectId: 2,
      projectName: "Warehouse Expansion",
      article: "DIV-001",
      productName: "Office Divider 1800x900",
      quantity: 8,
      unitCost: 156.25,
      totalCost: 1250.00,
      createdAt: "2024-01-16T14:15:00Z"
    },
    {
      id: 3,
      date: "2024-01-17",
      projectId: 1,
      projectName: "Office Building A - Phase 1",
      article: "ACC-001",
      productName: "Mounting Brackets Set",
      quantity: 25,
      unitCost: 12.45,
      totalCost: 311.25,
      createdAt: "2024-01-17T09:45:00Z"
    },
    {
      id: 4,
      date: "2024-01-18",
      projectId: 3,
      projectName: "Retail Store Renovation",
      article: "PNL-002",
      productName: "Insulated Panel 2400x600",
      quantity: 12,
      unitCost: 89.75,
      totalCost: 1077.00,
      createdAt: "2024-01-18T11:20:00Z"
    },
    {
      id: 5,
      date: "2024-01-19",
      projectId: 4,
      projectName: "Factory Floor Upgrade",
      article: "DIV-002",
      productName: "Glass Partition 2100x1200",
      quantity: 6,
      unitCost: 234.80,
      totalCost: 1408.80,
      createdAt: "2024-01-19T16:00:00Z"
    }
  ];

  useEffect(() => {
    // Initialize data
    setWarehouseData(mockWarehouseData);
    setProjects(mockProjects);
    setExpenses(mockExpenses);
    setFilteredExpenses(mockExpenses);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = expenses;

    if (filters.search) {
      filtered = filtered.filter(expense => 
        expense.article.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.projectName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.project) {
      filtered = filtered.filter(expense => expense.projectId.toString() === filters.project);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(expense => expense.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(expense => expense.date <= filters.dateTo);
    }

    setFilteredExpenses(filtered);
  }, [filters, expenses]);

  const handleAddExpense = (expenseData) => {
    const selectedProduct = warehouseData.find(item => item.id === expenseData.productId);
    const selectedProject = projects.find(project => project.id === expenseData.projectId);
    
    if (!selectedProduct || !selectedProject) {
      showNotification('error', 'Invalid product or project selection');
      return;
    }

    if (selectedProduct.remainingStock < expenseData.quantity) {
      showNotification('error', `Insufficient stock. Available: ${selectedProduct.remainingStock} units`);
      return;
    }

    const newExpense = {
      id: Date.now(),
      date: expenseData.date,
      projectId: expenseData.projectId,
      projectName: selectedProject.name,
      article: selectedProduct.article,
      productName: selectedProduct.name,
      quantity: expenseData.quantity,
      unitCost: selectedProduct.costPrice,
      totalCost: expenseData.quantity * selectedProduct.costPrice,
      createdAt: new Date().toISOString()
    };

    // Update expenses
    setExpenses(prev => [newExpense, ...prev]);

    // Update warehouse stock
    setWarehouseData(prev => prev.map(item => 
      item.id === expenseData.productId 
        ? { ...item, remainingStock: item.remainingStock - expenseData.quantity }
        : item
    ));

    showNotification('success', 'Expense added successfully');
  };

  const handleEditExpense = (expenseId, updatedData) => {
    const originalExpense = expenses.find(exp => exp.id === expenseId);
    if (!originalExpense) return;

    const selectedProduct = warehouseData.find(item => item.article === originalExpense.article);
    const selectedProject = projects.find(project => project.id === updatedData.projectId);

    if (!selectedProduct || !selectedProject) {
      showNotification('error', 'Invalid product or project selection');
      return;
    }

    // Calculate stock difference
    const stockDifference = updatedData.quantity - originalExpense.quantity;
    
    if (stockDifference > 0 && selectedProduct.remainingStock < stockDifference) {
      showNotification('error', `Insufficient stock for increase. Available: ${selectedProduct.remainingStock} units`);
      return;
    }

    const updatedExpense = {
      ...originalExpense,
      ...updatedData,
      projectName: selectedProject.name,
      totalCost: updatedData.quantity * selectedProduct.costPrice
    };

    // Update expenses
    setExpenses(prev => prev.map(exp => 
      exp.id === expenseId ? updatedExpense : exp
    ));

    // Update warehouse stock
    setWarehouseData(prev => prev.map(item => 
      item.article === originalExpense.article 
        ? { ...item, remainingStock: item.remainingStock - stockDifference }
        : item
    ));

    showNotification('success', 'Expense updated successfully');
  };

  const handleDeleteExpense = (expenseId) => {
    const expenseToDelete = expenses.find(exp => exp.id === expenseId);
    if (!expenseToDelete) return;

    // Restore stock
    setWarehouseData(prev => prev.map(item => 
      item.article === expenseToDelete.article 
        ? { ...item, remainingStock: item.remainingStock + expenseToDelete.quantity }
        : item
    ));

    // Remove expense
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId));

    showNotification('success', 'Expense deleted and stock restored');
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const totalExpensesValue = filteredExpenses.reduce((sum, expense) => sum + expense.totalCost, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MainNavigation />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                <Icon name="DollarSign" size={24} color="var(--color-primary)" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary font-heading">
                  Expenses Tracking
                </h1>
                <p className="text-text-secondary font-body">
                  Allocate inventory to projects and track outgoing stock
                </p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-lg">
                    <Icon name="TrendingUp" size={20} color="var(--color-primary)" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-body">Total Expenses</p>
                    <p className="text-2xl font-bold text-text-primary font-heading">
                      ${totalExpensesValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent-50 rounded-lg">
                    <Icon name="Package" size={20} color="var(--color-accent)" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-body">Items Allocated</p>
                    <p className="text-2xl font-bold text-text-primary font-heading">
                      {filteredExpenses.reduce((sum, expense) => sum + expense.quantity, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-success-50 rounded-lg">
                    <Icon name="FileText" size={20} color="var(--color-success)" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-body">Total Records</p>
                    <p className="text-2xl font-bold text-text-primary font-heading">
                      {filteredExpenses.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Add Expense Form - Left Panel */}
            <div className="lg:col-span-4">
              <div className="bg-surface rounded-lg border border-border shadow-card">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold text-text-primary font-heading">
                    Add Expense
                  </h2>
                  <p className="text-sm text-text-secondary font-body mt-1">
                    Allocate inventory to a project
                  </p>
                </div>
                <div className="p-6">
                  <AddExpenseForm
                    projects={projects}
                    warehouseData={warehouseData}
                    onAddExpense={handleAddExpense}
                  />
                </div>
              </div>
            </div>

            {/* Expenses Table - Right Panel */}
            <div className="lg:col-span-8">
              <div className="bg-surface rounded-lg border border-border shadow-card">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-text-primary font-heading">
                      Expense Records
                    </h2>
                    <div className="text-sm text-text-secondary font-body">
                      Showing {filteredExpenses.length} of {expenses.length} records
                    </div>
                  </div>
                  
                  <ExpenseFilters
                    filters={filters}
                    projects={projects}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>

                <div className="p-6">
                  <ExpensesTable
                    expenses={filteredExpenses}
                    projects={projects}
                    warehouseData={warehouseData}
                    onEditExpense={handleEditExpense}
                    onDeleteExpense={handleDeleteExpense}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-400">
          <div className={`
            px-6 py-4 rounded-lg shadow-modal border transition-modal
            ${notification.type === 'success' ?'bg-success-50 border-success-200 text-success-700' :'bg-error-50 border-error-200 text-error-700'
            }
          `}>
            <div className="flex items-center space-x-3">
              <Icon 
                name={notification.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                size={20} 
                className={notification.type === 'success' ? 'text-success' : 'text-error'}
                strokeWidth={2}
              />
              <span className="font-body">{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-current opacity-70 hover:opacity-100 transition-smooth"
              >
                <Icon name="X" size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesTracking;