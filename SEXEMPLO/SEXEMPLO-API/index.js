const express = require('express');
const mysql = require('mysql2');

// Configurações da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost', // Host do seu banco de dados
  user: 'root', // Seu usuário do banco de dados
  password: 'admin', // Sua senha do banco de dados
  database: 'mydatabase' // O nome do banco de dados
});

const app = express(); //Cria uma aplicação Expresse. Servidor que aguardando requisições em determinada porta
app.use(express.json()); // Comunicação no formato JSON. Serializar nesse formato.No Bruno Vai aparecer formato JSON

// get/usuario → rota -> caminho interno que identifica um recurso na API
// Configuração do  endpoint, ou seja, a url completa para acessar a rota . 
// Sempre que digitar a URL http://localhost:3000/sexemplo-api/usuario, chama a função/rota app.get (rota)

app.get('/usuario', (req, res) => {
    
    const sql = 'SELECT id, nome, email, login, perfil FROM usuarios order by id asc';
// passa uma função como parâmaetro (erro e resultado)
// res é objeto tem parâmetros e métodos
// Orientação a Objeto e Funções
    connection.query(sql, (error, results) => {
        if (error) {
            // console.error('Erro ao buscar usuários:', error);
            res.status(500).send(error);
        } else {
            res.status(200).json(results);
        }
    });
});

// Rota para cadastrar um novo usuário
app.post('/usuario', (req, res) => {
    const { nome, login, perfil, email, senha } = req.body; // desestruturando um objeto em várias variáveis
    console.log('Dados recebidos:', req.body);
      // Query SQL para inserir dados
    const sql = `INSERT INTO usuarios (nome, login, perfil, email, senha) VALUES ("${nome}", "${login}","${perfil}","${email}", "${senha}")`; // nesse exemplo pode acontecer o SQL Injection. Cuidado!!!

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(501).send(error);
        } else {
            console.log('Usuário cadastrado com sucesso!');
            res.status(201).send('Usuário cadastrado com sucesso');
        }
    });

  });

//Rota para alterar um usuário existente

app.put('/usuario/:id', (req, res) => {
    const { nome, login, perfil, email, senha } = req.body; // desestruturando um objeto em várias variáveis
    const id = parseInt(req.params.id, 10);
    console.log('Dados recebidos:', req.body);
    console.log('id:',id);  
     if (!id) return res.status(400).send('id é obrigatório');
  // aqui você poderia validar outros campos (email, tamanhos, etc.)
    
    // Query SQL para alterar dados
const sql = `
    UPDATE usuarios
    SET nome = ?, login = ?, perfil = ?, email = ?, senha = ?
    WHERE id = ?
  `;

const params = [nome, login, perfil, email, senha, id];
    

   connection.query(sql, params, (error, results) => {
    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).send('Erro no servidor');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    return res.status(200).send('Usuário alterado com sucesso');
  });
});




// Rota para obter um usuário por ID
app.get('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM usuarios WHERE id = ?';

    connection.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Erro ao buscar usuário:', error);
            // 500: Erro no comando
            res.status(500).send(error);
        } else if (results.length === 0) {
            res.status(404).send('Usuário não encontrado');
        } else {
            res.status(200).json(results[0]);
        }
    });
});



// Rota para deletar  um usuário por ID
app.delete('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE  FROM usuarios WHERE id = ?';

    connection.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Erro ao deletar usuário:', error);
            // 500: Erro no comando
            res.status(500).send(error);
            //checar as linhas alteraradas
        }  else if (results.affectedRows === 0) {
            res.status(404).send('Usuário não encontrado');
        }else {
            res.status(200).send ("Usuário deletado com sucesso!");
        }
    });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });