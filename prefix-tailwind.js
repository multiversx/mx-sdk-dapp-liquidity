const fs = require('fs');
const path = require('path');

const directoryPath = './src'; // Adjust if your files are elsewhere

function updateFiles(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      updateFiles(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Replace className styles
      content = content.replace(
        /className=["'`]([^"'`]*)["'`]/g,
        (match, classes) => {
          const updatedClasses = classes
            .split(' ')
            .map((cls) => (cls.startsWith('tw-') ? cls : `tw-${cls}`))
            .join(' ');
          return `className="${updatedClasses}"`;
        }
      );

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated: ${fullPath}`);
    }
  });
}

updateFiles(directoryPath);
