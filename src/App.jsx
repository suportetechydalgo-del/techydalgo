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
      texto: "Código digital enviado automaticamente após pagamento.",
    },
    {
      id: 2,
      nome: "Pré-vendaForza Horizon 6",
      preco: 30,
      imagem: forza6,
      link: "https://pay.kiwify.com.br/KcN8QnT",
      texto: "Código digital enviado automaticamente após pagamento.",
    },
    {
      id: 3,
      nome: "GTA 5",
      preco: 25,
      imagem: gta5,
      link: "https://pay.kiwify.com.br/SEULINKAQUI",
      texto: "Código digital enviado automaticamente após pagamento.",
    },
    {
      id: 4,
      nome: "Farming Simulator 25",
      preco: 25,
      imagem: farming25,
      link: "https://pay.kiwify.com.br/U1tz1rD",
      texto: "Código digital enviado automaticamente após pagamento.",
    },
    {
      id: 5,
      nome: "Xbox Game Pass Premium Trial - 1 Month",
      preco: 30,
      imagem: gamepass,
      link: "https://kiwify.app/s6lSUqa",
      texto: "Xbox Game Pass Premium Trial - 1 Month - envio automático.",
    },
  ];

  function adicionarCarrinho(produto) {
    setCarrinho([...carrinho, produto]);
    alert("Adicionado ao carrinho 🛒");
  }

  function removerItem(index) {
    const novo = carrinho.filter((_, i) => i !== index);
    setCarrinho(novo);
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
      alert("Conta criada 🎉");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  }

  async function login(e, email, senha) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Login realizado 🚀");
      navigate("/");
    } catch {
      alert("Erro no login");
    }
  }

  async function sair() {
    await signOut(auth);
  }

  return (
    <div className="container">

      <header className="navbar">
        <h2 
          style={{ cursor: "pointer" }} 
          onClick={() => navigate("/")}
        >
          TECHYDALGO
        </h2>

        <nav>
          <Link to="/como-funciona">Como funciona</Link>

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

        {/* HOME */}
        <Route
          path="/"
          element={
            <div>

              <div style={{
                background: "#111",
                padding: "40px",
                textAlign: "center",
                borderRadius: "10px",
                marginBottom: "40px"
              }}>
                <h1 style={{ color: "#00e676" }}>
                  Jogos Digitais com Entrega Imediata 🎮
                </h1>
                <p>
                  Compra segura • Código automático • Suporte rápido
                </p>
              </div>

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
                    <p style={{ color: "#00e676", fontWeight: "bold" }}>
                      R$ {produto.preco.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
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
                <h2>Seu Carrinho</h2>

                {carrinho.length === 0 ? (
                  <p>Seu carrinho está vazio</p>
                ) : (
                  <>
                    {carrinho.map((item, index) => (
                      <div key={index}>
                        {item.nome} - R$ {item.preco}
                        <button onClick={() => removerItem(index)}>
                          Remover
                        </button>
                      </div>
                    ))}

                    <h3>Total: R$ {total}</h3>

                    <button onClick={finalizarCompra}>
                      Ir para pagamento
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <h2>Você precisa estar logado 🔒</h2>
                <Link to="/login">Ir para Login</Link>
              </div>
            )
          }
        />

        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/criar-conta" element={<CriarConta criarConta={criarConta} />} />
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
    <div style={{ textAlign: "center" }}>
      <img src={produto.imagem} width="300" />
      <h2>{produto.nome}</h2>
      <p>Preço: R$ {produto.preco}</p>
      <p>{produto.texto}</p>

      <button onClick={() => adicionarCarrinho(produto)}>
        Adicionar ao Carrinho 🛒
      </button>

      <h3 style={{ marginTop: "40px" }}>Avaliações ⭐</h3>

      <p>⭐⭐⭐⭐⭐ Lucas - Recebi o código rápido.</p>
      <p>⭐⭐⭐⭐⭐ Rafael - Funcionou perfeitamente.</p>
      <p>⭐⭐⭐⭐ Ana - Ativação rápida.</p>
    </div>
  );
}

function ComoFunciona() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Como comprar</h1>
      <p>1 Escolha o jogo</p>
      <p>2 Adicione ao carrinho</p>
      <p>3 Faça o pagamento</p>
      <p>4 Receba o código digital</p>
      <p>5 Instala o aplicativo nosso representado no Email cadastrado junto com a chave key e em seguida abre a stema adciona a key no nosso aplicativo e pronto é só jogar bom jogo!</p>
    </div>
  );
}

function CriarConta({ criarConta }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Criar Conta</h2>

      <form onSubmit={(e) => criarConta(e, nome, email, senha)}>

        <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} required />
        <br /><br />

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <br /><br />

        <input type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} required />
        <br /><br />

        <button type="submit">Criar Conta</button>

      </form>
    </div>
  );
}

function Login({ login }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>

      <form onSubmit={(e) => login(e, email, senha)}>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <br /><br />

        <input type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} required />
        <br /><br />

        <button type="submit">Entrar</button>

      </form>
    </div>
  );
}

export default App;