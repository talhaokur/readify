# readify

This is one of my hobby projects. I would like to learn a new language as well as a new framework.

It retrieves a list of URLs, makes them more readable, and creates an ePub file with the articles.

## How to run it
### Local
```bash
mkdir -p ~/output # this is for output repository
npm install
node app.js
```

### Docker
```bash
docker build -t readify-app .
docker run -p 3000:3000 --name readify-app readify-app
```

If you would like to have persistant storage for artifacts (i.e. ePubs) you can create a volume and attacht to /app/output.
```bash
docker build -t readify-app .
docker create volume readify-data
docker run -p 3000:3000 --name readify-app -v readify-data:/app/output readify-app
```

## Usage
To generate an ePub, make a POST request to `/api/jobs`. 

Example request:
```bash
curl --location 'http://localhost:3000/api/jobs' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Example Title",
    "urls": [
        "https://example.com/example-article",
        "https://example.org/another-example-article"
    ],
    "author": "Author Name",
    "coverImageUrl": "https://example.com/assets/cover.jpg"
}'
```

If everything goes well, you should get the URL of the entity. You can retrieve the ePub file with a get request.

Example success response:
```json
{
    "jobId": "aa4f2fe3-0c95-4827-ba4d-0b441700f59b",
    "entityUrl": "http://localhost:3000/api/jobs/aa4f2fe3-0c95-4827-ba4d-0b441700f59b"
}
```

## TODO
- [x] Support for multiple URLs
- [ ] API Documentation
- [ ] User documentation 
- [ ] Authentication
- [ ] Metrics
- [ ] Send with email support
- [ ] Support for kafka
- [ ] Configurations with file/env vars