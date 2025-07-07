import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAndProcessDocument } from '../services/uploadService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import FileUpload from '../components/ui/FileUpload';
import ProgressBar from '../components/ui/ProgressBar';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    purpose: 'knowledge-library',
    action: 'create-document',
    customPurpose: '',
  });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create form data for upload
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('subject', formData.subject);
      uploadData.append('purpose', formData.purpose === 'other' ? formData.customPurpose : formData.purpose);
      uploadData.append('action', formData.action);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);
      
      // In a real app, this would be an API call to upload and process the file
      // For demo purposes, we'll just simulate a successful upload and processing
      // const response = await uploadAndProcessDocument(uploadData);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setUploadProgress(100);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the document view page with a fake document ID
      navigate('/documents/123');
    } catch (err) {
      setError('Upload failed. Please try again.');
      setIsUploading(false);
      console.error(err);
    }
  };
  
  const purposeOptions = [
    { value: 'knowledge-library', label: 'Knowledge Library Article' },
    { value: 'sop', label: 'Standard Operating Procedure (SOP)' },
    { value: 'training-manual', label: 'Training Manual' },
    { value: 'policy-document', label: 'Policy Document' },
    { value: 'other', label: 'Other' }
  ];
  
  const actionOptions = [
    { value: 'create-document', label: 'Analyse text and create a document' },
    { value: 'summarize', label: 'Summarise content' },
    { value: 'step-by-step', label: 'Create step-by-step instructions' },
    { value: 'extract-key-points', label: 'Extract key points and FAQs' }
  ];
  
  return (
    <div className="container-custom mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Handwritten Notes</h1>
          <p className="text-gray-600">
            Upload your handwritten notes and convert them into structured digital documents.
          </p>
        </div>
        
        {error && (
          <Alert 
            type="error"
            message={error}
            className="mb-6"
            dismissible
            onDismiss={() => setError('')}
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Document Information</h2>
            </Card.Header>
            
            <Card.Body className="space-y-4">
              <Input
                label="Subject"
                id="subject"
                name="subject"
                placeholder="What is the topic of the notes?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              
              <Select
                label="Purpose"
                id="purpose"
                name="purpose"
                options={purposeOptions}
                value={formData.purpose}
                onChange={handleChange}
                required
              />
              
              {formData.purpose === 'other' && (
                <Input
                  label="Custom Purpose"
                  id="customPurpose"
                  name="customPurpose"
                  placeholder="Specify purpose"
                  value={formData.customPurpose}
                  onChange={handleChange}
                  required
                />
              )}
              
              <Select
                label="Action Required"
                id="action"
                name="action"
                options={actionOptions}
                value={formData.action}
                onChange={handleChange}
                required
              />
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Upload File</h2>
            </Card.Header>
            
            <Card.Body>
              <FileUpload
                label="Upload your handwritten notes"
                id="file"
                name="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                helpText="Supports: JPG, PNG, PDF (Max 10MB)"
                error={error && !file ? error : ''}
              />
            </Card.Body>
          </Card>
          
          {isUploading && (
            <Card>
              <Card.Body>
                <h3 className="text-lg font-medium mb-4">Processing your document...</h3>
                <ProgressBar 
                  value={uploadProgress} 
                  color="primary"
                  size="lg"
                  label="Upload Progress"
                />
                <p className="text-sm text-gray-600 mt-2">
                  {uploadProgress < 100
                    ? `Uploading and processing... ${uploadProgress}%`
                    : 'Processing complete! Redirecting...'}
                </p>
              </Card.Body>
            </Card>
          )}
          
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isUploading}
              isLoading={isUploading}
            >
              {isUploading ? 'Processing...' : 'Upload & Process'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage