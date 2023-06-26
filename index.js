const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./route/users/userRoutes");
const { notFound, errorHandler } = require("./middleware/errors/errorHandler");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const db = require("./model");
const { authJwt } = require("./middleware");
const {
  allAccess,
  userBoard,
  moderatorBoard,
  adminBoard,
} = require("./middleware/access/access");
const Role = db.role;

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./path/swagger-output.json");

var options = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Documentation Api",
  customfavIcon: "./assets/favicon.ico",
};

app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, options));
//   swager tutup

// user routes
app.use("/api/users", userRoutes);

app.get("/api/test/all", allAccess);

app.get("/api/test/user", [authJwt.verifyToken], userBoard);

app.get(
  "/api/test/mod",
  [authJwt.verifyToken, authJwt.isModerator],
  moderatorBoard
);

app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);

// error handler
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log("Express server listening on port: " + port);
});
