const { Router } = require('express');
const conn = require('../db/connection');

const router = Router();

// Listar componentes
router.get('/', async (req, res) => {
    try {
        const [componentes] = await conn.query(`
            SELECT c.*, cat.nome AS categoria
            FROM componente c
            JOIN categoria cat ON cat.id_categoria = c.id_categoria
            ORDER BY c.nome
        `);
        res.json(componentes);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar componentes.' });
    }
});

// Buscar categorias para preencher o select
router.get('/categorias', async (req, res) => {
    try {
        const [categorias] = await conn.query(
            'SELECT id_categoria, nome FROM categoria ORDER BY nome'
        );
        res.json(categorias);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar categorias.' });
    }
});

// Cadastrar componente
router.post('/', async (req, res) => {
    try {
        const { id_categoria, id_usuario, nome, descricao, preco, quantidade_estoque } = req.body;

        if (!id_categoria || !nome || preco === undefined || quantidade_estoque === undefined ||
            Number(preco) < 0 || Number(quantidade_estoque) < 0) {
            return res.status(400).json({ mensagem: 'Preencha os campos corretamente.' });
        }

        const [resultado] = await conn.query(
            `INSERT INTO componente
            (id_categoria, id_usuario, nome, descricao, preco, quantidade_estoque)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [id_categoria, id_usuario || null, nome, descricao || null, preco, quantidade_estoque]
        );

        res.status(201).json({
            mensagem: 'Componente cadastrado com sucesso!',
            id_componente: resultado.insertId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao cadastrar componente.' });
    }
});

// Editar componente
router.put('/:id', async (req, res) => {
    try {
        const { id_categoria, nome, descricao, preco, quantidade_estoque } = req.body;
        const { id } = req.params;

        await conn.query(
            `UPDATE componente
             SET id_categoria = ?, nome = ?, descricao = ?, preco = ?, quantidade_estoque = ?
             WHERE id_componente = ?`,
            [id_categoria, nome, descricao || null, preco, quantidade_estoque, id]
        );

        res.json({ mensagem: 'Componente atualizado com sucesso!' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao atualizar componente.' });
    }
});

// Excluir componente
router.delete('/:id', async (req, res) => {
    try {
        await conn.query('DELETE FROM componente WHERE id_componente = ?', [req.params.id]);
        res.json({ mensagem: 'Componente excluído com sucesso!' });
    } catch (erro) {
        console.error(erro);
        res.status(400).json({
            mensagem: 'Não foi possível excluir. Verifique se existem movimentações vinculadas.'
        });
    }
});

module.exports = router;
