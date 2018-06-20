FROM python:3.6-slim

MAINTAINER pistatium

WORKDIR /opt/captino

EXPOSE 8000

COPY requirements.txt /opt/captino
COPY src /opt/captino/src
COPY setup.py /opt/captino/

RUN ["/bin/bash", "-xcv", "pip install -r requirements.txt && pip install -e .[server]"]

CMD ["/bin/bash", "-xcv", "gunicorn captino.app:app --bind=0.0.0.0:8000"]



