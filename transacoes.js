const pool=require('../conexao')

const listar=async(req,res)=>{
    try {  
    const {id}=req.usuario
    const result=await pool.query('SELECT * FROM transacoes where usuario_id=$1',[id])
    return res.status(200).json(result.rows) 
    } catch (error) {
        res.status(404).json('erro no cadastro')
    }
}

const listaEsp=async(req,res)=>{
    const {id}=req.params
    const d=req.usuario
    const result=await pool.query('SELECT * FROM transacoes where id=$1 AND usuario_id=$2 ',[id,d.id])
    const {rowCount}=result
    if (rowCount<1) {
       res.status(404).json({mensagem: "Transação não encontrada."})
    }
    return res.status(200).json(result.rows)
    

}


const transacao=async(req,res)=>{
    const {id}=req.usuario
    const usuario_id=id
    const {tipo,descricao,valor,data,categoria_id}=req.body
    // const {rows}=await pool.query('SELECT * FROM categorias WHERE id=$1',[categoria_id])
    // const {nome}=rows[0]
    const sql=('insert into transacoes(tipo,descricao,valor,data,categoria_id,usuario_id) VALUES($1,$2,$3,$4,$5,$6) returning *')
    const params=[tipo,descricao,valor,data,categoria_id,usuario_id]
    const dados=await pool.query(sql,params)
    const transacaoCadastrada=await pool.query('select transacoes.*, categorias.descricao as categoria_nome from transacoes join categorias on categorias.id=transacoes.categoria_id where categorias.id=$1 AND transacoes.id=$2',[categoria_id,dados.rows[0].id]) 
    const {rowCount}=transacaoCadastrada
    if (rowCount<1) {
        res.status(404).json({mensagem: "Todos os campos obrigatórios devem ser informados."
    })
    } 
    res.status(200).json(transacaoCadastrada.rows)   

}


    const atualizarTransacao = async (req, res) => {

        const { id } = req.params
        const usuario_id=req.usuario.id
        const { descricao, valor, data, categoria_id, tipo } = req.body
    
        try{
        const result= await pool.query('UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6 and usuario_id=$7',[descricao, valor, data, categoria_id, tipo, id,usuario_id])
        
        res.status(200).json(result.rows)
    
        }catch(error){
    
            return res.status(500).json({mensagem:`Ocorreu um erro interno ${error.message}`});
        }
    
    }


const deletar=async(req,res)=>{
    const {id}=req.params
    const usuario_id=req.usuario.id
    console.log(usuario_id)
    const resultado=await pool.query('delete from transacoes where id=$1 and usuario_id=$2',[id,usuario_id])
    const {rowCount}=resultado
    if (rowCount==0) {
        res.json({mensagem:"Transação não encontrada."})
    }
   }
module.exports={listar,listaEsp,transacao,deletar,atualizarTransacao}