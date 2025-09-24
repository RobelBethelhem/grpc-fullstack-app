
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PingClient from '../src/components/PingClient';

// Mock fetch globally
global.fetch = jest.fn();

describe('PingClient Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders ping client component', () => {
    render(<PingClient />);
    
    expect(screen.getByText('gRPC Ping Client')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument();
    expect(screen.getByText('Send Ping')).toBeInTheDocument();
  });

  test('button is disabled when input is empty', () => {
    render(<PingClient />);
    
    const button = screen.getByText('Send Ping');
    expect(button).toBeDisabled();
  });

  test('button is enabled when input has text', () => {
    render(<PingClient />);
    
    const input = screen.getByPlaceholderText('Type your message here...');
    const button = screen.getByText('Send Ping');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(button).not.toBeDisabled();
  });

  test('sends ping message successfully', async () => {
    // Mock successful response
    const mockArrayBuffer = new ArrayBuffer(10);
    fetch.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: () => Promise.resolve(mockArrayBuffer)
    });

    render(<PingClient />);
    
    const input = screen.getByPlaceholderText('Type your message here...');
    const button = screen.getByText('Send Ping');

    fireEvent.change(input, { target: { value: 'Hello, Server!' } });
    fireEvent.click(button);

    expect(screen.getByText('Sending...')).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/ping.PingService/Ping',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/grpc-web+proto',
            'Accept': 'application/grpc-web+proto',
          }
        })
      );
    });
  });

  test('displays error when request fails', async () => {
    // Mock failed response
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<PingClient />);
    
    const input = screen.getByPlaceholderText('Type your message here...');
    const button = screen.getByText('Send Ping');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to communicate with server/)).toBeInTheDocument();
    });
  });

  test('clears error when new message is sent', async () => {
    // First, cause an error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<PingClient />);
    
    const input = screen.getByPlaceholderText('Type your message here...');
    const button = screen.getByText('Send Ping');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to communicate with server/)).toBeInTheDocument();
    });

    // Then send a successful request
    const mockArrayBuffer = new ArrayBuffer(10);
    fetch.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: () => Promise.resolve(mockArrayBuffer)
    });

    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText(/Failed to communicate with server/)).not.toBeInTheDocument();
    });
  });

  test('handles enter key press', () => {
    render(<PingClient />);
    
    const input = screen.getByPlaceholderText('Type your message here...');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });

    // Button should be clicked (loading state)
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });
});
