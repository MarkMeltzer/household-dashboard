FROM python:3.11.1

COPY . /code
WORKDIR /code

RUN pip install -r requirements.txt
RUN pip install -r requirements-dev.txt

EXPOSE 5000

CMD ["python", "app.py"]