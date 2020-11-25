const app = require("./app");
const db = require("../config/sequelize");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
  db.authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((error) => console.log("Unable to connect to the database:", error));
});
