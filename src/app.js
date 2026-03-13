import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import connectMongoDB from "./config/db.js";
import __dirname from "../dirname.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { logger } from "./middlewares/logger.js";
import { validate } from "./middlewares/validate.js";
import { authorize } from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.router.js";
import clientesRouter from "./routes/clientes.router.js";

const app = express();
const PORT = process.env.PORT || 8080;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

connectMongoDB();
initializePassport();
app.use(passport.initialize());
app.engine(
  "handlebars",
  engine({
    helpers: {
      multiply: (num1, num2) => {
        return num1 * num2;
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use("/api/sessions", sessionsRouter);

// Configuración de Socket.io
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado, ID:", socket.id);
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", clientesRouter);
app.use(errorHandler);

app.get("/setcookies", (req, res) => {
  let datos = {
    theme: "dark",
    fontSize: 16,
    color: "blue",
  };

  res.cookie("cookie01", datos, {});
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "cookies seteadas" });
});

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("OK");
});

app.get("/api/datos", authorize, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "Datos...!!!" });
});

app.post("/api/nombre", validate, (req, res) => {
  let { nombre } = req.query;

  res.setHeader("Content-Type", "application/json");
  return res.status(201).json({ payload: "Nombre: " + nombre });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente en el puerto ${PORT}`);
});

export { io };
