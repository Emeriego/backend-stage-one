# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to your project directory
cd path/to/your/project

# Create a new site
netlify sites:create

# Link your project directory to a Netlify site
netlify init

# Deploy your site
netlify deploy --prod
