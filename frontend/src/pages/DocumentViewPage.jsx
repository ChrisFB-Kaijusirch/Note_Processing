import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDocumentById, deleteDocument } from '../services/documentService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import ReactMarkdown from 'react-markdown';

const DocumentViewPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch the document details
    // For demo purposes, we'll just use mock data
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        // const response = await getDocumentById(id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock document data
        const mockDocument = {
          id,
          title: 'Project Management Methodology',
          subject: 'Project Management',
          description: 'A comprehensive guide to project management methodologies including Agile, Waterfall, and Scrum.',
          purpose: 'knowledge-library',
          purposeLabel: 'Knowledge Library Article',
          createdAt: '2025-07-05T10:30:00Z',
          content: `# Project Management Methodology

## Introduction

This document outlines the standard project management methodology to be used across all company projects. It provides a structured approach to project planning, execution, monitoring, and closure.

## Project Lifecycle

### 1. Initiation Phase

- Define project goals and objectives
- Identify key stakeholders
- Develop project charter
- Conduct feasibility study
- Obtain project approval

### 2. Planning Phase

- Create detailed project plan
- Define scope and deliverables
- Develop work breakdown structure (WBS)
- Estimate resources and budget
- Create risk management plan
- Establish communication plan

### 3. Execution Phase

- Assemble project team
- Assign resources
- Execute project tasks
- Implement quality assurance processes
- Manage stakeholder expectations

### 4. Monitoring and Control Phase

- Track project progress
- Compare actual vs planned performance
- Implement corrective actions
- Manage changes to project scope
- Report project status to stakeholders

### 5. Closure Phase

- Deliver final product/service
- Obtain client acceptance
- Document lessons learned
- Release project resources
- Celebrate project completion

## Key Project Documents

1. Project Charter
2. Project Management Plan
3. Risk Register
4. Change Request Log
5. Status Reports
6. Project Closure Report

## Roles and Responsibilities

### Project Sponsor
- Provides financial resources
- Approves major deliverables
- Resolves issues beyond project manager's authority

### Project Manager
- Develops project plan
- Manages day-to-day project activities
- Monitors project progress
- Communicates with stakeholders

### Team Members
- Execute assigned tasks
- Report progress to project manager
- Identify and escalate issues
- Contribute to quality assurance

## Project Success Criteria

- Delivered on time
- Completed within budget
- Meets all requirements and specifications
- Achieves stakeholder satisfaction
- Complies with quality standards`,
          originalFile: {
            name: 'project_management_notes.pdf',
            url: 'https://example.com/files/project_management_notes.pdf'
          },
          thumbnailUrl: 'https://via.placeholder.com/300'
        };
        
        setDocument(mockDocument);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to load document. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchDocument();
  }, [id]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleDownload = () => {
    // In a real app, this would download the actual document
    alert('Document download started');
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        // In a real app, this would call an API to delete the document
        // await deleteDocument(id);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        navigate('/documents', { state: { message: 'Document deleted successfully' } });
      } catch (error) {
        setError('Failed to delete document. Please try again.');
        console.error(error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="container-custom mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="container-custom mx-auto py-8">
        <Card className="text-center py-12">
          <Card.Body>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Document not found</h3>
            <p className="text-gray-600 mb-6">
              The document you're looking for doesn't exist or has been deleted.
            </p>
            <Button to="/documents" variant="primary">
              Back to Documents
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container-custom mx-auto py-8">
      <div className="mb-6">
        <Button 
          to="/documents" 
          variant="ghost" 
          className="flex items-center text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Documents
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
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Card className="mb-6">
            <Card.Body>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
                  <p className="text-gray-600 mt-1">{document.subject}</p>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {document.purposeLabel}
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created on {formatDate(document.createdAt)}
              </div>
              
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    className={`${
                      activeTab === 'preview'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setActiveTab('preview')}
                  >
                    Preview
                  </button>
                  <button
                    className={`${
                      activeTab === 'original'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setActiveTab('original')}
                  >
                    Original File
                  </button>
                </nav>
              </div>
              
              {activeTab === 'preview' ? (
                <div className="prose prose-primary max-w-none">
                  <ReactMarkdown>
                    {document.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{document.originalFile.name}</h3>
                  <p className="text-gray-600 mb-6">
                    Original uploaded file
                  </p>
                  <Button
                    as="a"
                    href={document.originalFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Original
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
        
        <div className="lg:w-1/3">
          <Card className="mb-6">
            <Card.Header>
              <h2 className="text-xl font-semibold">Actions</h2>
            </Card.Header>
            
            <Card.Body className="space-y-3">
              <Button
                onClick={handleDownload}
                variant="secondary"
                className="w-full justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </Button>
              
              <Button
                onClick={handlePrint}
                variant="secondary"
                className="w-full justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </Button>
              
              <Button
                onClick={handleDelete}
                variant="danger"
                className="w-full justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </Button>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Document Information</h2>
            </Card.Header>
            
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="mt-1 text-gray-900">{document.title}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                  <p className="mt-1 text-gray-900">{document.subject}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-gray-900">{document.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Document Type</h3>
                  <p className="mt-1 text-gray-900">{document.purposeLabel}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="mt-1 text-gray-900">{formatDate(document.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Original File</h3>
                  <p className="mt-1 text-gray-900">{document.originalFile.name}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewPage