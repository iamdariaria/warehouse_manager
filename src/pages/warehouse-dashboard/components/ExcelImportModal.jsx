import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const ExcelImportModal = ({ onImport, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setError('');
    
    // Validate file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please select a valid Excel (.xlsx, .xls) or CSV file');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      return;
    }

    setFile(selectedFile);
    processFile(selectedFile);
  };

  const processFile = (file) => {
    setIsProcessing(true);
    
    // Mock file processing - in real app would use library like xlsx or papa-parse
    setTimeout(() => {
      const mockData = [
        {
          article: 'PNL-003',
          name: 'Premium Wall Panel 2400x1200',
          initialStock: 30,
          costPrice: 145.75,
          category: 'Wall Panels',
          supplier: 'Premium Materials Ltd'
        },
        {
          article: 'DIV-003',
          name: 'Acoustic Divider 1800x900',
          initialStock: 15,
          costPrice: 189.50,
          category: 'Dividers',
          supplier: 'Sound Solutions Inc'
        },
        {
          article: 'ACC-003',
          name: 'Corner Brackets Set',
          initialStock: 100,
          costPrice: 15.25,
          category: 'Accessories',
          supplier: 'Hardware Plus'
        }
      ];
      
      setPreviewData(mockData);
      setIsProcessing(false);
    }, 2000);
  };

  const handleImport = async () => {
    if (!previewData.length) return;
    
    setIsProcessing(true);
    
    try {
      await onImport(previewData);
      onClose();
    } catch (error) {
      setError('Failed to import data. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    // Mock template download - in real app would generate actual Excel file
    const csvContent = "Article,Name,Initial Stock,Cost Price,Category,Supplier\nPNL-001,\"Standard Wall Panel 2400x1200\",50,125.50,\"Wall Panels\",\"Standard Materials Co\"";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center p-4 bg-secondary-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-surface rounded-lg shadow-modal border border-border w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Import Inventory from Excel
            </h2>
            <p className="text-sm text-text-secondary font-body mt-1">
              Upload an Excel or CSV file to bulk import inventory items
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!file ? (
            <div className="space-y-6">
              {/* Template Download */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-primary mt-0.5" strokeWidth={2} />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-primary font-body mb-2">
                      Download Template First
                    </h3>
                    <p className="text-sm text-primary-700 font-body mb-3">
                      Use our template to ensure your data is formatted correctly for import.
                    </p>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center space-x-2 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-700 transition-smooth font-body"
                    >
                      <Icon name="Download" size={16} strokeWidth={2} />
                      <span>Download Template</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* File Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
                  dragActive
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-primary-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mx-auto">
                    <Icon name="Upload" size={32} className="text-text-muted" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary font-heading mb-2">
                      Drop your file here
                    </h3>
                    <p className="text-text-secondary font-body mb-4">
                      Supports Excel (.xlsx, .xls) and CSV files up to 5MB
                    </p>
                    <button
                      onClick={handleFileInputClick}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>

              {error && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error-700" strokeWidth={2} />
                    <span className="text-sm text-error-700 font-body">{error}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={20} className="text-text-secondary" strokeWidth={2} />
                    <div>
                      <div className="text-sm font-medium text-text-primary font-body">
                        {file.name}
                      </div>
                      <div className="text-xs text-text-muted font-body">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreviewData([]);
                      setError('');
                    }}
                    className="p-2 text-text-secondary hover:text-error hover:bg-error-50 rounded-lg transition-smooth"
                  >
                    <Icon name="X" size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Processing State */}
              {isProcessing && (
                <div className="text-center py-8">
                  <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" strokeWidth={2} />
                  <p className="text-text-secondary font-body">Processing file...</p>
                </div>
              )}

              {/* Preview Data */}
              {previewData.length > 0 && !isProcessing && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary font-heading mb-4">
                    Preview ({previewData.length} items)
                  </h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-secondary-50">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs font-medium text-text-primary font-body">Article</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-text-primary font-body">Name</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-text-primary font-body">Stock</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-text-primary font-body">Cost</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-text-primary font-body">Category</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-text-primary font-body">Supplier</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {previewData.slice(0, 5).map((item, index) => (
                            <tr key={index} className="hover:bg-secondary-50">
                              <td className="py-3 px-4 text-sm font-medium text-text-primary font-data">
                                {item.article}
                              </td>
                              <td className="py-3 px-4 text-sm text-text-primary font-body">
                                {item.name}
                              </td>
                              <td className="py-3 px-4 text-sm text-center text-text-primary font-data">
                                {item.initialStock}
                              </td>
                              <td className="py-3 px-4 text-sm text-center text-text-primary font-data">
                                ${item.costPrice.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-sm text-text-primary font-body">
                                {item.category}
                              </td>
                              <td className="py-3 px-4 text-sm text-text-primary font-body">
                                {item.supplier}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {previewData.length > 5 && (
                      <div className="bg-secondary-50 py-2 px-4 text-center text-xs text-text-muted font-body">
                        ... and {previewData.length - 5} more items
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error-700" strokeWidth={2} />
                    <span className="text-sm text-error-700 font-body">{error}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-border">
          <button
            onClick={() => {
              setFile(null);
              setPreviewData([]);
              setError('');
            }}
            className="px-4 py-2 text-text-secondary border border-border rounded-lg hover:bg-secondary-50 transition-smooth font-body"
            disabled={isProcessing}
          >
            Reset
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary border border-border rounded-lg hover:bg-secondary-50 transition-smooth font-body"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!previewData.length || isProcessing}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth font-body flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" strokeWidth={2} />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Icon name="Upload" size={16} strokeWidth={2} />
                  <span>Import {previewData.length} Items</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportModal;