import React, { useState, useMemo } from 'react';
import Header from '../../components/ui/Header';
import MainNavigation from '../../components/ui/MainNavigation';
import Icon from '../../components/AppIcon';
import HistoryFilters from './components/HistoryFilters';
import HistoryTable from './components/HistoryTable';
import HistoryTimeline from './components/HistoryTimeline';

const HistoryJournal = () => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'timeline'
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    search: '',
    actionType: 'all',
    user: 'all',
    project: 'all'
  });
  const [expandedEntries, setExpandedEntries] = useState(new Set());

  // Mock history data
  const historyData = [
    {
      id: 1,
      timestamp: new Date('2024-01-15T10:30:00'),
      action: 'received',
      article: 'PNL-001',
      productName: 'Standard Wall Panel 2400x600mm',
      quantityBefore: 45,
      quantityAfter: 95,
      quantityChange: +50,
      cost: 125.50,
      totalCost: 6275.00,
      user: 'Admin User',
      project: null,
      reference: 'Stock Receipt #SR-2024-001',
      comments: 'Weekly delivery from supplier ABC Manufacturing',
      details: {
        supplier: 'ABC Manufacturing',
        invoiceNumber: 'INV-2024-0115',
        deliveryDate: '2024-01-15',
        qualityCheck: 'Passed'
      }
    },
    {
      id: 2,
      timestamp: new Date('2024-01-15T14:45:00'),
      action: 'outgoing',
      article: 'PNL-001',
      productName: 'Standard Wall Panel 2400x600mm',
      quantityBefore: 95,
      quantityAfter: 75,
      quantityChange: -20,
      cost: 125.50,
      totalCost: 2510.00,
      user: 'Admin User',
      project: 'Office Renovation Phase 1',
      reference: 'Expense #EXP-2024-001',
      comments: 'Allocated for main conference room construction',
      details: {
        expenseDate: '2024-01-15',
        projectManager: 'John Smith',
        workOrder: 'WO-2024-001',
        location: 'Building A - Floor 3'
      }
    },
    {
      id: 3,
      timestamp: new Date('2024-01-14T16:20:00'),
      action: 'reserved',
      article: 'DIV-002',
      productName: 'Glass Office Divider 1800x1200mm',
      quantityBefore: 30,
      quantityAfter: 30,
      quantityChange: 0,
      reservedQuantity: 8,
      cost: 285.75,
      totalCost: 2286.00,
      user: 'Admin User',
      project: 'Retail Store Expansion',
      reference: 'Reserve #RSV-2024-003',
      comments: 'Reserved for upcoming retail store project - Phase 2 installation',
      details: {
        reserveDate: '2024-01-14',
        expectedUse: '2024-01-25',
        priority: 'High',
        approvedBy: 'Project Manager'
      }
    },
    {
      id: 4,
      timestamp: new Date('2024-01-14T09:15:00'),
      action: 'audit',
      article: 'ACC-003',
      productName: 'Mounting Bracket Set (10 pieces)',
      quantityBefore: 150,
      quantityAfter: 145,
      quantityChange: -5,
      cost: 12.25,
      totalCost: 61.25,
      user: 'Admin User',
      project: null,
      reference: 'Audit #AUD-2024-001',
      comments: 'Physical count discrepancy found during monthly audit - 5 units missing',
      details: {
        auditDate: '2024-01-14',
        auditType: 'Monthly Physical Count',
        variance: -5,
        reason: 'Physical count discrepancy'
      }
    },
    {
      id: 5,
      timestamp: new Date('2024-01-13T11:30:00'),
      action: 'received',
      article: 'ACC-001',
      productName: 'Door Handle Assembly Chrome',
      quantityBefore: 25,
      quantityAfter: 75,
      quantityChange: +50,
      cost: 45.80,
      totalCost: 2290.00,
      user: 'Admin User',
      project: null,
      reference: 'Stock Receipt #SR-2024-002',
      comments: 'Bulk order for Q1 projects - premium chrome finish handles',
      details: {
        supplier: 'Hardware Solutions Ltd',
        invoiceNumber: 'INV-2024-0113',
        deliveryDate: '2024-01-13',
        qualityCheck: 'Passed'
      }
    },
    {
      id: 6,
      timestamp: new Date('2024-01-12T15:45:00'),
      action: 'outgoing',
      article: 'DIV-001',
      productName: 'Acoustic Room Divider 2000x1500mm',
      quantityBefore: 18,
      quantityAfter: 10,
      quantityChange: -8,
      cost: 320.00,
      totalCost: 2560.00,
      user: 'Admin User',
      project: 'Corporate Headquarters Fit-out',
      reference: 'Expense #EXP-2024-002',
      comments: 'Installation for executive meeting rooms and open office areas',
      details: {
        expenseDate: '2024-01-12',
        projectManager: 'Sarah Johnson',
        workOrder: 'WO-2024-002',
        location: 'Corporate HQ - Floors 5-7'
      }
    }
  ];

  // Filter history data
  const filteredHistory = useMemo(() => {
    return historyData.filter(entry => {
      // Date range filter
      if (filters.dateRange.start && entry.timestamp < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && entry.timestamp > new Date(filters.dateRange.end + 'T23:59:59')) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!entry.article.toLowerCase().includes(searchLower) && 
            !entry.productName.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Action type filter
      if (filters.actionType !== 'all' && entry.action !== filters.actionType) {
        return false;
      }

      // User filter
      if (filters.user !== 'all' && entry.user !== filters.user) {
        return false;
      }

      // Project filter
      if (filters.project !== 'all') {
        if (filters.project === 'no-project' && entry.project) {
          return false;
        }
        if (filters.project !== 'no-project' && entry.project !== filters.project) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Date', 'Time', 'Action', 'Article', 'Product Name', 'Quantity Change', 'User', 'Project', 'Reference'].join(','),
      ...filteredHistory.map(entry => [
        entry.timestamp.toLocaleDateString(),
        entry.timestamp.toLocaleTimeString(),
        entry.action,
        entry.article,
        `"${entry.productName}"`,
        entry.quantityChange,
        entry.user,
        entry.project || 'N/A',
        entry.reference
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-journal-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleEntryExpansion = (entryId) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const getActionTypeStats = () => {
    const stats = filteredHistory.reduce((acc, entry) => {
      acc[entry.action] = (acc[entry.action] || 0) + 1;
      return acc;
    }, {});
    return stats;
  };

  const actionStats = getActionTypeStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MainNavigation />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary font-heading">
                  History Journal
                </h1>
                <p className="text-text-secondary font-body mt-2">
                  Complete audit trail of all inventory movements and system changes
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-secondary-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                      viewMode === 'table' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon name="Table" size={16} strokeWidth={2} />
                    <span className="font-body">Table</span>
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                      viewMode === 'timeline' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon name="Clock" size={16} strokeWidth={2} />
                    <span className="font-body">Timeline</span>
                  </button>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Icon name="Download" size={16} strokeWidth={2} />
                  <span className="font-body">Export</span>
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm font-medium text-text-secondary font-body">Received</span>
                </div>
                <p className="text-2xl font-bold text-text-primary font-heading mt-1">
                  {actionStats.received || 0}
                </p>
              </div>
              <div className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                  <span className="text-sm font-medium text-text-secondary font-body">Outgoing</span>
                </div>
                <p className="text-2xl font-bold text-text-primary font-heading mt-1">
                  {actionStats.outgoing || 0}
                </p>
              </div>
              <div className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-sm font-medium text-text-secondary font-body">Reserved</span>
                </div>
                <p className="text-2xl font-bold text-text-primary font-heading mt-1">
                  {actionStats.reserved || 0}
                </p>
              </div>
              <div className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium text-text-secondary font-body">Audits</span>
                </div>
                <p className="text-2xl font-bold text-text-primary font-heading mt-1">
                  {actionStats.audit || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <HistoryFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            totalResults={filteredHistory.length}
            historyData={historyData}
          />

          {/* Content */}
          <div className="mt-6">
            {viewMode === 'table' ? (
              <HistoryTable
                historyData={filteredHistory}
                expandedEntries={expandedEntries}
                onToggleExpansion={toggleEntryExpansion}
              />
            ) : (
              <HistoryTimeline
                historyData={filteredHistory}
                expandedEntries={expandedEntries}
                onToggleExpansion={toggleEntryExpansion}
              />
            )}
          </div>

          {/* Empty State */}
          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="Search" size={24} className="text-secondary-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary font-heading mb-2">
                No History Found
              </h3>
              <p className="text-text-secondary font-body">
                No history entries match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryJournal;