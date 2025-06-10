const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'db',
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
