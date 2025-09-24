# Dockerfile for running the Flask app with Gunicorn using uv for fast installs
# Base image with uv and Python 3.12
FROM ghcr.io/astral-sh/uv:python3.12-bookworm

# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Set working directory
WORKDIR /app

# Install Python dependencies separately for better caching
COPY requirements.txt ./
RUN uv pip install --system --no-cache -r requirements.txt

# Copy application code
COPY app.py ./
COPY templates/ ./templates/
COPY static/ ./static/

# Expose the app port
EXPOSE 8000

# Default command: run gunicorn with 3 workers
# The Flask app is defined as `app` inside `app.py`, hence `app:app`
# Use shell form so $PORT environment variable expands at runtime
CMD sh -c "gunicorn --workers 3 --bind 0.0.0.0:${PORT} app:app"
