FROM python:3.7-alpine
ADD . /triggers
WORKDIR /triggers
RUN pip install -r requirements.txt
CMD ["python", "main.py"]