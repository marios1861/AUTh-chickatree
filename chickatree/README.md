# Getting started with backend development

## Follow the steps below

- Make sure you have a working mysql server installed
- In mysql run these queries:
  - ``` CREATE DATABASE chickatree;```
  - ``` CREATE USER 'django'@'localhost' IDENTIFIED BY 'Chickatree1!';```
  - ```GRANT ALL PRIVILEGES ON chickatree.* to 'django'@'localhost';```
- Create a python venv: ```python -m venv venv```
- Activate the venv: ```. ./venv/bin/activate```
- Install requirements: ```pip install -r requirements.txt```
- Make migrations: ```python manage.py makemigrations web_app```
- Migrate: ```python manage.py migrate```
- Create superuser: ```python manage.py createsuperuser```

You can now run the backend server with the command ```python manage.py runserver```

Happy developing!!!
  