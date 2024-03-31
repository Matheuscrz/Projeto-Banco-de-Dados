"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const Database_1 = require("../config/Database");
/**
 * Classe responsável por realizar a comunicação com o banco de dados
 * @class UserModel
 */
class UserModel {
    static TABLE_USER = "stream.usuario"; // Nome da tabela no banco de dados
    /**
     * Método responsável por buscar um usuário com base no email informado
     * @param id - Identificador do usuário
     * @returns - Retorna um usuário com base no id informado
     */
    static async getUserById(id) {
        try {
            const query = `SELECT * FROM ${this.TABLE_USER} WHERE id = $1`;
            const values = [id];
            const result = await Database_1.Database.query(query, values);
            const user = result.rows.length ? result.rows[0] : null;
            return user;
        }
        catch (error) {
            throw new Error(`Erro ao buscar usuário.  Error: ${error}`);
        }
    }
    /**
     * Método responsável por buscar um usuário com base no email informado
     * @param email - Email do usuário
     * @returns - Retorna um usuário com base no email informado
     */
    static async getUserByEmail(email) {
        try {
            const query = `SELECT * FROM ${this.TABLE_USER} WHERE email = $1`;
            const values = [email];
            const result = await Database_1.Database.query(query, values);
            const user = result.rows.length ? result.rows[0] : null;
            return user;
        }
        catch (error) {
            throw new Error(`Erro ao buscar usuário.  Error: ${error}`);
        }
    }
    /**
     * Método responsável por criar um novo usuário
     * @param user - Usuário a ser criado
     * @returns - Retorna o usuário criado
     */
    static async createUser(user) {
        try {
            const query = `
        INSERT INTO ${this.TABLE_USER} 
        (nome, email, senha, cpf, "dataNascimento") 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`;
            const values = [
                user.nome,
                user.email,
                user.senha,
                user.cpf,
                user.dataNascimento,
            ];
            const result = await Database_1.Database.query(query, values);
            const newUser = result.rows.length ? result.rows[0] : null;
            return newUser;
        }
        catch (error) {
            throw new Error(`Erro ao criar usuário. Error: ${error}`);
        }
    }
    /**
     * Método responsável por atualizar um usuário
     * @param user - Usuário a ser atualizado
     * @returns - Retorna o usuário atualizado
     */
    static async updateUser(user) {
        try {
            const query = `UPDATE ${this.TABLE_USER} SET nome = $1, email = $2, senha = $3, cpf = $4, dataNascimento = $5 WHERE id = $6 RETURNING *`;
            const values = [
                user.nome,
                user.email,
                user.senha,
                user.cpf,
                user.dataNascimento,
                user.id,
            ];
            const result = await Database_1.Database.query(query, values);
            const newUser = result.rows.length ? result.rows[0] : null;
            return newUser;
        }
        catch (error) {
            throw new Error(`Erro ao atualizar usuário.  Error: ${error}`);
        }
    }
    /**
     * Método responsável por deletar um usuário
     * @param id - Identificador do usuário
     */
    static async deleteUser(id) {
        try {
            const query = `DELETE FROM ${this.TABLE_USER} WHERE id = $1`;
            const values = [id];
            await Database_1.Database.query(query, values);
        }
        catch (error) {
            throw new Error(`Erro ao deletar usuário.  Error: ${error}`);
        }
    }
}
exports.UserModel = UserModel;
