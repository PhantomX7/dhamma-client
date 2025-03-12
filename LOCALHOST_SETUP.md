# Local Development Setup for Multi-tenant Testing

## Setting up Local Subdomains

1. Open your hosts file:
   - Windows: `C:\Windows\System32\drivers\etc\hosts`
   - Mac/Linux: `/etc/hosts`

2. Add the following entries:
   ```
   127.0.0.1 tenant1.localhost
   127.0.0.1 tenant2.localhost
   # Add more tenants as needed
   ```

3. Save the hosts file (you may need administrator privileges)

## Running the Development Server

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access your tenants:
   - Tenant 1: http://tenant1.localhost:5173
   - Tenant 2: http://tenant2.localhost:5173

## Testing Different Tenants

You can test different tenant behaviors by accessing the application through different subdomains. Each subdomain will be treated as a separate tenant by the application.

Example:
- http://tenant1.localhost:5173 will show tenant1's configuration
- http://tenant2.localhost:5173 will show tenant2's configuration

## Troubleshooting

1. If you can't access the subdomains, make sure:
   - Your hosts file was saved correctly
   - You're running the development server
   - You're using the correct port number (default is 5173)

2. If you get a "Tenant not found" error:
   - Check that you're using the correct subdomain
   - Verify that the subdomain is properly configured in your hosts file

3. Clear your browser's DNS cache if changes don't take effect immediately