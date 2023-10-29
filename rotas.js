const express=require('express')
const app=express()
const {validarU}=require('./src/intermediario')
const { cadastrar,login, detalhar, atualizar} = require('./src/clientes')
const categorias=require('./src/categorias')
const transacao=require('./src/transacoes')



app.post('/usuario', cadastrar)
app.get('/login', login)
app.use(validarU)
app.get('/usuario',detalhar)
app.put('/usuario',atualizar)
app.get('/categoria',categorias.listar)
app.get('/transacao',transacao.listar)
app.get('/transacao/:id',transacao.listaEsp)
app.post('/transacao',transacao.transacao)
app.put('/transacao/:id',transacao.atualizarTransacao)
app.delete('/transacao/:id', transacao.deletar)
module.exports=app
