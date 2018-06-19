# coding: utf-8

import os
from setuptools import setup, find_packages


setup(
    name='captino',
    version='1.0.0',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    include_package_data=True,
    extras_require={
        'test': [
        ],
    },
)

