
import React, { useState } from 'react';

const PingClient = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePing = async () => {
    if (!inputMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    setResponseMessage('');

    try {
      // For now, we'll use fetch to communicate with the gRPC-Web proxy
      const response = await fetch('http://localhost:8080/ping.PingService/Ping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/grpc-web+proto',
          'Accept': 'application/grpc-web+proto',
        },
        body: createPingRequest(inputMessage),
      });

      if (response.ok) {
        const responseData = await response.arrayBuffer();
        const decodedMessage = decodePingResponse(responseData);
        setResponseMessage(decodedMessage);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to communicate with server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simple protobuf encoding for the request
  const createPingRequest = (message) => {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    
    // Create a simple protobuf message (field 1, string)
    const buffer = new ArrayBuffer(messageBytes.length + 2);
    const view = new DataView(buffer);
    
    // Field tag (field 1, wire type 2 for string)
    view.setUint8(0, 0x0a);
    // Length of string
    view.setUint8(1, messageBytes.length);
    
    // Copy message bytes
    const uint8View = new Uint8Array(buffer);
    uint8View.set(messageBytes, 2);
    
    return buffer;
  };

  // Simple protobuf decoding for the response
  const decodePingResponse = (arrayBuffer) => {
    const view = new DataView(arrayBuffer);
    
    // Skip gRPC-Web framing (5 bytes)
    let offset = 5;
    
    // Read field tag
    const tag = view.getUint8(offset);
    offset += 1;
    
    if (tag === 0x0a) { // Field 1, string
      const length = view.getUint8(offset);
      offset += 1;
      
      const messageBytes = new Uint8Array(arrayBuffer, offset, length);
      const decoder = new TextDecoder();
      return decoder.decode(messageBytes);
    }
    
    return 'Unable to decode response';
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '50px auto',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#333',
        marginBottom: '30px'
      }}>
        gRPC Ping Client
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          color: '#555'
        }}>
          Enter message to send:
        </label>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          onKeyPress={(e) => e.key === 'Enter' && !loading && handlePing()}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={handlePing}
          disabled={loading || !inputMessage.trim()}
          style={{
            backgroundColor: loading || !inputMessage.trim() ? '#ccc' : '#007bff',
            color: 'white',
            padding: '12px 30px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
            minWidth: '120px'
          }}
          onMouseEnter={(e) => {
            if (!loading && inputMessage.trim()) {
              e.target.style.backgroundColor = '#0056b3';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && inputMessage.trim()) {
              e.target.style.backgroundColor = '#007bff';
            }
          }}
        >
          {loading ? 'Sending...' : 'Send Ping'}
        </button>
      </div>

      {error && (
        <div style={{
          color: '#721c24',
          padding: '12px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {responseMessage && (
        <div style={{
          color: '#155724',
          padding: '12px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          wordBreak: 'break-word'
        }}>
          <strong>Server Response:</strong> {responseMessage}
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <strong>Instructions:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Enter a message in the input field above</li>
          <li>Click "Send Ping" or press Enter</li>
          <li>The server will echo back your message</li>
        </ul>
      </div>
    </div>
  );
};

export default PingClient;