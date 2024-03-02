import express from "express";
import { Routes } from "./routes/Routes";

/**
 * Classe principal da aplicação
 * @class App
 */
export class App {
  private readonly app: express.Application;
  private readonly port: number;

  /**
   * Construtor da classe
   * @param port Número da porta que a aplicação irá rodar
   * @constructor
   */
  constructor(port: number) {
    this.app = express(); // Inicializa a aplicação
    this.port = port; // Define a porta da aplicação
    this.configureApp(); // Configura a aplicação
  }

  /**
   * Configura a aplicação
   * @private
   */
  private configureApp(): void {
    const routes = new Routes(this.app); // Adiciona as rotas à aplicação
    this.app.use(routes.getRouter()); // Adiciona o roteador à aplicação
  }

  /**
   * Inicia a aplicação
   * @public
   */
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(
        `Servidor executando na porta: ${this.port}. Endereço: http://localhost:${this.port}`
      );
    });
  }
}

const port = 3000;
const Application = new App(port);
Application.start();
