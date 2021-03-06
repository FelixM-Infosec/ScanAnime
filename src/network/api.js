// Defaults
const express = require('express')
const bodyParser = require('body-parser');
const axios = require('axios')
const fs = require('fs')
const cors = require('cors')
const api = require('../packs/api')
const NetConfig = require('../packs/net_config')

const app = express();

// ONLY FOR DEVELOPMENT
app.use(cors({ credentials: true, origin: '*' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var options = {
    headers: {'identifier': api.api_identifier}
}

//Api Endpoints

//List all from local cache
app.get('/api/new_list', (req, res) => {
    fs.readFile('cache.json', function readFileCallback(err, data) {
        if(err){console.log(err)}
        res.status(200).send(data)
    })
})

//List all from external
app.get('/api/list_all', (req, res) => {
    axios.post(api.api_domain, 'all_list=', options)
    .then((response) => {
        res.status(200).send(response.data)
    })
    .catch((err) => {
        console.log(err);
    })
})

//List New Content from external
app.get('/api/new_content', (req, res) => {
    axios.post(api.api_domain, 'new_content=', options)
    .then((response) => {
        res.status(200).send(response.data.NewContent)
    })
    .catch((err) => {
        console.log(err);
    })
})

//List Hot Content from external
app.get('/api/hot_content', (req, res) => {
    axios.post(api.api_domain, 'new_content=', options)
    .then((response) => {
        res.status(200).send(response.data.HotContent)
    })
    .catch((err) => {
        console.log(err);
    })
})

//Get Episode from external
app.post('/api/get_episode', (req, res) => {
    axios.post(api.api_domain, 'episode_id=' + req.body.id, options)
    .then((response) => {
        res.status(200).send(response.data)
    })
    .catch((err) => {
        console.log(err);
    })
})

//Get Season from external
app.post('/api/get_season', (req, res) => {
    axios.post(api.api_domain, 'anime_id='+JSON.parse(JSON.stringify(req.body.test)), options)
    .then((response) => {
        res.status(200).send(response.data)
    })
    .catch((err) => {
        console.log(req.body);
    })
})

app.listen(process.env.PORT || NetConfig.port);