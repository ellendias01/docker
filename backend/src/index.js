const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: '201.23.3.86', // ou 'localhost' se estiver rodando localmente sem Docker
  user: 'root',
  password: 'senha123',
  database: 'usuarios_db',
  port: 3306
});
 
db.connect(err => {
  if (err) {
    console.error('Erro na conexão com o banco:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

// Rotas CRUD de usuários
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body;
  db.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).send('Usuário criado');
  });
});

app.put('/usuarios/:id', (req, res) => {
  const { nome, email } = req.body;
  db.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.send('Usuário atualizado');
  });
});

app.delete('/usuarios/:id', (req, res) => {
  db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.send('Usuário deletado');
  });
});

// Rota de callback do GitHub OAuth
app.get('/oauth2/callback/github', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Código não fornecido');
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: 'SEU_CLIENT_ID',
        client_secret: 'SEU_CLIENT_SECRET',
        code: code,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      res.send(`Token de acesso recebido com sucesso: ${data.access_token}`);
    } else {
      res.status(500).send('Erro ao obter token');
    }
  } catch (error) {
    console.error('Erro ao trocar código por token:', error);
    res.status(500).send('Erro no servidor');
  }
});

// Inicia o servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});
