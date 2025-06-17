import os
from setuptools import setup, find_packages

# Define your project's version
# This __version__ will be found by the build process
__version__ = "0.1.0" 

# A simple way to get the long description from a README.md file if it exists
def read_readme():
    path = os.path.join(os.path.dirname(__file__), 'README.md')
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            return f.read()
    return ""

setup(
    name='image-compressor-api', # A unique name for your project
    version=__version__,
    description='A simple Flask API to compress and resize images',
    long_description=read_readme(),
    long_description_content_type='text/markdown', # Only if you have a README.md
    author='Your Name', # Replace with your name or 'Your Organization'
    author_email='your.email@example.com', # Replace with your email
    url='https://github.com/yourusername/image-compressor-api', # Optional: Link to your GitHub repo
    packages=find_packages(), # This will automatically find any Python packages (folders with __init__.py)
                              # For a single app.py file directly in the root, this might not find a 'package',
                              # but setuptools still needs setup.py for metadata.
    include_package_data=True,
    zip_safe=False,
    # As discussed, for Render, requirements.txt handles installation.
    # We include these for general good practice in a setup.py, but they are technically
    # not what was causing your specific KeyError.
    install_requires=[
        'Flask==2.3.3',
        'Pillow==9.5.0',
        'gunicorn==21.2.0',
    ],
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License', # Example license, choose appropriate
        'Operating System :: OS Independent',
        'Framework :: Flask',
    ],
    python_requires='>=3.8', # Specify minimum Python version
)