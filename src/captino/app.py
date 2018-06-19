# coding: utf-8

import uuid

from flask import Flask
from flask import request
from flask import send_file
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from captino.configs import PHANTOMJS_HOST

app = Flask(__name__)


@app.route('/')
def root():
    return 'ok'


@app.route('/capture', methods=['GET', 'POST'])
def capture():
    url = request.args.get('url', '')
    width = int(request.args.get('width', 640))
    height = int(request.args.get('height', 0))  # auto
    if not url:
        return '`url` is required.', 400
    driver = get_driver()
    driver.set_window_size(width=width, height=height)
    driver.get(url)
    filename = f'/tmp/{uuid.uuid4().hex}'
    driver.save_screenshot(filename)
    driver.quit()
    return send_file(filename, mimetype='image/png')


def get_driver():
    return webdriver.Remote(
        command_executor=PHANTOMJS_HOST,
        desired_capabilities=DesiredCapabilities.PHANTOMJS
    )