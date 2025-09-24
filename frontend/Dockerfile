FROM node:16-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Generate protobuf files
COPY proto ./proto
RUN npx protoc --js_out=import_style=commonjs:./src/generated \
               --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./src/generated \
               proto/ping.proto

# Build application
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]