### InfoSystem Project

## Development

### Using docker

```
docker compose up -d
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`

### Without docker

#### Backend
1. Navigate to the `backend` directory:
   ```
   cd backend
   ```
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```
   python app.py
   ```

#### Frontend
1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```
2. Install the required dependencies:
   ```
   pnpm install
   ```
3. Run the frontend server:
   ```
   pnpm dev
   ```
