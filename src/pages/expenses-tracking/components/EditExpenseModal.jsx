import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const EditExpenseModal = ({ expense, projects, warehouseData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    projectId: expense.projectId,
    date: expense.date,
    quantity: expense.quantity
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = warehouseData.find(product => product.article === expense.article);
  const selectedProject = projects.find(project => project.id === formData.projectId);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be positive';
    } else if (selectedProduct) {
      const stockDifference = parseInt(formData.quantity) - expense.quantity;
      if (stockDifference > 0 && stockDifference > selectedProduct.remainingStock) {
        newErrors.quantity = `Insufficient stock for increase. Available: ${selectedProduct.remainingStock} units`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSave(expense.id, {
        projectId: parseInt(formData.projectId),
        date: formData.date,
        quantity: parseInt(formData.quantity)
      });
    } catch (error) {
      console.error('Error updating expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const stockDifference = parseInt(formData.quantity) - expense.quantity;
  const newRemainingStock = selectedProduct ? selectedProduct.remainingStock - stockDifference : 0;

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-secondary-900 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-surface rounded-lg shadow-modal border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Edit Expense
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Icon name="X" size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Package" size={20} className="text-primary" strokeWidth={2} />
              <div>
                <p className="font-medium text-text-primary font-body">
                  {expense.article} - {expense.productName}
                </p>
                <p className="text-sm text-text-secondary font-body">
                  Unit Cost: ${expense.unitCost.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Project *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => handleInputChange('projectId', parseInt(e.target.value))}
                className={`
                  w-full px-4 py-3 border rounded-lg transition-smooth font-body
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                  ${errors.projectId 
                    ? 'border-error bg-error-50 text-error-700' :'border-border bg-surface text-text-primary hover:border-secondary-300'
                  }
                `}
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.code} - {project.name}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="mt-1 text-sm text-error font-body">{errors.projectId}</p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`
                  w-full px-4 py-3 border rounded-lg transition-smooth font-body
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                  ${errors.date 
                    ? 'border-error bg-error-50 text-error-700' :'border-border bg-surface text-text-primary hover:border-secondary-300'
                  }
                `}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-error font-body">{errors.date}</p>
              )}
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg transition-smooth font-body
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                  ${errors.quantity 
                    ? 'border-error bg-error-50 text-error-700' :'border-border bg-surface text-text-primary hover:border-secondary-300'
                  }
                `}
              />
              {selectedProduct && formData.quantity && (
                <div className="mt-2 p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm font-body mb-1">
                    <span className="text-text-secondary">New Total Cost:</span>
                    <span className="font-semibold text-text-primary">
                      ${(parseInt(formData.quantity) * expense.unitCost).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-body mb-1">
                    <span className="text-text-secondary">Stock Change:</span>
                    <span className={`font-semibold ${stockDifference > 0 ? 'text-error' : stockDifference < 0 ? 'text-success' : 'text-text-primary'}`}>
                      {stockDifference > 0 ? '-' : stockDifference < 0 ? '+' : ''}{Math.abs(stockDifference)} units
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-body">
                    <span className="text-text-secondary">Remaining After:</span>
                    <span className={`font-semibold ${newRemainingStock <= 5 ? 'text-error' : 'text-text-primary'}`}>
                      {newRemainingStock} units
                    </span>
                  </div>
                </div>
              )}
              {errors.quantity && (
                <p className="mt-1 text-sm text-error font-body">{errors.quantity}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium font-body"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium font-body"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin" strokeWidth={2} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Save" size={18} strokeWidth={2} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditExpenseModal;