const { Router } = require('express');
const conn = require('../db/connection');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const [itens] = await conn.query(`
            SELECT c.id_componente, c.nome, cat.nome AS categoria,
                   c.preco, c.quantidade_estoque,
                   (c.preco * c.quantidade_estoque) AS valor_total
            FROM componente c
            JOIN categoria cat ON cat.id_categoria = c.id_categoria
            ORDER BY c.nome
        `);

        const [total] = await conn.query(`
            SELECT COALESCE(SUM(preco * quantidade_estoque), 0) AS valor_total_estoque
            FROM componente
        `);

        res.json({
            itens,
            valor_total_estoque: total[0].valor_total_estoque
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao gerar relatório.' });
    }
});

module.exports = router;
