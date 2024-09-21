# STAGE1: Build the binary
FROM rust:alpine AS builder

# Install build dependencies
RUN apk add --no-cache build-base musl-dev openssl-dev openssl

# Create a new empty shell project
WORKDIR /rust_todo_api

# Copy over the Cargo.toml files to the shell project
COPY . ./

# Build and cache the dependencies
RUN cargo fetch
RUN cargo build --release

# STAGE2: create a slim image with the compiled binary
FROM alpine AS runner

# Copy the binary from the builder stage
WORKDIR /app
COPY --from=builder /rust_todo_api/target/release/rust_todo_api rust_todo_api
COPY .env /app/.env

EXPOSE 5001
CMD ["/app/rust_todo_api"]