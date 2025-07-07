import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserDocuments, deleteDocument } from '../services/documentService';
import DocumentCard from '../components/DocumentCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Alert from '../components/ui/Alert';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch the user's documents
    // For demo purposes, we'll just use mock data
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        // const response = await getUserDocuments();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockDocuments = [
          {
            id: '123',
            title: 'Project Management Methodology',
            subject: 'Project Management',
            description: 'A comprehensive guide to project management methodologies including Agile, Waterfall, and Scrum.',
            purpose: 'knowledge-library',
            purposeLabel: 'Knowledge Library Article',
            createdAt: '2025-07-05T10:30:00Z',
            thumbnailUrl: 'https://via.placeholder.com/150'
          },
          {
            id: '124',
            title: 'Customer Onboarding Process',
            subject: 'Customer Success',
            description: 'Step-by-step guide for onboarding new customers to our platform.',
            purpose: 'sop',
            purposeLabel: 'Standard Operating Procedure (SOP)',
            createdAt: '2025-07-03T14:15:00Z',
            thumbnailUrl: 'https://via.placeholder.com/150'
          },
          {
            id: '125',
            title: 'New Employee Orientation',
            subject: 'Human Resources',
            description: 'Training manual for new employee orientation covering company policies, benefits, and procedures.',
            purpose: 'training-manual',
            purposeLabel: 'Training Manual',
            createdAt: '2025-06-28T09:45:00Z',
            thumbnailUrl: 'https://via.placeholder.com/150'
          },
          {
            id: '126',
            title: 'Data Security Guidelines',
            subject: 'Information Security',
            description: 'Official policy document outlining data security protocols and compliance requirements.',
            purpose: 'policy-document',
            purposeLabel: 'Policy Document',
            createdAt: '2025-06-20T16:20:00Z',
            thumbnailUrl: 'https://via.placeholder.com/150'
          }
        ];
        
        setDocuments(mockDocuments);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to load documents. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);
  
  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        // In a real app, this would be an API call to delete the document
        // await deleteDocument(id);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update the documents list
        setDocuments(documents.filter(doc => doc.id !== id));
        setSuccessMessage('Document deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting document:', error);
        setError('Failed to delete document. Please try again.');
      }
    }
  };
  
  // Filter documents based on search term and purpose filter
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPurpose = filterPurpose === '' || doc.purpose === filterPurpose;
    
    return matchesSearch && matchesPurpose;
  });
  
  const purposeOptions = [
    { value: '', label: 'All Types' },
    { value: 'knowledge-library', label: 'Knowledge Library' },
    { value: 'sop', label: 'SOPs' },
    { value: 'training-manual', label: 'Training Manuals' },
    { value: 'policy-document', label: 'Policy Documents' },
    { value: 'other', label: 'Other' }
  ];
  
  return (
    <div className="container-custom mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Documents</h1>
          <p className="text-gray-600">Manage your processed documents</p>
        </div>
        <Button to="/upload" size="lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Upload New
        </Button>
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
      
      {successMessage && (
        <Alert 
          type="success"
          message={successMessage}
          className="mb-6"
          dismissible
          onDismiss={() => setSuccessMessage('')}
        />
      )}
      
      <Card className="mb-8">
        <Card.Body>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  type="text"
                  placeholder="Search by title or subject..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <Select
                id="filterPurpose"
                name="filterPurpose"
                options={purposeOptions}
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value)}
                placeholder="Filter by type"
              />
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card className="text-center py-12">
          <Card.Body>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterPurpose
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first document to get started'}
            </p>
            {!searchTerm && !filterPurpose && (
              <Button to="/upload" size="lg">
                Upload Document
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              onDelete={() => handleDeleteDocument(doc.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage