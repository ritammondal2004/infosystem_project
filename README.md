### InfoSystem Project

## Development

### Using docker

```
docker compose up -d
```

The frontend will be available at `http://localhost:3000`

### Without docker

#### Backend
1. Navigate to the `backend` directory:
```
cd backend
```
2. Duplicate `data/videos.json.example` to `data/videos.json` and add content information in the proper format
3. Install the required dependencies:
```
pip install -r requirements.txt
```
4. Run the backend server:
```
python app.py
```

#### Frontend
1. Navigate to the `frontend` directory:
```
cd frontend
```
2. Duplicate `env.template` to `.env` and set env variables in the file
3. Install the required dependencies:
```
pnpm install
```
4. Run the frontend server:
```
pnpm dev
```