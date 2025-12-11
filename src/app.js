import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/view.router.js";
import { engine } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = new Server (server);

/*  MIDDLEWARE PARA LEER JSON Y FORMULARIOS */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*  ARCHIVOS ESTATICOS */
app.use(express.static("public"));

/*  CONFIGURACION DE HANDLEBARS */
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use((req, res, next) => {
    req.io = io;
    next();
});

/*  RUTAS */
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

/*WEB SOCKET*/
io.on("connection", (socket)=>{
  console.log("Nuevo usuario conectado");
});
/*  SERVIDOR */
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});


