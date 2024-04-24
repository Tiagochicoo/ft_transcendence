FROM python:3.9-alpine3.19

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt
COPY ./transcendence /transcendence
COPY ./entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /transcendence

EXPOSE 8000

RUN python -m venv /py && \
	/py/bin/pip install --upgrade pip && \
	/py/bin/pip install -r /requirements.txt && \
	adduser --disabled-password --no-create-home transcendence

ENV PATH="/py/bin:$PATH"

USER transcendence

ENTRYPOINT ["entrypoint.sh"]