
const {senhaJwt}=require('../jwt')
const jwt=require('jsonwebtoken')
const pool=require('../conexao')

const validarU=async(req,res,next)=>{
    const {authorization}=req.headers
    const token=authorization.split(' ')[1]
    const {id}=jwt.verify(token,senhaJwt)
    const { rows, rowCount } = await pool.query(
        'select * from usuarios where id = $1',
        [id]
    )
    if (rowCount < 1) {

        return res.status(401).json({ mensagem: 'Não autorizado' })
    }

    req.usuario = rows[0]

    next()
}


module.exports={validarU}

