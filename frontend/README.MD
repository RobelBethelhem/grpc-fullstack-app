# gRPC Full-Stack Application

A complete full-stack application demonstrating gRPC communication between a PHP 7.3 backend and React frontend.

## 🚀 Features

- **Backend**: PHP 7.3 gRPC server using Spiral gRPC
- **Frontend**: React application with gRPC-Web client
- **Communication**: Full gRPC communication with Ping service
- **Docker**: Complete containerized setup
- **Testing**: Unit tests for both backend and frontend
- **Proxy**: Envoy proxy for gRPC-Web compatibility

## 📋 Prerequisites

- Docker & Docker Compose
- Git
- Node.js 16+ (for local development)
- PHP 7.3+ with Composer (for local development)

## 🏗️ Project Structure

```
grpc-fullstack-app/
├── backend/                 # PHP gRPC Server
│   ├── src/
│   │   ├── Generated/      # Auto-generated gRPC files
│   │   ├── PingService.php # Service implementation
│   │   └── server.php      # Server entry point
│   ├── proto/
│   │   └── ping.proto      # Protocol buffer definition
│   ├── tests/              # Backend tests
│   ├── composer.json       # PHP dependencies
│   ├── Dockerfile         # Backend container config
│   └── generate_grpc.sh   # gRPC generation script
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── PingClient.js
│   │   ├── App.js
│   │   └── index.js
│   ├── __tests__/         # Frontend tests
│   ├── package.json       # Node dependencies
│   └── Dockerfile        # Frontend container config
├── envoy.yaml            # Envoy proxy configuration
├── docker-compose.yml    # Container orchestration
└── README.md            # This file
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd grpc-fullstack-app
```

2. **Start all services:**
```bash
docker-compose up --build
```

3. **Access the application:**
- Frontend: http://localhost:3000
- gRPC Proxy: http://localhost:8080
- Envoy Admin: http://localhost:9901

### Option 2: Local Development

#### Backend Setup

1. **Install PHP dependencies:**
```bash
cd backend
composer install
```

2. **Install protoc-gen-php-grpc:**
```bash
wget https://github.com/spiral/php-grpc/releases/download/v1.4.0/protoc-gen-php-grpc-1.4.0-linux-amd64.tar.gz
tar -xzf protoc-gen-php-grpc-1.4.0-linux-amd64.tar.gz
sudo mv protoc-gen-php-grpc /usr/local/bin/protoc-gen-php-grpc
sudo chmod +x /usr/local/bin/protoc-gen-php-grpc
```

3. **Generate gRPC files:**
```bash
chmod +x generate_grpc.sh
./generate_grpc.sh
```

4. **Start the server:**
```bash
php src/server.php
```

#### Frontend Setup

1. **Install Node dependencies:**
```bash
cd frontend
npm install
```

2. **Start the development server:**
```bash
npm start
```

## 🔧 PHP 7.3 Compatibility Solutions

This project addresses several PHP 7.3 compatibility challenges:

### 1. **gRPC Library Compatibility**
- Uses Spiral gRPC v1.4.0 which supports PHP 7.3
- Specific protoc-gen-php-grpc version (1.4.0) for compatibility

### 2. **Protobuf Generation**
- Manual protobuf file generation using compatible tools
- Explicit autoloading of generated gRPC classes

### 3. **Dependency Management**
- Locked composer versions for PHP 7.3 compatibility
- Specific google/protobuf version constraints

### 4. **Error Handling**
- Enhanced error handling for PHP 7.3 limitations
- Proper exception management in gRPC contexts

## 🧪 Testing

### Backend Tests
```bash
cd backend
composer install --dev
vendor/bin/phpunit tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Testing
```bash
# Start all services
docker-compose up -d

# Test the ping endpoint
curl -X POST http://localhost:8080/ping.PingService/Ping \
  -H "Content-Type: application/grpc-web+proto" \
  --data-binary @test_request.bin

# Stop services
docker-compose down
```

## 🐛 Troubleshooting

### Common Issues

1. **gRPC Generation Fails**
   ```bash
   # Ensure protoc-gen-php-grpc is installed and executable
   which protoc-gen-php-grpc
   chmod +x /usr/local/bin/protoc-gen-php-grpc
   ```

2. **PHP 7.3 Extension Missing**
   ```bash
   # Install required PHP extensions
   sudo apt-get install php7.3-grpc php7.3-protobuf
   ```

3. **Frontend Cannot Connect**
   - Check if Envoy proxy is running on port 8080
   - Verify CORS configuration in envoy.yaml
   - Ensure backend is accessible from proxy

4. **Docker Build Issues**
   ```bash
   # Clean and rebuild containers
   docker-compose down --volumes
   docker-compose build --no-cache
   docker-compose up
   ```

### Debug Mode

Enable debug logging:

```bash
# Backend
export PHP_DISPLAY_ERRORS=1
export PHP_ERROR_REPORTING=E_ALL

# Frontend
export REACT_APP_DEBUG=true
```

## 📦 Deployment

### Production Deployment

1. **Build production images:**
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Deploy to staging:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

```bash
# Backend
PHP_DISPLAY_ERRORS=0
GRPC_SERVER_HOST=0.0.0.0
GRPC_SERVER_PORT=9001

# Frontend
REACT_APP_GRPC_ENDPOINT=https://your-domain.com/grpc
REACT_APP_ENV=production

# Proxy
ENVOY_ADMIN_PORT=9901
ENVOY_PROXY_PORT=8080
```

## 🔐 Security Considerations

- **TLS**: Enable TLS for production gRPC communication
- **Authentication**: Implement proper authentication for gRPC services
- **CORS**: Configure restrictive CORS policies for production
- **Input Validation**: Add input validation in the PingService

## 📈 Performance Optimization

- **Connection Pooling**: Configure gRPC connection pooling
- **Caching**: Implement response caching where appropriate
- **Load Balancing**: Use multiple backend instances
- **Monitoring**: Add health checks and metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:

1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with:
   - PHP version
   - Error messages
   - Steps to reproduce

## 🎯 Next Steps

- [ ] Add authentication/authorization
- [ ] Implement streaming gRPC methods
- [ ] Add database integration
- [ ] Performance monitoring
- [ ] CI/CD pipeline
- [ ] Production deployment guide

---

**Built with ❤️ using PHP 7.3, React, and gRPC**