FROM python:3.9-alpine3.19

ENV PYTHONUNBUFFERED 1 

COPY ./configs/requirements.txt /requirements.txt
COPY ./api /api

WORKDIR /api

EXPOSE 8000

RUN python -m venv /py && \
	/py/bin/pip install --upgrade pip && \
	/py/bin/pip install -r /requirements.txt && \
	adduser --disabled-password --no-create-home api

ENV PATH="/py/bin:$PATH"

USER api


