<div align="center">
  <h3 align="center">Chiasm</h3>

  <p align="center">
    <i>Web-based Attention Flow Tracker</i>
  </p>
</div>

## Getting Started
For the most simple setup (especially for production), use `docker`. No other dependencies required.<br />
Else, make sure you have the following tools installed:
- `pnpm`
- `python`

## Prerequisites
1. Clone this repository
```
git clone https://github.com/dhanvithnayak/infosystem_project
```
2. Navigate into project folder
```
cd infosystem_project
```
### Frontend
1. Navigate to the `frontend` directory
```
cd frontend
```
2. Duplicate `.env.template` and rename it to `.env`
3. Set appropriate values of env variables in `.env`
4. Navigate back to project root
```
cd ..
```

### Backend
1. Navigate to the `backend` directory
```
cd backend
```
2. Duplicate `data/videos.json.example` and rename it to `data/videos.json` and add content information in the specified format
3. Duplicate `.env.template` and rename it to `.env`, and set appropriate values
4. Navigate back to project root

## Installation
### Using docker
```
docker compose up --build -d
```
### Without docker
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
# For development setup
pnpm dev

# For production setup
pnpm build
pnpm start
```
4. Back to project root
### Backend
1. Navigate to the `backend` directory:
```
cd backend
```
2. Install the required dependencies:
```
pip install -r requirements.txt
```
4. Run the backend server:
```
python app.py
```

## Creators
- [Dhanvith Nayak - 23IM10010](https://github.com/dhanvithnayak)
- [Ritam Mondal - 23IM30018](https://github.com/ritammondal2004)
- [Arkaprovo Sarkar]()
