import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ReserveProjectCard = ({ reserve, onEdit, onDelete, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusToggle = () => {
    const newStatus = reserve.status === 'Active' ? 'Cancelled' : 'Active';
    onStatusChange(reserve.id, newStatus);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    return status === 'Active' ?'text-success bg-success-50 border-success-200' :'text-text-secondary bg-secondary-50 border-secondary-200';
  };

  return (
    <div className={`bg-surface rounded-lg shadow-card border transition-smooth ${
      reserve.status === 'Active' ? 'border-success-200' : 'border-border'
    }`}>
      {/* Card Header */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-semibold text-text-primary font-heading">
                {reserve.projectName}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reserve.status)}`}>
                {reserve.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary font-body">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={16} strokeWidth={2} />
                <span>Reserved: {formatDate(reserve.reservationDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Package" size={16} strokeWidth={2} />
                <span>{reserve.totalItems} items</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Hash" size={16} strokeWidth={2} />
                <span>{reserve.totalQuantity} units</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="User" size={16} strokeWidth={2} />
                <span>by {reserve.createdBy}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status Toggle */}
            <button
              onClick={handleStatusToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-touch ${
                reserve.status === 'Active' ?'text-text-secondary hover:text-text-primary hover:bg-secondary-50 focus:ring-secondary' :'text-success hover:text-success-700 hover:bg-success-50 focus:ring-success'
              }`}
              title={reserve.status === 'Active' ? 'Cancel Reserve' : 'Activate Reserve'}
            >
              <Icon 
                name={reserve.status === 'Active' ? 'XCircle' : 'CheckCircle'} 
                size={18} 
                strokeWidth={2} 
              />
            </button>

            {/* Edit Button */}
            <button
              onClick={() => onEdit(reserve)}
              className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-touch min-w-touch"
              title="Edit Reserve"
            >
              <Icon name="Edit" size={18} strokeWidth={2} />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(reserve.id)}
              className="p-2 text-text-secondary hover:text-error hover:bg-error-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 min-h-touch min-w-touch"
              title="Delete Reserve"
            >
              <Icon name="Trash2" size={18} strokeWidth={2} />
            </button>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 min-h-touch min-w-touch"
              title={isExpanded ? 'Collapse Details' : 'Expand Details'}
            >
              <Icon 
                name="ChevronDown" 
                size={18} 
                className={`transition-smooth ${isExpanded ? 'rotate-180' : ''}`}
                strokeWidth={2} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Items List */}
      {isExpanded && (
        <div className="border-t border-border">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-text-primary mb-4 font-heading">
              Reserved Items
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary font-heading">
                      Article
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary font-heading">
                      Product Name
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary font-heading">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary font-heading">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reserve.items.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`${index !== reserve.items.length - 1 ? 'border-b border-border' : ''} hover:bg-secondary-50 transition-smooth`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-text-primary font-data">
                          {item.article}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-text-primary font-body">
                          {item.productName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-700">
                          {item.reservedQuantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-text-secondary text-sm font-body">
                          {item.comments || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReserveProjectCard;