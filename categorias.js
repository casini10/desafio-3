const pool=require('../conexao')


const listar=async(req,res)=>{
    try {
    const result=await pool.query('SELECT * FROM categorias ORDER BY id')
    return res.status(200).json(result.rows)
} catch (error) {
    return res.status(401).json({ mensagem: 'Não autorizado' })
}
}

module.exports={listar}