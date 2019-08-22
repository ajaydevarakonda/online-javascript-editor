const express = require('express')
const app = express()
const port = 3000;
const path = require('path')

app.use(express.static(path.join(__dirname, "projects")));

const projectPrevRoutes = require("./routes/project-prev");
app.get('/404', function(req, res) {
    res.sendFile(path.join(__dirname, "static", "404.html"));
})
app.use('/', projectPrevRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))