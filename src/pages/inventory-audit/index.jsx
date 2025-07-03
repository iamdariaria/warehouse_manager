import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import MainNavigation from 'components/ui/MainNavigation';
import Icon from 'components/AppIcon';
import AuditTable from './components/AuditTable';
import AuditSummary from './components/AuditSummary';
import AuditHistory from './components/AuditHistory';

const InventoryAudit = () => {
  const [auditData, setAuditData] = useState([]);
  const [auditMetadata, setAuditMetadata] = useState({
    auditDate: new Date().toISOString().split('T')[0],
    auditorName: 'Admin User',
    auditStatus: 'In Progress'
  });
  const [showHistory, setShowHistory] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);

  // Mock warehouse data
  const mockWarehouseData = [
    {
      id: 1,
      article: "PNL-001",
      productName: "Standard Wall Panel 2400x600mm",
      systemStock: 45,
      actualStock: 45,
      variance: 0,
      costPrice: 125.50,
      lastUpdated: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      article: "PNL-002",
      productName: "Acoustic Panel 1200x600mm",
      systemStock: 23,
      actualStock: 20,
      variance: -3,
      costPrice: 89.75,
      lastUpdated: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      article: "DIV-001",
      productName: "Office Divider 1800x1200mm",
      systemStock: 12,
      actualStock: 15,
      variance: 3,
      costPrice: 245.00,
      lastUpdated: "2024-01-13T09:15:00Z"
    },
    {
      id: 4,
      article: "ACC-001",
      productName: "Mounting Bracket Set",
      systemStock: 156,
      actualStock: 150,
      variance: -6,
      costPrice: 12.25,
      lastUpdated: "2024-01-12T16:45:00Z"
    },
    {
      id: 5,
      article: "PNL-003",
      productName: "Fire-Rated Panel 2400x900mm",
      systemStock: 8,
      actualStock: 8,
      variance: 0,
      costPrice: 189.50,
      lastUpdated: "2024-01-11T11:30:00Z"
    },
    {
      id: 6,
      article: "DIV-002",
      productName: "Glass Divider 2000x1000mm",
      systemStock: 3,
      actualStock: 2,
      variance: -1,
      costPrice: 425.75,
      lastUpdated: "2024-01-10T13:20:00Z"
    }
  ];

  const mockAuditHistory = [
    {
      id: 1,
      auditDate: "2024-01-01",
      auditorName: "Admin User",
      totalItems: 6,
      totalVariances: 2,
      status: "Completed",
      createdAt: "2024-01-01T10:00:00Z"
    },
    {
      id: 2,
      auditDate: "2023-12-15",
      auditorName: "Manager User",
      totalItems: 5,
      totalVariances: 1,
      status: "Completed",
      createdAt: "2023-12-15T14:30:00Z"
    },
    {
      id: 3,
      auditDate: "2023-12-01",
      auditorName: "Admin User",
      totalItems: 4,
      totalVariances: 3,
      status: "Completed",
      createdAt: "2023-12-01T09:15:00Z"
    }
  ];

  useEffect(() => {
    // Initialize audit data with calculated variances
    const initialAuditData = mockWarehouseData.map(item => ({
      ...item,
      actualStock: item.systemStock, // Default to system stock
      variance: 0 // Will be calculated when actual stock is changed
    }));
    setAuditData(initialAuditData);
  }, []);

  const handleActualStockChange = (itemId, actualStock) => {
    setAuditData(prevData =>
      prevData.map(item => {
        if (item.id === itemId) {
          const variance = actualStock - item.systemStock;
          return {
            ...item,
            actualStock: actualStock,
            variance: variance
          };
        }
        return item;
      })
    );
  };

  const handleItemSelection = (itemId, isSelected) => {
    setSelectedItems(prev => {
      if (isSelected) {
        return [...prev, itemId];
      } else {
        return prev.filter(id => id !== itemId);
      }
    });
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedItems(auditData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleMarkAsVerified = () => {
    if (selectedItems.length === 0) return;
    
    setAuditData(prevData =>
      prevData.map(item => {
        if (selectedItems.includes(item.id)) {
          return {
            ...item,
            verified: true
          };
        }
        return item;
      })
    );
    setSelectedItems([]);
  };

  const handleConfirmInventory = async () => {
    setIsConfirming(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update audit status
    setAuditMetadata(prev => ({
      ...prev,
      auditStatus: 'Completed',
      completedAt: new Date().toISOString()
    }));
    
    setIsConfirming(false);
    
    // Show success notification (would integrate with notification system)
    alert('Inventory audit completed successfully! Stock levels have been updated.');
  };

  const calculateSummary = () => {
    const totalItems = auditData.length;
    const totalVariances = auditData.filter(item => item.variance !== 0).length;
    const positiveVariances = auditData.filter(item => item.variance > 0).length;
    const negativeVariances = auditData.filter(item => item.variance < 0).length;
    const verifiedItems = auditData.filter(item => item.verified).length;
    
    return {
      totalItems,
      totalVariances,
      positiveVariances,
      negativeVariances,
      verifiedItems
    };
  };

  const summary = calculateSummary();
  const hasVariances = summary.totalVariances > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MainNavigation />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary font-heading">
                  Inventory Audit
                </h1>
                <p className="mt-2 text-text-secondary font-body">
                  Systematic stock verification and variance management
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
                >
                  <Icon name="History" size={18} strokeWidth={2} />
                  <span>Audit History</span>
                </button>
                
                {hasVariances && (
                  <button
                    onClick={handleConfirmInventory}
                    disabled={isConfirming || auditMetadata.auditStatus === 'Completed'}
                    className="flex items-center space-x-2 px-6 py-2 bg-primary hover:bg-primary-700 disabled:bg-secondary-300 text-white font-medium rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
                  >
                    {isConfirming ? (
                      <>
                        <Icon name="Loader2" size={18} className="animate-spin" strokeWidth={2} />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="CheckCircle" size={18} strokeWidth={2} />
                        <span>Confirm Inventory</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Audit Metadata */}
          <div className="bg-surface rounded-lg shadow-card border border-border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                  Audit Date
                </label>
                <input
                  type="date"
                  value={auditMetadata.auditDate}
                  onChange={(e) => setAuditMetadata(prev => ({ ...prev, auditDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                  Auditor Name
                </label>
                <input
                  type="text"
                  value={auditMetadata.auditorName}
                  onChange={(e) => setAuditMetadata(prev => ({ ...prev, auditorName: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                  Audit Status
                </label>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    auditMetadata.auditStatus === 'Completed' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <span className={`text-sm font-medium font-body ${
                    auditMetadata.auditStatus === 'Completed' ? 'text-success-700' : 'text-warning-700'
                  }`}>
                    {auditMetadata.auditStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Summary */}
          <AuditSummary summary={summary} />

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="CheckSquare" size={20} className="text-primary" strokeWidth={2} />
                  <span className="text-sm font-medium text-primary-700 font-body">
                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleMarkAsVerified}
                    className="flex items-center space-x-2 px-4 py-2 bg-success hover:bg-success-700 text-white text-sm font-medium rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 font-body"
                  >
                    <Icon name="Check" size={16} strokeWidth={2} />
                    <span>Mark as Verified</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedItems([])}
                    className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-text-primary text-sm font-medium rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 font-body"
                  >
                    <Icon name="X" size={16} strokeWidth={2} />
                    <span>Clear Selection</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Audit Table */}
          <AuditTable
            auditData={auditData}
            selectedItems={selectedItems}
            onActualStockChange={handleActualStockChange}
            onItemSelection={handleItemSelection}
            onSelectAll={handleSelectAll}
          />

          {/* Audit History */}
          {showHistory && (
            <AuditHistory 
              auditHistory={mockAuditHistory}
              onClose={() => setShowHistory(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default InventoryAudit;