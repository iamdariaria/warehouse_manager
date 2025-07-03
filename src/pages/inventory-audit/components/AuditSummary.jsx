import React from 'react';
import Icon from 'components/AppIcon';

const AuditSummary = ({ summary }) => {
  const summaryCards = [
    {
      title: 'Total Items',
      value: summary.totalItems,
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    {
      title: 'Total Variances',
      value: summary.totalVariances,
      icon: 'AlertTriangle',
      color: summary.totalVariances > 0 ? 'text-warning' : 'text-success',
      bgColor: summary.totalVariances > 0 ? 'bg-warning-50' : 'bg-success-50',
      borderColor: summary.totalVariances > 0 ? 'border-warning-200' : 'border-success-200'
    },
    {
      title: 'Positive Variances',
      value: summary.positiveVariances,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200'
    },
    {
      title: 'Negative Variances',
      value: summary.negativeVariances,
      icon: 'TrendingDown',
      color: 'text-error',
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200'
    },
    {
      title: 'Verified Items',
      value: summary.verifiedItems,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200'
    }
  ];

  const completionPercentage = summary.totalItems > 0 
    ? Math.round((summary.verifiedItems / summary.totalItems) * 100) 
    : 0;

  return (
    <div className="mb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`bg-surface rounded-lg shadow-card border ${card.borderColor} p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary font-body">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.color} font-heading mt-1`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon 
                  name={card.icon} 
                  size={24} 
                  className={card.color}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary font-heading">
            Audit Progress
          </h3>
          <span className="text-sm text-text-secondary font-body">
            {summary.verifiedItems} of {summary.totalItems} items verified
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary font-body">
              Completion Rate
            </span>
            <span className="text-sm font-bold text-primary font-data">
              {completionPercentage}%
            </span>
          </div>
          
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-sm text-text-secondary font-body">
              No Variance: {summary.totalItems - summary.totalVariances} items
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-sm text-text-secondary font-body">
              Has Variance: {summary.totalVariances} items
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-text-secondary font-body">
              Pending: {summary.totalItems - summary.verifiedItems} items
            </span>
          </div>
        </div>

        {/* Variance Summary */}
        {summary.totalVariances > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={16} className="text-success" strokeWidth={2} />
                  <span className="text-text-secondary font-body">
                    Overstock: {summary.positiveVariances}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingDown" size={16} className="text-error" strokeWidth={2} />
                  <span className="text-text-secondary font-body">
                    Shortage: {summary.negativeVariances}
                  </span>
                </div>
              </div>
              
              {summary.totalVariances > 0 && (
                <div className="flex items-center space-x-2 text-warning-700">
                  <Icon name="AlertTriangle" size={16} strokeWidth={2} />
                  <span className="font-medium font-body">
                    Requires Attention
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditSummary;