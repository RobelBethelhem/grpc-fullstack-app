<?php

namespace App;

use Ping\PingRequest;
use Ping\PingResponse;
use Ping\PingServiceInterface;

class PingService implements PingServiceInterface
{
    /**
     * Implementation of the Ping method
     * 
     * @param PingRequest $request The incoming request
     * @return PingResponse The response containing the same message
     */
    public function Ping(PingRequest $request): PingResponse
    {
        $message = $request->getMessage();
        
        // Log the received message for debugging
        error_log("Received gRPC message: " . $message);
        
        // Create response with the same message
        $response = new PingResponse();
        $response->setMessage($message);
        
        return $response;
    }
}