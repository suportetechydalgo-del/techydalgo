import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./App.css";

import forza5 from "./assets/forza5.png";
import forza6 from "./assets/forza6.png";
import gta5 from "./assets/gta5.png";
import farming25 from "./assets/farming25.png";
import gamepass from "./assets/gamepass.png";

function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario({ email: user.email });
      } else {
        setUsuario(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const produtos = [
    {
      id: 1,
      nome: "Forza Horizon 5",
      preco: 20,
      imagem: forza5,
      link: "https://pay.kiwify.com.br/OsnTq15",
      texto:
        "Forza Horizon 5 é um jogo de corrida em mundo aberto no México. Após a compra você receberá um código digital por email. Ative na Microsoft Store em 'Resgatar código'.",
    },
    {
      id: 2,
      nome: "Forza Horizon 6",
      preco: 30,
      imagem: forza6,
      link: "https://pay.kiwify.com.br/KcN8QnT",
      texto:
        "Forza Horizon 6 traz novos carros e mapas. Código enviado automaticamente após a compra. Ative via Xbox App ou Microsoft Store.",
    },
    {
      id: 3,
      nome: "GTA 5",
      preco: 25,
      imagem: gta5,
      link: "https://pay.kiwify.com.br/SEULINKAQUI",
      texto:
        "GTA 5 é um jogo de mundo aberto cheio de ação. Após a compra você receberá um código digital por email. Ative na Rockstar ou Steam.",
    },
    {
      id: 4,
      nome: "Farming Simulator 25",
      preco: 25,
      imagem: farming25,
      link: "https://pay.kiwify.com.br/SEULINKAQUI",
      texto:
        "Farming Simulator 25 é um simulador agrícola com novos mapas e máquinas. Após a compra você receberá um código digital. Ative na plataforma correspondente.",
    },
    {
      id: 5,
      nome: "Gift Card Xbox Game Pass Ultimate 1 Mês Código Digital",
      preco: 65,
      imagem: gamepass,
      link: "https://pay.kiwify.com.br/SEULINKAQUI",
      texto:
        "Gift Card Xbox Game Pass Ultimate válido por 1 mês. Após a compra você receberá um código digital por email. Ative em redeem.microsoft.com inserindo o código na sua conta Microsoft.",
    },
  ];

  function adicionarCarrinho(produto) {
    setCarrinho([...carrinho, produto]);
    alert("Adicionado ao carrinho 🛒");
  }

  function removerItem(index) {
    const novoCarrinho = carrinho.filter((_, i) => i !== index);
    setCarrinho(novoCarrinho);
  }

  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  function finalizarCompra() {
    if (carrinho.length === 0) return;
    window.location.href = carrinho[0].link;
  }

  async function criarConta(e, nome, email, senha) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("Conta criada com sucesso 🎉");
      navigate("/");
    } catch (error) {
      alert("Erro: " + error.message);
    }
  }

  async function login(e, email, senha) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Login realizado 🚀");
      navigate("/");
    } catch {
      alert("Email ou senha incorretos ❌");
    }
  }

  async function sair() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <div className="container">
      <header className="navbar">
        <h2>TECHYDALGO</h2>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/carrinho">
            <FaShoppingCart /> {carrinho.length}
          </Link>

          {!usuario ? (
            <>
              <Link to="/login">
                <FaUser /> Login
              </Link>
              <Link to="/criar-conta">Criar Conta</Link>
            </>
          ) : (
            <>
              <span>
                <FaUser /> {usuario.email}
              </span>
              <button onClick={sair}>
                <FaSignOutAlt /> Sair
              </button>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <div className="produtos">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="card"
                  onClick={() => navigate(`/produto/${produto.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={produto.imagem} alt={produto.nome} />
                  <h3>{produto.nome}</h3>
                  <p>R$ {produto.preco.toFixed(2)}</p>
                </div>
              ))}
            </div>
          }
        />

        <Route
          path="/produto/:id"
          element={
            <ProdutoDetalhe
              produtos={produtos}
              adicionarCarrinho={adicionarCarrinho}
            />
          }
        />

        <Route
          path="/carrinho"
          element={
            usuario ? (
              <div>
                <h2>Seu Carrinho 🛒</h2>
                {carrinho.length === 0 ? (
                  <p>Seu carrinho está vazio</p>
                ) : (
                  <>
                    {carrinho.map((item, index) => (
                      <div key={index}>
                        {item.nome} - R$ {item.preco.toFixed(2)}
                        <button onClick={() => removerItem(index)}>
                          Remover
                        </button>
                      </div>
                    ))}
                    <h3>Total: R$ {total.toFixed(2)}</h3>
                    <button onClick={finalizarCompra}>
                      Ir para pagamento 💳
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div>
                <h2>Você precisa estar logado 🔒</h2>
                <Link to="/login">Ir para Login</Link>
              </div>
            )
          }
        />

        <Route
          path="/criar-conta"
          element={<CriarConta criarConta={criarConta} />}
        />
        <Route path="/login" element={<Login login={login} />} />
      </Routes>
    </div>
  );
}

function ProdutoDetalhe({ produtos, adicionarCarrinho }) {
  const { id } = useParams();
  const produto = produtos.find((p) => p.id === Number(id));
  if (!produto) return <h2>Produto não encontrado</h2>;

  return (
    <div>
      <img src={produto.imagem} alt={produto.nome} width="300" />
      <h2>{produto.nome}</h2>
      <p>Preço: R$ {produto.preco.toFixed(2)}</p>
      <p>{produto.texto}</p>
      <button onClick={() => adicionarCarrinho(produto)}>
        Adicionar ao Carrinho 🛒
      </button>
    </div>
  );
}

function CriarConta({ criarConta }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div>
      <h2>Criar Conta</h2>
      <form onSubmit={(e) => criarConta(e, nome, email, senha)}>
        <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} required />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Senha" type="password" onChange={(e) => setSenha(e.target.value)} required />
        <button type="submit">Criar Conta</button>
      </form>
    </div>
  );
}

function Login({ login }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={(e) => login(e, email, senha)}>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Senha" type="password" onChange={(e) => setSenha(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default App;