import React, { useState, useMemo } from 'react';
import Icon from 'components/AppIcon';

const AuditHistory = ({ auditHistory, onClose }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'auditDate', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('all');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedHistory = React.useMemo(() => {
    let filtered = auditHistory;
    
    if (filterStatus !== 'all') {
      filtered = auditHistory.filter(audit => 
        audit.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    return [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [auditHistory, sortConfig, filterStatus]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-success-700 bg-success-50 border-success-200';
      case 'in progress':
        return 'text-warning-700 bg-warning-50 border-warning-200';
      case 'cancelled':
        return 'text-error-700 bg-error-50 border-error-200';
      default:
        return 'text-text-secondary bg-secondary-50 border-border';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-300 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-secondary-900 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-modal rounded-lg border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold text-text-primary font-heading">
                Audit History
              </h3>
              <p className="mt-1 text-sm text-text-secondary font-body">
                View previous inventory audit records and results
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Close audit history"
            >
              <Icon name="X" size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-border bg-secondary-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1 font-body">
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in progress">In Progress</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-text-secondary font-body">
                Showing {filteredAndSortedHistory.length} of {auditHistory.length} audits
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {filteredAndSortedHistory.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="FileText" size={48} className="text-secondary-300 mx-auto mb-4" strokeWidth={1.5} />
                <h4 className="text-lg font-medium text-text-primary mb-2 font-heading">
                  No Audit History
                </h4>
                <p className="text-text-secondary font-body">
                  {filterStatus === 'all' ?'No previous audits have been conducted yet.'
                    : `No audits found with status "${filterStatus}".`
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead className="bg-secondary-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <button
                            onClick={() => handleSort('auditDate')}
                            className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth font-body"
                          >
                            <span>Audit Date</span>
                            <Icon 
                              name={sortConfig.key === 'auditDate' && sortConfig.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                              size={14} 
                              strokeWidth={2}
                            />
                          </button>
                        </th>
                        
                        <th className="px-6 py-3 text-left">
                          <button
                            onClick={() => handleSort('auditorName')}
                            className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth font-body"
                          >
                            <span>Auditor</span>
                            <Icon 
                              name={sortConfig.key === 'auditorName' && sortConfig.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                              size={14} 
                              strokeWidth={2}
                            />
                          </button>
                        </th>
                        
                        <th className="px-6 py-3 text-center">
                          <span className="text-sm font-medium text-text-primary font-body">Items</span>
                        </th>
                        
                        <th className="px-6 py-3 text-center">
                          <span className="text-sm font-medium text-text-primary font-body">Variances</span>
                        </th>
                        
                        <th className="px-6 py-3 text-center">
                          <button
                            onClick={() => handleSort('status')}
                            className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth font-body mx-auto"
                          >
                            <span>Status</span>
                            <Icon 
                              name={sortConfig.key === 'status' && sortConfig.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                              size={14} 
                              strokeWidth={2}
                            />
                          </button>
                        </th>
                        
                        <th className="px-6 py-3 text-left">
                          <span className="text-sm font-medium text-text-primary font-body">Created</span>
                        </th>
                      </tr>
                    </thead>
                    
                    <tbody>
                      {filteredAndSortedHistory.map((audit) => (
                        <tr key={audit.id} className="hover:bg-secondary-50 transition-smooth">
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-text-primary font-data">
                              {formatDate(audit.auditDate)}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                                <Icon name="User" size={12} color="#2563EB" strokeWidth={2} />
                              </div>
                              <span className="text-sm text-text-primary font-body">
                                {audit.auditorName}
                              </span>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-medium text-text-primary font-data">
                              {audit.totalItems}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 text-center">
                            <span className={`text-sm font-medium font-data ${
                              audit.totalVariances > 0 ? 'text-warning-700' : 'text-success-700'
                            }`}>
                              {audit.totalVariances}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(audit.status)}`}>
                              {audit.status}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4">
                            <span className="text-sm text-text-secondary font-data">
                              {formatDateTime(audit.createdAt)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden">
                  {filteredAndSortedHistory.map((audit) => (
                    <div key={audit.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-text-primary font-data">
                            {formatDate(audit.auditDate)}
                          </h4>
                          <p className="text-xs text-text-secondary font-body">
                            by {audit.auditorName}
                          </p>
                        </div>
                        
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(audit.status)}`}>
                          {audit.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-text-muted font-body">Items Audited</div>
                          <div className="text-sm font-medium text-text-primary font-data">
                            {audit.totalItems}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-text-muted font-body">Variances Found</div>
                          <div className={`text-sm font-medium font-data ${
                            audit.totalVariances > 0 ? 'text-warning-700' : 'text-success-700'
                          }`}>
                            {audit.totalVariances}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-text-secondary font-data">
                        Created: {formatDateTime(audit.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-border bg-secondary-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditHistory;