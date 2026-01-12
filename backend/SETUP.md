## 1. Get the Code
Open your terminal and clone the repo (or pull the latest changes):
```bash
git clone 
cd global-link-imports
2. Backend Setup (Flask)
Important: You must use a virtual environment so our libraries don't conflict.

Step A: Create the Environment
Navigate to the backend folder:

Bash

cd backend
python3 -m venv venv ( on Mac/Linux)

Step B: Activate the Environment
You need to do this every time you open a new terminal to work on the backend.


Mac / Linux / 

Bash

source venv/bin/activate
(You should see (venv) at the start of your terminal line).

Step C: Install Dependencies

This installs Flask, SQLAlchemy, and everything else we need.

Bash

pip install -r requirements.txt

Step D: Create your Local Environment Variables
The .env file is ignored by Git for security, so you need to make your own.

Create a file named .env inside the backend/ folder.

Paste this inside:

FLASK_APP=run.py
FLASK_DEBUG=1
SECRET_KEY=dev-key-123
DATABASE_URI=sqlite:///app.db