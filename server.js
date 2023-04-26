//require all dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3001;
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

