# STAGE1: Build the binary
FROM rust:alpine AS builder

# Install build dependencies
RUN apk add --no-cache build-base musl-dev openssl-dev openssl

# Create a new empty shell project
WORKDIR /rust_todo_api

# Copy over the Cargo.toml files to the shell project
COPY Cargo.toml Cargo.lock ./

# Build and cache the dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo fetch
RUN cargo build --release
RUN rm src/main.rs

# Copy the actual code files and build the application
COPY src ./src/
COPY .env .env
# Update the file date
RUN touch src/main.rs
RUN cargo build --release

# STAGE2: create a slim image with the compiled binary
FROM alpine AS runner

# Copy the binary from the builder stage
WORKDIR /rust_todo_api
COPY --from=builder /rust_todo_api/target/release/rust_todo_api rust_todo_api

EXPOSE 8080
ENTRYPOINT ["./rust_todo_api", "-a", "0.0.0.0", "-p", "8080"]