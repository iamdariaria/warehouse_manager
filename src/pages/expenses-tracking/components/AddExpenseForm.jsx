import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AddExpenseForm = ({ projects, warehouseData, onAddExpense }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    productId: '',
    quantity: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const filteredProducts = warehouseData.filter(product =>
    product.article.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const selectedProduct = warehouseData.find(product => product.id === parseInt(formData.productId));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.productId) {
      newErrors.productId = 'Product is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be positive';
    } else if (selectedProduct && parseInt(formData.quantity) > selectedProduct.remainingStock) {
      newErrors.quantity = `Insufficient stock. Available: ${selectedProduct.remainingStock} units`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onAddExpense({
        projectId: parseInt(formData.projectId),
        date: formData.date,
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity)
      });

      // Reset form
      setFormData({
        projectId: '',
        date: new Date().toISOString().split('T')[0],
        productId: '',
        quantity: ''
      });
      setProductSearch('');
      setErrors({});
    } catch (error) {
      console.error('Error adding expense:', error);
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

  const handleProductSelect = (product) => {
    setFormData(prev => ({ ...prev, productId: product.id.toString() }));
    setProductSearch(`${product.article} - ${product.name}`);
    setShowProductDropdown(false);
    if (errors.productId) {
      setErrors(prev => ({ ...prev, productId: '' }));
    }
  };

  const handleProductSearchChange = (value) => {
    setProductSearch(value);
    setFormData(prev => ({ ...prev, productId: '' }));
    setShowProductDropdown(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Selection */}
      <div>
        <label className="block text-sm font-medium text-text-primary font-body mb-2">
          Project *
        </label>
        <select
          value={formData.projectId}
          onChange={(e) => handleInputChange('projectId', e.target.value)}
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

      {/* Product Autocomplete */}
      <div className="relative">
        <label className="block text-sm font-medium text-text-primary font-body mb-2">
          Product *
        </label>
        <div className="relative">
          <input
            type="text"
            value={productSearch}
            onChange={(e) => handleProductSearchChange(e.target.value)}
            onFocus={() => setShowProductDropdown(true)}
            placeholder="Search by article or name..."
            className={`
              w-full px-4 py-3 pr-10 border rounded-lg transition-smooth font-body
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              ${errors.productId 
                ? 'border-error bg-error-50 text-error-700' :'border-border bg-surface text-text-primary hover:border-secondary-300'
              }
            `}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon name="Search" size={18} className="text-text-muted" strokeWidth={2} />
          </div>
        </div>

        {/* Product Dropdown */}
        {showProductDropdown && filteredProducts.length > 0 && (
          <div className="absolute z-200 w-full mt-1 bg-surface border border-border rounded-lg shadow-modal max-h-60 overflow-y-auto">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleProductSelect(product)}
                className="w-full px-4 py-3 text-left hover:bg-secondary-50 transition-smooth focus:outline-none focus:bg-secondary-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary font-body">
                      {product.article} - {product.name}
                    </p>
                    <p className="text-sm text-text-secondary font-body">
                      Available: {product.remainingStock} units • ${product.costPrice.toFixed(2)}
                    </p>
                  </div>
                  {product.remainingStock <= 5 && (
                    <div className="flex items-center space-x-1 text-error">
                      <Icon name="AlertTriangle" size={16} strokeWidth={2} />
                      <span className="text-xs font-body">Low Stock</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {errors.productId && (
          <p className="mt-1 text-sm text-error font-body">{errors.productId}</p>
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
          placeholder="Enter quantity"
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
            <div className="flex items-center justify-between text-sm font-body">
              <span className="text-text-secondary">Total Cost:</span>
              <span className="font-semibold text-text-primary">
                ${(parseInt(formData.quantity) * selectedProduct.costPrice).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-body mt-1">
              <span className="text-text-secondary">Remaining After:</span>
              <span className={`font-semibold ${
                selectedProduct.remainingStock - parseInt(formData.quantity) <= 5 
                  ? 'text-error' :'text-text-primary'
              }`}>
                {selectedProduct.remainingStock - parseInt(formData.quantity)} units
              </span>
            </div>
          </div>
        )}
        {errors.quantity && (
          <p className="mt-1 text-sm text-error font-body">{errors.quantity}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium font-body"
      >
        {isSubmitting ? (
          <>
            <Icon name="Loader2" size={20} className="animate-spin" strokeWidth={2} />
            <span>Adding Expense...</span>
          </>
        ) : (
          <>
            <Icon name="Plus" size={20} strokeWidth={2} />
            <span>Add Expense</span>
          </>
        )}
      </button>
    </form>
  );
};

export default AddExpenseForm;