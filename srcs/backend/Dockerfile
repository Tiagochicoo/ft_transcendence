FROM python:3.6

ENV PYTHONBUFFERED=1

WORKDIR /code/

COPY configs/requirements.txt /code/

RUN pip install --upgrade pip && pip install -r requirements.txt

EXPOSE 9000