FROM php:7.3-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    wget

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install protobuf compiler
RUN apt-get install -y protobuf-compiler

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install protoc-gen-php-grpc
RUN wget https://github.com/spiral/php-grpc/releases/download/v1.4.0/protoc-gen-php-grpc-1.4.0-linux-amd64.tar.gz \
    && tar -xzf protoc-gen-php-grpc-1.4.0-linux-amd64.tar.gz \
    && mv protoc-gen-php-grpc /usr/local/bin/protoc-gen-php-grpc \
    && chmod +x /usr/local/bin/protoc-gen-php-grpc

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

COPY . .
RUN composer dump-autoload --optimize

# Generate gRPC files
RUN chmod +x generate_grpc.sh && ./generate_grpc.sh

EXPOSE 9001

CMD ["php", "src/server.php"]