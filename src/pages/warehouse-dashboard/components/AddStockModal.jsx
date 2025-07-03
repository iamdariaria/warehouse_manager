import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AddStockModal = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    costPrice: item?.costPrice || 0,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(item?.id, {
        quantity: parseInt(formData.quantity),
        date: formData.date,
        costPrice: parseFloat(formData.costPrice) || 0,
        notes: formData.notes.trim()
      });
      onClose();
    } catch (error) {
      console.error('Error adding stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const newRemainingStock = (item?.remainingStock || 0) + parseInt(formData.quantity || 0);

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center p-4 bg-secondary-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-surface rounded-lg shadow-modal border border-border w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Add Stock
            </h2>
            <p className="text-sm text-text-secondary font-body mt-1">
              {item?.article} - {item?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Current Stock Info */}
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary font-body">Current Stock:</span>
                <span className="text-sm font-medium text-text-primary font-data">
                  {item?.remainingStock || 0} units
                </span>
              </div>
              {formData.quantity && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                  <span className="text-sm text-text-secondary font-body">New Stock:</span>
                  <span className="text-sm font-medium text-primary font-data">
                    {newRemainingStock} units
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Quantity to Add <span className="text-error">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-data"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-data"
                required
              />
            </div>

            {/* Cost Price Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Cost Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-data"
                placeholder="0.00"
              />
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body resize-none"
                rows="3"
                placeholder="Additional notes about this stock addition..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-text-secondary border border-border rounded-lg hover:bg-secondary-50 transition-smooth font-body"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.quantity || parseInt(formData.quantity) <= 0 || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth font-body flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" strokeWidth={2} />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Icon name="Plus" size={16} strokeWidth={2} />
                  <span>Add Stock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;