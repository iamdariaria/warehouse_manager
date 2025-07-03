import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MainNavigation from '../../components/ui/MainNavigation';
import Icon from '../../components/AppIcon';
import WarehouseTable from './components/WarehouseTable';
import AddProductModal from './components/AddProductModal';
import ExcelImportModal from './components/ExcelImportModal';

const WarehouseDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    stockFilter: 'all' // all, critical
  });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [notification, setNotification] = useState(null);

  // Mock inventory data
  const mockInventory = [
    {
      id: 1,
      article: "PNL-001",
      name: "Standard Wall Panel 2400x1200",
      receivedQuantity: 75,
      outgoingQuantity: 30,
      reservedQuantity: 10,
      remainingStock: 35,
      costPrice: 125.50,
      category: "Wall Panels",
      supplier: "Standard Materials Co",
      createdAt: "2024-01-10T08:00:00Z"
    },
    {
      id: 2,
      article: "PNL-002",
      name: "Insulated Panel 2400x600",
      receivedQuantity: 50,
      outgoingQuantity: 27,
      reservedQuantity: 8,
      remainingStock: 15,
      costPrice: 89.75,
      category: "Wall Panels",
      supplier: "Insulation Pro Ltd",
      createdAt: "2024-01-12T10:30:00Z"
    },
    {
      id: 3,
      article: "DIV-001",
      name: "Office Divider 1800x900",
      receivedQuantity: 30,
      outgoingQuantity: 18,
      reservedQuantity: 5,
      remainingStock: 7,
      costPrice: 156.25,
      category: "Dividers",
      supplier: "Office Solutions Inc",
      createdAt: "2024-01-15T14:15:00Z"
    },
    {
      id: 4,
      article: "DIV-002",
      name: "Glass Partition 2100x1200",
      receivedQuantity: 20,
      outgoingQuantity: 12,
      reservedQuantity: 6,
      remainingStock: 2,
      costPrice: 234.80,
      category: "Dividers",
      supplier: "Glass Tech Corp",
      createdAt: "2024-01-18T09:45:00Z"
    },
    {
      id: 5,
      article: "ACC-001",
      name: "Mounting Brackets Set",
      receivedQuantity: 200,
      outgoingQuantity: 44,
      reservedQuantity: 15,
      remainingStock: 141,
      costPrice: 12.45,
      category: "Accessories",
      supplier: "Hardware Plus",
      createdAt: "2024-01-20T11:20:00Z"
    },
    {
      id: 6,
      article: "ACC-002",
      name: "Sealing Strip 3m",
      receivedQuantity: 120,
      outgoingQuantity: 31,
      reservedQuantity: 12,
      remainingStock: 77,
      costPrice: 8.90,
      category: "Accessories",
      supplier: "Seal Solutions",
      createdAt: "2024-01-22T16:00:00Z"
    },
    {
      id: 7,
      article: "PNL-003",
      name: "Fire-Resistant Panel 2400x1200",
      receivedQuantity: 25,
      outgoingQuantity: 20,
      reservedQuantity: 2,
      remainingStock: 3,
      costPrice: 189.90,
      category: "Wall Panels",
      supplier: "Fire Safety Materials",
      createdAt: "2024-01-25T13:30:00Z"
    }
  ];

  useEffect(() => {
    // Initialize inventory data
    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = inventory;

    if (filters.search) {
      filtered = filtered.filter(item => 
        item.article.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.category?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.stockFilter === 'critical') {
      filtered = filtered.filter(item => item.remainingStock <= 5);
    }

    setFilteredInventory(filtered);
  }, [filters, inventory]);

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleStockFilterChange = (value) => {
    setFilters(prev => ({ ...prev, stockFilter: value }));
  };

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      article: productData.article,
      name: productData.name,
      receivedQuantity: productData.initialStock,
      outgoingQuantity: 0,
      reservedQuantity: 0,
      remainingStock: productData.initialStock,
      costPrice: productData.costPrice,
      category: productData.category,
      supplier: productData.supplier,
      createdAt: new Date().toISOString(),
      notes: productData.notes
    };

    setInventory(prev => [newProduct, ...prev]);
    showNotification('success', 'Product added successfully');
  };

  const handleAddStock = (itemId, stockData) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newReceivedQuantity = (item.receivedQuantity || 0) + stockData.quantity;
        const newRemainingStock = (item.remainingStock || 0) + stockData.quantity;
        
        return {
          ...item,
          receivedQuantity: newReceivedQuantity,
          remainingStock: newRemainingStock,
          costPrice: stockData.costPrice || item.costPrice
        };
      }
      return item;
    }));

    showNotification('success', `Added ${stockData.quantity} units to ${inventory.find(item => item.id === itemId)?.article}`);
  };

  const handleUpdateArticle = (itemId, updateData) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updateData } : item
    ));

    showNotification('success', 'Item updated successfully');
  };

  const handleExcelImport = (importData) => {
    const newProducts = importData.map(item => ({
      id: Date.now() + Math.random(),
      article: item.article,
      name: item.name,
      receivedQuantity: item.initialStock || 0,
      outgoingQuantity: 0,
      reservedQuantity: 0,
      remainingStock: item.initialStock || 0,
      costPrice: item.costPrice || 0,
      category: item.category || '',
      supplier: item.supplier || '',
      createdAt: new Date().toISOString()
    }));

    setInventory(prev => [...newProducts, ...prev]);
    showNotification('success', `Successfully imported ${importData.length} products`);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const criticalStockCount = inventory.filter(item => item.remainingStock <= 5).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.remainingStock * item.costPrice), 0);
  const totalItems = inventory.reduce((sum, item) => sum + item.remainingStock, 0);

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
                <Icon name="Package" size={24} color="var(--color-primary)" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary font-heading">
                  Warehouse Dashboard
                </h1>
                <p className="text-text-secondary font-body">
                  Monitor stock levels, add inventory, and manage warehouse operations
                </p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-lg">
                    <Icon name="Package" size={20} color="var(--color-primary)" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-body">Total Items</p>
                    <p className="text-2xl font-bold text-text-primary font-heading">
                      {totalItems.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-success-50 rounded-lg">
                    <Icon name="DollarSign" size={20} color="var(--color-success)" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-body">Total Value</p>
                    <p className="text-2xl font-bold text-text-primary font-heading">
                      ${totalValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent-50 rounded-lg">
                    <Icon name="Layers" size={20} color="var(--color-accent)" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-body">Product Types</p>
                    <p className="text-2xl font-bold text-text-primary font-heading">
                      {inventory.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    criticalStockCount > 0 ? 'bg-error-50' : 'bg-success-50'
                  }`}>
                    <Icon 
                      name={criticalStockCount > 0 ? "AlertTriangle" : "CheckCircle"} 
                      size={20} 
                      color={criticalStockCount > 0 ? "var(--color-error)" : "var(--color-success)"} 
                      strokeWidth={2} 
                    />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-body">Critical Stock</p>
                    <p className={`text-2xl font-bold font-heading ${
                      criticalStockCount > 0 ? 'text-error' : 'text-success'
                    }`}>
                      {criticalStockCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-surface rounded-lg border border-border shadow-card">
            {/* Toolbar */}
            <div className="p-6 border-b border-border">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <Icon 
                      name="Search" 
                      size={20} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
                      strokeWidth={2} 
                    />
                    <input
                      type="text"
                      placeholder="Search articles, names, categories..."
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-80 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                    />
                  </div>

                  {/* Stock Filter */}
                  <select
                    value={filters.stockFilter}
                    onChange={(e) => handleStockFilterChange(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                  >
                    <option value="all">All Items</option>
                    <option value="critical">Critical Stock (≤5)</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {/* Excel Import */}
                  <button
                    onClick={() => setShowExcelImport(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-smooth font-body"
                  >
                    <Icon name="Upload" size={16} strokeWidth={2} />
                    <span className="hidden sm:inline">Excel Import</span>
                    <span className="sm:hidden">Import</span>
                  </button>

                  {/* Add New Product */}
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body"
                  >
                    <Icon name="Plus" size={16} strokeWidth={2} />
                    <span className="hidden sm:inline">Add New Product</span>
                    <span className="sm:hidden">Add Product</span>
                  </button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mt-4 flex items-center justify-between text-sm text-text-secondary font-body">
                <span>
                  Showing {filteredInventory.length} of {inventory.length} items
                </span>
                {criticalStockCount > 0 && (
                  <div className="flex items-center space-x-2 text-error">
                    <Icon name="AlertTriangle" size={16} strokeWidth={2} />
                    <span>{criticalStockCount} items need restocking</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Table */}
            <div className="p-6">
              <WarehouseTable
                inventory={filteredInventory}
                onAddStock={handleAddStock}
                onUpdateArticle={handleUpdateArticle}
                onStockMovementView={() => {}} // Function handled in table component
              />
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModal
          onSave={handleAddProduct}
          onClose={() => setShowAddProduct(false)}
        />
      )}

      {/* Excel Import Modal */}
      {showExcelImport && (
        <ExcelImportModal
          onImport={handleExcelImport}
          onClose={() => setShowExcelImport(false)}
        />
      )}

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

export default WarehouseDashboard;