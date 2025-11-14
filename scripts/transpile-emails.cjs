const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');

const srcDir = path.join(__dirname, '../app/components/notifications/emails');
const outDir = path.join(__dirname, '../shared/notifications/emails');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.readdirSync(srcDir).forEach((file) => {
  if (file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
    const srcPath = path.join(srcDir, file);
    const outPath = path.join(outDir, file.replace(/\.(jsx|tsx|ts)$/, '.js'));
    const code = fs.readFileSync(srcPath, 'utf8');
    const { code: transpiled } = babel.transformSync(code, {
      presets: [
        [
          require.resolve('@babel/preset-env'),
          { targets: { node: 'current' } },
        ],
        require.resolve('@babel/preset-react'),
        require.resolve('@babel/preset-typescript'),
      ],
      filename: file,
    });

    // Definitely not created by AI cause this was way too confusing for my little brain :)

    let esmCode = transpiled
      .replace(/exports\.default\s*=\s*void 0;?\n?/g, '')
      .replace(/var _default = exports\.default = ([\w$]+);?\n?/g, '')
      .replace(
        /Object\.defineProperty\(exports, "__esModule"[\s\S]*?\);?\n/,
        ''
      )
      .replace(/"use strict";\n?/, '');

    let match =
      esmCode.match(/const ([A-Z][\w$]*)\s*=/) ||
      esmCode.match(/function ([A-Z][\w$]*)\s*\(/) ||
      esmCode.match(/class ([A-Z][\w$]*)\s/);
    let componentName = match ? match[1] : null;

    if (!/^import React from ['"]react['"];/.test(esmCode)) {
      esmCode = 'import React from "react";\n' + esmCode;
    }

    if (
      componentName &&
      !new RegExp(`export default ${componentName};\\s*$`).test(esmCode)
    ) {
      esmCode =
        esmCode.replace(/\n*$/, '') + `\n\nexport default ${componentName};\n`;
    }

    fs.writeFileSync(outPath, esmCode, 'utf8');
    console.log(`Transpiled & patched: ${file} -> ${outPath}`);
  }
});
