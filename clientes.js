const pool=require('../conexao')
const bcrypt=require('bcrypt')
const {senhaJwt}=require('../jwt')
const jwt=require('jsonwebtoken')
const {validarU}=require('./intermediario')

const cadastrar=async(req,res)=>{
    try {
    const { nome, email, senha}=req.body
    const dados=await pool.query('SELECT * FROM usuarios WHERE email=$1',[email])
    const {rowCount}=dados
    if (rowCount>0) {
       res.status(404).json({mensagem: "Já existe usuário cadastrado com o e-mail informado."}) 
    }
    const sql='INSERT INTO usuarios( nome, email, senha) VALUES ($1,$2,$3) returning *'
    const senhaV=await bcrypt.hash(senha,10)
    const params=[nome, email, senhaV]
    const result=await pool.query(sql,params)
    const {senha:_,...usuarios}=result.rows[0]
     const clinte={
      usuarios
     }
    res.status(200).json(clinte.usuarios)
 } catch (error) {
    return res.status(401).json('não foi possível cadastrar o usuario.')
    }
    
}
const login=async(req,res)=>{
    try {    
    const {email,senha}=req.body
    const result=await pool.query('SELECT * FROM usuarios WHERE email=$1',[email])
    const {rowCount}=result
    console.log(rowCount)
    if (rowCount<=0) {
        res.status(404).json({mensagem: "Usuário e/ou senha inválido(s)"})
    }
    const senhaValida=await bcrypt.compare(senha,result.rows[0].senha)
    if (!senhaValida) {
        res.status(404).json({mensagem: "Usuário e/ou senha inválido(s)"})
    }
    const {senha:_,...usuarios}=result.rows[0]
    const token=jwt.sign({id:result.rows[0].id},senhaJwt,{expiresIn:'8 h'})
    const resultado={
        usuarios,
        token
    }

    res.status(200).json(resultado)
} catch (error) {
    return res.status(401).json("Não foi possivel fazer o login.")    
}
}

const detalhar=async(req,res)=>{
    try {   
    return res.json(req.usuario) 
    }catch (error) {
        res.status(404).json({mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado."})
    }
}

const atualizar=async(req,res)=>{ 
    const {id}=req.usuario
    const {nome,email,senha}=req.body
    const dados=await pool.query('SELECT * FROM usuarios WHERE email=$1',[email])
    const {rowCount}=dados
    if (rowCount>0) {
       res.status(404).json({mensagem: "O e-mail informado já está sendo utilizado por outro usuário."
    }) 
    }
    const sql='update usuarios set nome=$1,email=$2,senha=$3 where id=$4 returning *'
    const senhaV=await bcrypt.hash(senha,10)
    const params=[nome, email, senhaV,id]
    const result=await pool.query(sql,params)
    return res.status(200).json(result.rows)
}

module.exports={cadastrar,login,detalhar,atualizar}