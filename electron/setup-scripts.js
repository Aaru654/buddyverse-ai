
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the package.json template content
const templateData = fs.readFileSync(path.join(__dirname, 'package-update.js'), 'utf8');

// Extract the scripts and build configuration using regex
const scriptsMatch = templateData.match(/\/\*\s*([\s\S]*?)\s*\*\//);
const buildConfigMatch = templateData.match(/\/\*\s*([\s\S]*?build[\s\S]*?}\s*)\s*\*\//);

// Parse the scripts
const extractScripts = (match) => {
  if (!match) return {};
  const lines = match[1].trim().split('\n');
  const scripts = {};
  
  lines.forEach(line => {
    const parts = line.match(/"([^"]+)":\s*"([^"]+)"/);
    if (parts) {
      scripts[parts[1]] = parts[2];
    }
  });
  
  return scripts;
};

// Parse the build config 
const extractBuildConfig = (match) => {
  if (!match) return {};
  try {
    // Get just the JSON part
    const jsonText = match[1].replace(/^.*?{/, '{');
    return JSON.parse(jsonText);
  } catch (e) {
    console.error('Failed to parse build config:', e);
    return {};
  }
};

// Read and update package.json
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Extract scripts and build config
  const scripts = extractScripts(scriptsMatch);
  const buildConfig = extractBuildConfig(buildConfigMatch);
  
  // Update package.json
  const updated = {
    ...packageJson,
    scripts: {
      ...packageJson.scripts,
      ...scripts
    },
    build: buildConfig
  };
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(updated, null, 2));
  console.log('Successfully updated package.json with Electron scripts and build configuration.');
  console.log('You can now run:');
  Object.keys(scripts).forEach(script => {
    console.log(`  npm run ${script}`);
  });
  
} catch (error) {
  console.error('Error updating package.json:', error);
  console.log('Please manually add the following to your package.json:');
  
  if (scriptsMatch) {
    console.log('\nScripts:');
    console.log(scriptsMatch[1]);
  }
  
  if (buildConfigMatch) {
    console.log('\nBuild configuration:');
    console.log(buildConfigMatch[1]);
  }
}
