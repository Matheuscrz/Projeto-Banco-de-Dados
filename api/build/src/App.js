"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const Routes_1 = require("./routes/Routes");
/**
 * Classe principal da aplicação
 * @class App
 */
class App {
    app;
    port;
    /**
     * Construtor da classe
     * @param port Número da porta que a aplicação irá rodar
     * @constructor
     */
    constructor(port) {
        this.app = (0, express_1.default)(); // Inicializa a aplicação
        this.port = port; // Define a porta da aplicação
        this.configureApp(); // Configura a aplicação
    }
    /**
     * Configura a aplicação
     * @private
     */
    configureApp() {
        const routes = new Routes_1.Routes(this.app); // Adiciona as rotas à aplicação
        this.app.use(routes.getRouter()); // Adiciona o roteador à aplicação
    }
    /**
     * Inicia a aplicação
     * @public
     */
    start() {
        this.app.listen(this.port, () => {
            console.log(`Servidor executando na porta: ${this.port}. Endereço: http://localhost:${this.port}`);
        });
    }
}
exports.App = App;
const port = 3000;
const Application = new App(port);
Application.start();
