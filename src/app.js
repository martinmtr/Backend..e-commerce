import express from "express";
import http from "http"; 
import { Server } from "socket.io"; 
import productsRouter from "./routes/products.router.js";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";
import __dirname from "../dirname.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";

dotenv.config({ path: __dirname + "/.env" });

const app = express();
const PORT = process.env.PORT || 8080;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

connectMongoDB();

app.engine("handlebars", engine({
    helpers: {
        
        multiply: (num1, num2) => {
            return num1 * num2;
        }
    }
}));
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(__dirname + "/public"));

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

app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente en el puerto ${PORT}`);
});

export { io };