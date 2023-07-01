FROM ubuntu
WORKDIR /flask-server
RUN apt update
RUN apt -y install python3
RUN apt -y install python3-pip
RUN python3 -m pip install flask
RUN python3 -m pip install flask_cors
RUN python3 -m pip install bcrypt
COPY ./server /flask-server

EXPOSE 5000

CMD ["python3", "flask_api.py"]