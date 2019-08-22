const express = require("express");
const router = express.Router();
const path = require("path");

const fs = require('fs');
const util = require('util');
const fsExists = util.promisify(fs.exists);
const fsReadDir = util.promisify(fs.readdir);
const fsReadFile = util.promisify(fs.readFile);

router.get('404', function(req, res) {
    res.send('404');
})

router.get('/preview/:projectName', async function(req, res) {
    const requestedFolder = req.params.projectName;

    if (! requestedFolder || ! requestedFolder.length)
        return res.redirect('/404');

    const requestedFolder_FullPath = path.join(
      __dirname,
      "..",
      "..",
      "projects",
      requestedFolder
    );

    if (! await fsExists(requestedFolder_FullPath))
        return res.redirect('/404');

    const files = await fsReadDir(requestedFolder_FullPath);
    const scripts = files.filter(filename => /.*\.js$/.test(filename));
    const scriptTag = scripts && scripts.length ? `<script src="/${requestedFolder}/${scripts[0]}"></script>` : ``;
    const styles = files.filter(filename => /.*\.css$/.test(filename));
    const styleTag = styles && styles.length ? `<link rel="stylesheet" href="/${requestedFolder}/${styles[0]}"></link>` : ``;
    const htmls = files.filter(filename => /.*\.html$/.test(filename));
    const myhtml = htmls && htmls.length ? await fsReadFile(path.join(requestedFolder_FullPath, htmls[0])) : ``;
    
    const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            ${styleTag}
            ${scriptTag}
        </head>
        <body>
        ${myhtml}
        </body></html>`

    res.send(html);
});

module.exports = router;