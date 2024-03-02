import express, { Router, Request, Response } from "express";
import cors from "cors";
import { User as UserEntity } from "../interfaces/User";
import { PasswordUtils } from "../utils/PasswordUtils";
import { UserModel } from "../models/UserModel";

/**
 * Classe que define as rotas da aplicação
 * @class Routes
 * @name Routes
 */
export class Routes {
  private readonly app: express.Application;

  /**
   *
   * @param app - Aplicação express
   * @constructor
   */
  constructor(app: express.Application) {
    this.app = app;
    this.configureMiddleware();
    this.configureRoutes();
  }

  /**
   * Configura o middleware da aplicação
   * @private
   */
  private configureMiddleware(): void {
    const corsOptions = {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }; // Configuração do CORS
    this.app.use(express.json()); // Configuração do body-parser
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ extended: true })); // Configuração do body-parser
  }

  /**
   * Configura as rotas da aplicação
   * @private
   */
  private configureRoutes(): void {
    this.app.use("/newUser", this.newUser.bind(this)); // Adiciona a rota /newUser
    this.app.use("/user/:id", this.getUserById.bind(this)); // Adiciona a rota /user/:id
  }

  /**
   * Retorna um usuário pelo ID
   * @param req - Requisição
   * @param res - Resposta
   * @returns
   */
  private async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const user = await UserModel.getUserById(id);
      if (!user) {
        res.status(404).send("Usuário não encontrado"); // Retorna um erro 404
        return;
      }
      res.status(200).json(user); // Retorna o usuário
    } catch (error) {
      res.status(500).send("Erro interno do servidor. Erro: " + error); // Retorna um erro interno do servidor
    }
  }

  /**
   * Cria um novo usuário
   * @param req - Requisição
   * @param res - Resposta
   * @returns
   */
  private async newUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const data: UserEntity = req.body;
      if (!data) {
        res.status(400).send("Dados de usuário não informados"); // Retorna um erro 400
        return;
      } else {
        const hashedPassword = await PasswordUtils.hashPassword(data.senha); // Gera o hash da senha
        const user: UserEntity = {
          id: "",
          nome: data.nome,
          email: data.email,
          senha: hashedPassword,
          cpf: data.cpf,
          dataNascimento: new Date(data.dataNascimento),
          created_at: new Date(),
        };
        const userCreated = await UserModel.createUser(user); // Cria o usuário
        res.status(201).send(userCreated); // Retorna o usuário criado
      }
    } catch (error) {
      res.status(500).send(`${error}`); // Retorna um erro interno do servidor
    }
  }

  /**
   * Retorna um objeto Router
   * @function getRouter
   * @name Routes.getRouter
   * @returns um objeto Router
   */
  public getRouter(): express.Router {
    return Router();
  }
}
