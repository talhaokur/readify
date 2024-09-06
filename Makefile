all:
	docker rm -f readify-app
	docker rmi readify-app
	docker build -t readify-app .
	docker run -p 3000:3000 --name readify-app readify-app