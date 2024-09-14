# readify

This is one of my hobby projects. I would like to learn a new language as well as a new framework.

It retrieves a list of URLs, makes them more readable, and creates an ePub file with the articles.

## Disclaimer

This application is a personal hobby project and is provided for educational and non-commercial purposes only. The tool allows users to download and convert content from provided URLs into an ePub format. However, it is the responsibility of each user to ensure that they are complying with copyright laws and terms of service of the websites they access.

### Legal Notice:
- The creator of this application does not claim ownership or responsibility for the content downloaded, converted, or redistributed by users.
- This tool is not intended to be used for downloading copyrighted content without permission or violating the rights of content creators or website owners.
- Any misuse of this tool for illegal or unethical purposes is strictly prohibited. The creator will not be held liable for any legal consequences or damages resulting from improper use.
- By using this software, you agree to comply with these terms and take full responsibility for your actions.

Please respect copyright and intellectual property rights when using this tool.

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
To generate an ePub, make a POST request to `/api/v1/jobs`. 

Example request:
```bash
curl --location 'http://localhost:3000/api/v1/jobs' \
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

Example success response:
```json
{
    "id": "4de527c6-2031-446c-89d3-25fcc5d4e31c",
    "status": "RUNNING",
    "artifactPath": null
}
```

If everything goes well, you should get the URL of the entity. You can retrieve job status with a get request.

Example `GET /api/v1/jobs/<JOB_ID>` request:
```bash
curl --location 'http://localhost:3000/api/v1/jobs/d660618e-0dbc-4b83-b1e6-6e898420fa91'
```

Example response:
```json
{
    "type": "UserError/Job Still Running",
    "message": "Job id:d660618e-0dbc-4b83-b1e6-6e898420fa91 is still running",
    "details": null
}
```

## TODO
- [x] ~~Support for multiple URLs~~
- [ ] API Documentation
- [x] ~~API versioning~~
- [ ] User documentation 
- [ ] Authentication
- [ ] Metrics
- [ ] Send with email support
- [ ] Support for kafka
- [x] ~~Configurations with file/env vars~~
- [x] ~~Automatic job cleaning process~~