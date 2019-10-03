FROM python:3.7-alpine

WORKDIR /home/app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD [ "gunicorn", "--bind", "0.0.0.0:5000", "index:app" ]
