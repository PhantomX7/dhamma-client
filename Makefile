dev:
	npm run dev

build:
	rm -rf build
	npm run build

start-production:
	node -r dotenv/config build