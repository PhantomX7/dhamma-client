# Run the development server dengan host pjm.localhost
dev:
	npm run dev -- --host pjm.localhost

# Build the project dengan host pjm.localhost
build:
	rm -rf build
	npm run build

start-production:
	node -r dotenv/config build