const fs = require('fs');
const path = require('path');

// Fix files in userPages
const userPagesDir = path.join(__dirname, 'src', 'pages', 'userPages');
const files = fs.readdirSync(userPagesDir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(userPagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix broken CSS imports
    content = content.replace(/import "\.\.\/userCss\/";/g, `import "../userCss/${file.replace('.jsx', '.css')}";`);
    
    // Fix ProductCard imports
    content = content.replace(/import ProductCard from "\.\.\/components\/ProductCard";/g, 'import ProductCard from "../../components/user/ProductCard";');
    
    // Fix Home, Contact, etc specific component imports that might have been broken
    content = content.replace(/from "\.\.\/components\/([A-Za-z0-9]+)";/g, 'from "../../components/user/$1";');
    content = content.replace(/from "\.\.\/components\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)";/g, 'from "../../components/user/$2";');
    
    fs.writeFileSync(filePath, content);
  }
});

// Also fix ProductCard.jsx
const productCardPath = path.join(__dirname, 'src', 'components', 'user', 'ProductCard.jsx');
if (fs.existsSync(productCardPath)) {
  let content = fs.readFileSync(productCardPath, 'utf8');
  content = content.replace(/import '\.\/ProductCard\.css';/g, "import '../../pages/userCss/ProductCard.css';");
  fs.writeFileSync(productCardPath, content);
}
console.log('Fixed imports!');
