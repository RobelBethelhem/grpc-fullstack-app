<?php

use PHPUnit\Framework\TestCase;
use App\PingService;
use Ping\PingRequest;
use Ping\PingResponse;

class PingServiceTest extends TestCase
{
    private $pingService;

    protected function setUp(): void
    {
        $this->pingService = new PingService();
    }

    public function testPingReturnsCorrectMessage()
    {
        // Arrange
        $testMessage = "Hello, gRPC World!";
        $request = new PingRequest();
        $request->setMessage($testMessage);

        // Act
        $response = $this->pingService->Ping($request);

        // Assert
        $this->assertInstanceOf(PingResponse::class, $response);
        $this->assertEquals($testMessage, $response->getMessage());
    }

    public function testPingWithEmptyMessage()
    {
        // Arrange
        $request = new PingRequest();
        $request->setMessage("");

        // Act
        $response = $this->pingService->Ping($request);

        // Assert
        $this->assertEquals("", $response->getMessage());
    }

    public function testPingWithLongMessage()
    {
        // Arrange
        $longMessage = str_repeat("A", 1000);
        $request = new PingRequest();
        $request->setMessage($longMessage);

        // Act
        $response = $this->pingService->Ping($request);

        // Assert
        $this->assertEquals($longMessage, $response->getMessage());
    }

    public function testPingWithSpecialCharacters()
    {
        // Arrange
        $specialMessage = "Hello 世界! 🌍 @#$%^&*()";
        $request = new PingRequest();
        $request->setMessage($specialMessage);

        // Act
        $response = $this->pingService->Ping($request);

        // Assert
        $this->assertEquals($specialMessage, $response->getMessage());
    }
}
