import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AddReserveModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    reservationDate: '',
    items: [{ article: '', productName: '', reservedQuantity: '', comments: '' }],
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  // Mock warehouse products for selection
  const mockProducts = [
    { article: "PNL-001", productName: "Acoustic Panel Standard", availableStock: 45 },
    { article: "PNL-002", productName: "Fire Resistant Panel", availableStock: 32 },
    { article: "PNL-004", productName: "Industrial Sound Barrier", availableStock: 28 },
    { article: "DIV-001", productName: "Modular Room Divider", availableStock: 18 },
    { article: "DIV-003", productName: "Glass Partition System", availableStock: 12 },
    { article: "ACC-001", productName: "Standard Mounting Kit", availableStock: 75 },
    { article: "ACC-003", productName: "Vibration Dampener", availableStock: 40 },
    { article: "ACC-005", productName: "Heavy Duty Brackets", availableStock: 65 }
  ];

  const mockProjects = [
    "Office Renovation Phase 1",
    "Office Renovation Phase 2", 
    "Warehouse Expansion",
    "Factory Floor Upgrade",
    "Client Demo Setup",
    "R&D Lab Setup",
    "Showroom Redesign"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Auto-fill product name when article is selected
    if (field === 'article') {
      const product = mockProducts.find(p => p.article === value);
      if (product) {
        updatedItems[index].productName = product.productName;
      }
    }

    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));

    // Clear item-specific errors
    const errorKey = `items.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { article: '', productName: '', reservedQuantity: '', comments: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate project name
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    // Validate reservation date
    if (!formData.reservationDate) {
      newErrors.reservationDate = 'Reservation date is required';
    } else {
      const selectedDate = new Date(formData.reservationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.reservationDate = 'Reservation date cannot be in the past';
      }
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.article) {
        newErrors[`items.${index}.article`] = 'Article is required';
      }
      if (!item.productName.trim()) {
        newErrors[`items.${index}.productName`] = 'Product name is required';
      }
      if (!item.reservedQuantity || item.reservedQuantity <= 0) {
        newErrors[`items.${index}.reservedQuantity`] = 'Valid quantity is required';
      } else {
        const product = mockProducts.find(p => p.article === item.article);
        if (product && parseInt(item.reservedQuantity) > product.availableStock) {
          newErrors[`items.${index}.reservedQuantity`] = `Only ${product.availableStock} units available`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const totalItems = formData.items.length;
      const totalQuantity = formData.items.reduce((sum, item) => sum + parseInt(item.reservedQuantity || 0), 0);
      
      const reserveData = {
        ...formData,
        totalItems,
        totalQuantity,
        items: formData.items.map((item, index) => ({
          id: Date.now() + index,
          ...item,
          reservedQuantity: parseInt(item.reservedQuantity)
        }))
      };
      
      onSave(reserveData);
    }
  };

  const handleClose = () => {
    setFormData({
      projectName: '',
      reservationDate: '',
      items: [{ article: '', productName: '', reservedQuantity: '', comments: '' }],
      status: 'Active'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-500 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-secondary-900 bg-opacity-50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-modal rounded-lg border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Add New Reserve
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Icon name="X" size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Project and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    list="projects"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body min-h-touch ${
                      errors.projectName ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Enter or select project name"
                  />
                  <datalist id="projects">
                    {mockProjects.map(project => (
                      <option key={project} value={project} />
                    ))}
                  </datalist>
                  {errors.projectName && (
                    <p className="text-error text-sm mt-1 font-body">{errors.projectName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                    Reservation Date *
                  </label>
                  <input
                    type="date"
                    value={formData.reservationDate}
                    onChange={(e) => handleInputChange('reservationDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body min-h-touch ${
                      errors.reservationDate ? 'border-error' : 'border-border'
                    }`}
                  />
                  {errors.reservationDate && (
                    <p className="text-error text-sm mt-1 font-body">{errors.reservationDate}</p>
                  )}
                </div>
              </div>

              {/* Items Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary font-heading">
                    Reserved Items
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-600 transition-smooth focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center space-x-2 font-body"
                  >
                    <Icon name="Plus" size={16} strokeWidth={2} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-text-primary font-body">
                          Item {index + 1}
                        </h4>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1 text-error hover:bg-error-50 rounded transition-smooth focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                          >
                            <Icon name="Trash2" size={16} strokeWidth={2} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-1 font-body">
                            Article *
                          </label>
                          <select
                            value={item.article}
                            onChange={(e) => handleItemChange(index, 'article', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body min-h-touch ${
                              errors[`items.${index}.article`] ? 'border-error' : 'border-border'
                            }`}
                          >
                            <option value="">Select Article</option>
                            {mockProducts.map(product => (
                              <option key={product.article} value={product.article}>
                                {product.article} (Stock: {product.availableStock})
                              </option>
                            ))}
                          </select>
                          {errors[`items.${index}.article`] && (
                            <p className="text-error text-xs mt-1 font-body">{errors[`items.${index}.article`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-1 font-body">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body min-h-touch ${
                              errors[`items.${index}.productName`] ? 'border-error' : 'border-border'
                            }`}
                            placeholder="Product name"
                          />
                          {errors[`items.${index}.productName`] && (
                            <p className="text-error text-xs mt-1 font-body">{errors[`items.${index}.productName`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-1 font-body">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.reservedQuantity}
                            onChange={(e) => handleItemChange(index, 'reservedQuantity', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body min-h-touch ${
                              errors[`items.${index}.reservedQuantity`] ? 'border-error' : 'border-border'
                            }`}
                            placeholder="0"
                          />
                          {errors[`items.${index}.reservedQuantity`] && (
                            <p className="text-error text-xs mt-1 font-body">{errors[`items.${index}.reservedQuantity`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-1 font-body">
                            Comments
                          </label>
                          <input
                            type="text"
                            value={item.comments}
                            onChange={(e) => handleItemChange(index, 'comments', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body min-h-touch"
                            placeholder="Optional comments"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-border">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 font-body min-h-touch"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body min-h-touch"
              >
                Create Reserve
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReserveModal;