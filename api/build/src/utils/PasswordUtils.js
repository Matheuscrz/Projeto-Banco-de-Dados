"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtils = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordUtils {
    static saltRounds = 10;
    /**
     * Criptografa uma senha com bcrypt.
     * @param password - A senha a ser criptografada.
     * @param saltRounds - O número de salt rounds a serem utilizados na criptografia.
     * @returns Uma promise que resolve para a senha criptografada.
     */
    static async hashPassword(password, saltRounds = this.saltRounds) {
        return await bcrypt_1.default.hash(password, saltRounds);
    }
    /**
     * Compara uma senha em texto plano com uma senha criptografada.
     * @param password - A senha em texto plano a ser comparada.
     * @param hashedPassword - A senha criptografada a ser comparada.
     * @returns Uma promise que resolve para um boolean indicando se as senhas são iguais.
     */
    static async comparePasswords(password, hashedPassword) {
        return await bcrypt_1.default.compare(password, hashedPassword);
    }
}
exports.PasswordUtils = PasswordUtils;
