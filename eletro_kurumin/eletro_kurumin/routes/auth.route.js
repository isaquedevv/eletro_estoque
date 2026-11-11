const { Router } = require('express');
const crypto = require('crypto');
const conn = require('../db/connection');

const router = Router();

// Gera hash da senha usando recurso nativo do Node.js
function gerarHash(senha) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(senha, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

function verificarSenha(senha, senhaBanco) {
    const partes = senhaBanco.split(':');
    if (partes.length !== 2) return false;

    const salt = partes[0];
    const hashOriginal = Buffer.from(partes[1], 'hex');
    const hashDigitado = crypto.scryptSync(senha, salt, 64);

    return hashOriginal.length === hashDigitado.length &&
        crypto.timingSafeEqual(hashOriginal, hashDigitado);
}

// Cadastro de usuário
router.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha || senha.length < 8) {
            return res.status(400).json({
                mensagem: 'Informe nome, e-mail e senha com pelo menos 8 caracteres.'
            });
        }

        const senhaHash = gerarHash(senha);
        await conn.query(
            'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senhaHash]
        );

        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
        }
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
    }
});

// Login
router.post('/', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ isAuth: false, mensagem: 'Informe e-mail e senha.' });
        }

        const [usuarios] = await conn.query(
            'SELECT id_usuario, nome, email, senha FROM usuario WHERE email = ?',
            [email]
        );

        if (usuarios.length === 0 || !verificarSenha(senha, usuarios[0].senha)) {
            return res.status(401).json({ isAuth: false, mensagem: 'E-mail ou senha inválidos.' });
        }

        res.json({
            isAuth: true,
            usuario: {
                id_usuario: usuarios[0].id_usuario,
                nome: usuarios[0].nome,
                email: usuarios[0].email
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ isAuth: false, mensagem: 'Erro ao realizar login.' });
    }
});

module.exports = router;
