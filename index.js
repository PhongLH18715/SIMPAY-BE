const mongoose = require('mongoose');
const config = require('./src/config');
const app = require("./src/app");
const {Role, User} = require("./src/models");
const {ROLES, PERMISSIONS} = require('./src/config/role.config');
mongoose.connect(config.mongoose.url).then(async () => {
  console.log('Connected to mongodb');

  app.listen(config.port, () => {
    console.log('Server is running on port ' + config.port);
  });
});
