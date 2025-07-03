import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AddProductModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    article: '',
    name: '',
    initialStock: '',
    costPrice: '',
    category: '',
    supplier: '',
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
    
    if (!formData.article || !formData.name) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave({
        article: formData.article.trim().toUpperCase(),
        name: formData.name.trim(),
        initialStock: parseInt(formData.initialStock) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        category: formData.category.trim(),
        supplier: formData.supplier.trim(),
        notes: formData.notes.trim()
      });
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center p-4 bg-secondary-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-surface rounded-lg shadow-modal border border-border w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Add New Product
            </h2>
            <p className="text-sm text-text-secondary font-body mt-1">
              Create a new inventory item
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Article ID */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Article ID <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.article}
                onChange={(e) => handleInputChange('article', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-data uppercase"
                placeholder="e.g., PNL-001"
                required
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Product Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                placeholder="e.g., Standard Wall Panel 2400x1200"
                required
              />
            </div>

            {/* Initial Stock */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Initial Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.initialStock}
                onChange={(e) => handleInputChange('initialStock', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-data"
                placeholder="0"
              />
            </div>

            {/* Cost Price */}
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

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                placeholder="e.g., Wall Panels, Dividers, Accessories"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                placeholder="Supplier name"
              />
            </div>
          </div>

          {/* Notes - Full Width */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-text-primary font-body mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body resize-none"
              rows="3"
              placeholder="Additional notes about this product..."
            />
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
              disabled={!formData.article || !formData.name || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth font-body flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" strokeWidth={2} />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Icon name="Package" size={16} strokeWidth={2} />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;