import { useState, useRef, forwardRef } from 'react';

const FileUpload = forwardRef(({
  label,
  id,
  name,
  accept = '.pdf,.jpg,.jpeg,.png',
  error,
  className = '',
  containerClassName = '',
  labelClassName = '',
  helpText,
  onChange,
  multiple = false,
  ...props
}, ref) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    
    if (onChange) {
      onChange({
        target: {
          name,
          files: e.target.files,
          value: e.target.value,
        },
      });
    }
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    
    // Filter files based on accept attribute
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const filteredFiles = droppedFiles.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      const fileType = file.type;
      
      return acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          // Check file extension
          return fileExtension === type.toLowerCase();
        } else {
          // Check MIME type
          return fileType.match(new RegExp(type.replace('*', '.*')));
        }
      });
    });
    
    if (filteredFiles.length > 0) {
      setFiles(filteredFiles);
      
      // Create a new event-like object to pass to onChange
      if (onChange) {
        const dataTransfer = new DataTransfer();
        filteredFiles.forEach(file => dataTransfer.items.add(file));
        
        onChange({
          target: {
            name,
            files: dataTransfer.files,
            value: filteredFiles.map(f => f.name).join(', '),
          },
        });
      }
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // Create a new event-like object to pass to onChange
    if (onChange) {
      const dataTransfer = new DataTransfer();
      newFiles.forEach(file => dataTransfer.items.add(file));
      
      onChange({
        target: {
          name,
          files: dataTransfer.files,
          value: newFiles.map(f => f.name).join(', '),
        },
      });
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${className}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={ref || fileInputRef}
          type="file"
          id={id}
          name={name}
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          multiple={multiple}
          {...props}
        />
        
        <div className="space-y-2 py-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <p className="text-sm text-gray-600">
            Drag and drop your {multiple ? 'files' : 'file'} here, or{' '}
            <span className="text-primary-600 font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-500">
            {accept.split(',').join(', ')} {multiple ? 'files' : 'file'} up to 10MB
          </p>
        </div>
      </div>
      
      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
              <div className="flex items-center flex-1 min-w-0">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="flex-shrink-0 h-5 w-5 text-gray-400" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <div className="ml-2 flex-1 truncate">
                  <span className="truncate">{file.name}</span>
                  <span className="text-gray-500 ml-1">({formatFileSize(file.size)})</span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={`${id}-description`}>
          {helpText}
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;