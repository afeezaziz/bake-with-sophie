# Simple Dockerfile for running the Flask app with Gunicorn
# Base image
FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Set working directory
WORKDIR /app

# Install system deps (if any) and Python packages
# Only Flask and Gunicorn are required for this app at the moment
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir flask gunicorn

# Copy application code
COPY app.py ./
COPY templates/ ./templates/
COPY static/ ./static/

# Expose the app port
EXPOSE 8000

# Default command: run gunicorn with 3 workers
# The Flask app is defined as `app` inside `app.py`, hence `app:app`
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:8000", "app:app"]
