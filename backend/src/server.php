<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\PingService;
use Spiral\GRPC\Server;

try {
    if (!class_exists('Ping\PingRequest') || 
        !class_exists('Ping\PingResponse') || 
        !interface_exists('Ping\PingServiceInterface')) {
        
        throw new Exception(
            "Generated gRPC classes not found.\n" .
            "Please run: ./generate_grpc.sh && composer dump-autoload"
        );
    }

    $server = new Server();
    $server->registerService(\Ping\PingServiceInterface::class, new PingService());

    echo "=== gRPC Server Starting ===\n";
    echo "Host: 0.0.0.0:9001\n";
    echo "Service: PingService\n";
    echo "PHP Version: " . PHP_VERSION . "\n";
    echo "Autoloading: ✓ Active\n";
    echo "Server ready to accept connections...\n";
    echo "===============================\n";
    
    $server->serve('0.0.0.0:9001');
    
} catch (Exception $e) {
    echo "ERROR: Failed to start gRPC server\n";
    echo "Message: " . $e->getMessage() . "\n";
    
    if (strpos($e->getMessage(), 'Generated gRPC classes not found') !== false) {
        echo "\n🔧 SOLUTION:\n";
        echo "1. Generate gRPC files: ./generate_grpc.sh\n";
        echo "2. Update autoloader: composer dump-autoload\n";
        echo "3. Restart server: php src/server.php\n";
    }
    
    exit(1);
}