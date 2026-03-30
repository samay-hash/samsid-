const fs = require('fs');
const path = require('path');

// When npm installs a package, INIT_CWD stores the directory where the user ran `npm install`
// If testing locally (not installed via npm), we fallback to process.cwd()
const targetProjectDir = process.env.INIT_CWD || process.cwd();

// Protect: If we are just developing this package, don't copy images to ourselves
// Prevent copying if we're running npm install inside samg-aesthetic folder
if (targetProjectDir === __dirname) {
    console.log("🛠️  Development environment detected. Skipping copy of assets.");
    process.exit(0);
}

// Where our images are stored inside the package
const sourceDir = path.join(__dirname, 'images');

// Where we want to output the images in the consumer's codebase
// Typically, frontend developers prefer them in /public/assets or similar
const targetDir = path.join(targetProjectDir, 'public', 'samg-aesthetic');

// Recursive function to copy directory contents
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            // Only copy if the file doesn't already exist to avoid overwriting user modified images
            // Or overwrite it if you want fresh images always. We'll overwrite for now.
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    console.log("\n==================================");
    console.log("🖤 SAMG AESTHETIC: Unleashing the Code Artist...");
    
    if (fs.existsSync(sourceDir)) {
        copyDirectory(sourceDir, targetDir);
        console.log("✅ Dark aesthetic assets successfully synced!");
        console.log(`📂 Your assets are now waiting for you in: ${path.relative(targetProjectDir, targetDir)}`);
    } else {
        console.log("⚠️ No images found to copy.");
    }
    
    console.log("==================================\n");
} catch (error) {
    console.error("❌ Failed to unpack samg-aesthetic:", error.message);
}
