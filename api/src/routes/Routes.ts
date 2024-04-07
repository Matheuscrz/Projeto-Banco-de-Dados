import express, { Router, Request, Response } from "express";
import cors from "cors";
import { User as UserEntity } from "../interfaces/User";
import { Perfil as PerfilEntity } from "../interfaces/Perfil";
import { PasswordUtils } from "../utils/PasswordUtils";
import { UserModel } from "../models/UserModel";
import { PerfilModel } from "../models/PerfilModel";

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
    this.app.use("/user-mail/:email", this.getUserByEmail.bind(this)); // Adiciona a rota /user-mail/:email
    this.app.use("/update-user/:id", this.updateUser.bind(this)); // Adiciona a rota /update-user/:id
    this.app.use("/delete-user/:id", this.deleteUser.bind(this)); // Adiciona a rota /delete-user/:id
    this.app.use("/perfil/:id", this.getPerfilById.bind(this)); // Adiciona a rota /perfil/:id
    this.app.use("/newPerfil", this.newPerfil.bind(this)); // Adiciona a rota /newPerfil
    this.app.use("/update-perfil/:id", this.updatePerfil.bind(this)); // Adiciona a rota /update-perfil/:id
    this.app.use("/delete-perfil/:id", this.deletePerfil.bind(this)); // Adiciona a rota /delete-perfil/:id
  }

  private async deletePerfil(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const perfil = await PerfilModel.getPerfilById(id);
      if (!perfil) {
        res.status(404).send("Perfil não encontrado");
        return;
      } else {
        const perfilDeleted = await PerfilModel.deletePerfil(id);
        res.status(200).send(perfilDeleted);
      }
    } catch (error) {
      res.status(500).send(`${error}`);
    }
  }
  
  private async updatePerfil(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const data: PerfilEntity = req.body;
      if (!data) {
        res.status(400).send("Dados de perfil não informados");
        return;
      } else {
        const perfil = await PerfilModel.getPerfilById(id);
        if (!perfil) {
          res.status(404).send("Perfil não encontrado");
          return;
        } else {
          const perfilUpdated: PerfilEntity = {
            id: perfil.id,
            usuario: data.usuario,
            nome: data.nome,
            image: data.image,
            idioma: data.idioma,
            legenda: data.legenda,
          };
          const perfilUpdatedResult = await PerfilModel.updatePerfil(
            perfilUpdated
          );
          res.status(200).send(perfilUpdatedResult);
        }
      }
    } catch (error) {
      res.status(500).send(`${error}`);
    }
  }
  private async newPerfil(req: Request, res: Response): Promise<void> {
    try {
      const data: PerfilEntity = req.body;
      if (!data) {
        res.status(400).send("Dados de perfil não informados");
        return;
      } else {
        const perfil: PerfilEntity = {
          id: "",
          usuario: data.usuario,
          nome: data.nome,
          image: data.image,
          idioma: data.idioma,
          legenda: data.legenda,
        };
        const perfilCreated = await PerfilModel.createPerfil(perfil);
        res.status(201).send(perfilCreated);
      }
    } catch (error) {
      res.status(500).send(`${error}`);
    }
  }

  private async getPerfilById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const perfil = await PerfilModel.getPerfilById(id);
      if (!perfil) {
        res.status(404).send("Perfil não encontrado");
        return;
      }
      res.status(200).json(perfil);
    } catch (error) {
      res.status(500).send("Erro interno do servidor. Erro: " + error);
    }
  }
  /**
   * Retorna um usuário pelo email
   * @param req - Requisição
   * @param res - Resposta
   * @returns
   */
  private async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      const user = await UserModel.getUserByEmail(email);
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
   * @param req Requisição
   * @param res Resposta
   * @returns
   */
  private async updateUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const data: UserEntity = req.body;
      if (!data) {
        res.status(400).send("Dados de usuário não informados");
        return;
      } else {
        const user = await UserModel.getUserById(id);
        if (!user) {
          res.status(404).send("Usuário não encontrado");
          return;
        } else {
          const hashedPassword = await PasswordUtils.hashPassword(data.senha);
          const userUpdated: UserEntity = {
            id: user.id,
            nome: data.nome,
            email: data.email,
            senha: hashedPassword,
            cpf: data.cpf,
            dataNascimento: new Date(data.dataNascimento),
            created_at: user.created_at,
          };
          const userUpdatedResult = await UserModel.updateUser(userUpdated);
          res.status(200).send(userUpdatedResult);
        }
      }
    } catch (error) {
      res.status(500).send(`${error}`);
    }
  }

  private async deleteUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const user = await UserModel.getUserById(id);
      if (!user) {
        res.status(404).send("Usuário não encontrado");
        return;
      } else {
        const userDeleted = await UserModel.deleteUser(id);
        res.status(200).send(userDeleted);
      }
    } catch (error) {
      res.status(500).send(`${error}`);
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
