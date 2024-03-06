"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const PasswordUtils_1 = require("../utils/PasswordUtils");
const UserModel_1 = require("../models/UserModel");
/**
 * Classe que define as rotas da aplicação
 * @class Routes
 * @name Routes
 */
class Routes {
    app;
    /**
     *
     * @param app - Aplicação express
     * @constructor
     */
    constructor(app) {
        this.app = app;
        this.configureMiddleware();
        this.configureRoutes();
    }
    /**
     * Configura o middleware da aplicação
     * @private
     */
    configureMiddleware() {
        const corsOptions = {
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: false,
            optionsSuccessStatus: 204,
        }; // Configuração do CORS
        this.app.use(express_1.default.json()); // Configuração do body-parser
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.use(express_1.default.urlencoded({ extended: true })); // Configuração do body-parser
    }
    /**
     * Configura as rotas da aplicação
     * @private
     */
    configureRoutes() {
        this.app.use("/newUser", this.newUser.bind(this)); // Adiciona a rota /newUser
        this.app.use("/user/:id", this.getUserById.bind(this)); // Adiciona a rota /user/:id
        this.app.use("/user-mail/:email", this.getUserByEmail.bind(this)); // Adiciona a rota /user-mail/:email
    }
    /**
     * Retorna um usuário pelo email
     * @param req - Requisição
     * @param res - Resposta
     * @returns
     */
    async getUserByEmail(req, res) {
        try {
            const email = req.params.email;
            const user = await UserModel_1.UserModel.getUserByEmail(email);
            if (!user) {
                res.status(404).send("Usuário não encontrado"); // Retorna um erro 404
                return;
            }
            res.status(200).json(user); // Retorna o usuário
        }
        catch (error) {
            res.status(500).send("Erro interno do servidor. Erro: " + error); // Retorna um erro interno do servidor
        }
    }
    /**
     * Retorna um usuário pelo ID
     * @param req - Requisição
     * @param res - Resposta
     * @returns
     */
    async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await UserModel_1.UserModel.getUserById(id);
            if (!user) {
                res.status(404).send("Usuário não encontrado"); // Retorna um erro 404
                return;
            }
            res.status(200).json(user); // Retorna o usuário
        }
        catch (error) {
            res.status(500).send("Erro interno do servidor. Erro: " + error); // Retorna um erro interno do servidor
        }
    }
    /**
     * Cria um novo usuário
     * @param req - Requisição
     * @param res - Resposta
     * @returns
     */
    async newUser(req, res) {
        try {
            const data = req.body;
            if (!data) {
                res.status(400).send("Dados de usuário não informados"); // Retorna um erro 400
                return;
            }
            else {
                const hashedPassword = await PasswordUtils_1.PasswordUtils.hashPassword(data.senha); // Gera o hash da senha
                const user = {
                    id: "",
                    nome: data.nome,
                    email: data.email,
                    senha: hashedPassword,
                    cpf: data.cpf,
                    dataNascimento: new Date(data.dataNascimento),
                    created_at: new Date(),
                };
                const userCreated = await UserModel_1.UserModel.createUser(user); // Cria o usuário
                res.status(201).send(userCreated); // Retorna o usuário criado
            }
        }
        catch (error) {
            res.status(500).send(`${error}`); // Retorna um erro interno do servidor
        }
    }
    /**
     * Retorna um objeto Router
     * @function getRouter
     * @name Routes.getRouter
     * @returns um objeto Router
     */
    getRouter() {
        return (0, express_1.Router)();
    }
}
exports.Routes = Routes;
