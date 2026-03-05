import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt, 
  FaRocket, 
  FaShieldAlt, 
  FaPlus,
  FaCheckCircle,
  FaStar,
  FaGlobe,
  FaKey
} from "react-icons/fa";
// Importando o ícone de cesta específico (estilo shopping)
import { FaBasketShopping } from "react-icons/fa6"; 
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./App.css";

// Imports de Imagens
import forza5 from "./assets/forza5.png";
import forza6 from "./assets/forza6.png";
import gta5 from "./assets/gta5.png";
import farming25 from "./assets/farming25.png";
import gamepass from "./assets/gamepass.png";
import spiderman2 from "./assets/spiderman2.png";
import rdr2 from "./assets/rdr2.png";

function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const produtos = [
    { id: 1, nome: "Forza Horizon 5", preco: 20, imagem: forza5, link: "https://pay.kiwify.com.br/OsnTq15", texto: "Código digital enviado automaticamente." },
    { id: 2, nome: "Forza Horizon 6 - Pré venda", preco: 14.99, imagem: forza6, link: "https://pay.kiwify.com.br/KcN8QnT", texto: "Você receberá uma Key e um programa da STM para ativar a licença." },
    { id: 3, nome: "GTA 5", preco: 25, imagem: gta5, link: "https://pay.kiwify.com.br/SEULINKAQUI", texto: "Código digital automático." },
    { id: 4, nome: "Farming Simulator 25", preco: 25, imagem: farming25, link: "https://pay.kiwify.com.br/U1tz1rD", texto: "Entrega garantida." },
    { id: 5, nome: "Xbox Game Pass Trial", preco: 30, imagem: gamepass, link: "https://kiwify.app/s6lSUqa", texto: "1 Mês de assinatura." },
    { id: 6, nome: "Marvel's Spider-Man 2", preco: 25, imagem: spiderman2, link: "https://pay.kiwify.com.br/EJccf0T", texto: "Versão digital imediata." },
    { id: 7, nome: "Red Dead Redemption 2", preco: 30, imagem: rdr2, link: "https://pay.kiwify.com.br/SEULINKAQUI", texto: "Versão digital completa." },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user ? { email: user.email } : null);
    });
    return () => unsubscribe();
  }, []);

  async function criarConta(e, nome, email, senha) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("Conta criada 🎉");
      navigate("/");
    } catch (error) { alert(error.message); }
  }

  async function login(e, email, senha) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Login realizado 🚀");
      navigate("/");
    } catch { alert("Erro no login"); }
  }

  const adicionarCarrinho = (p) => { setCarrinho([...carrinho, p]); alert("Adicionado! 🛒"); };
  const removerItem = (index) => setCarrinho(carrinho.filter((_, i) => i !== index));
  const finalizarCompra = () => { if (carrinho.length > 0) window.location.href = carrinho[0].link; };

  return (
    <div className="container">
      <header className="navbar">
        <h2 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>TECHYDALGO</h2>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/carrinho" className="cart-link">
            <FaShoppingCart /> <span>{carrinho.length}</span>
          </Link>
          {!usuario ? (
            <><Link to="/login" className="login-btn"><FaUser /> Login</Link></>
          ) : (
            <><span className="user-email">{usuario.email}</span><button onClick={() => signOut(auth)} className="btn-sair">Sair</button></>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={
          <div className="produtos animacao-entrada">
            {produtos.map(p => (
              <div key={p.id} className="card" onClick={() => navigate(`/produto/${p.id}`)}>
                <img src={p.imagem} alt={p.nome} />
                <div className="card-info">
                  <h3>{p.nome}</h3>
                  <p className="price">R$ {p.preco.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        } />

        <Route path="/produto/:id" element={<ProdutoDetalhe produtos={produtos} adicionarCarrinho={adicionarCarrinho} />} />
        
        <Route path="/carrinho" element={
          usuario ? (
            <div className="carrinho-page animacao-entrada">
              <h2 className="section-title">Seu Carrinho</h2>
              {carrinho.length === 0 ? (
                <div className="empty-state"><p>Seu carrinho está vazio 🎮</p><Link to="/">Explorar Jogos</Link></div>
              ) : (
                <div className="carrinho-container">
                  <div className="carrinho-lista">
                    {carrinho.map((item, i) => (
                      <div key={i} className="carrinho-item animacao-item" style={{ animationDelay: `${i * 0.1}s` }}>
                        <img src={item.imagem} alt={item.nome} />
                        <div className="item-details">
                          <h4>{item.nome}</h4>
                          <p>R$ {item.preco.toFixed(2)}</p>
                        </div>
                        <button onClick={() => removerItem(i)} className="btn-remover">Remover</button>
                      </div>
                    ))}
                  </div>
                  <div className="carrinho-resumo">
                    <h3>Total: R$ {carrinho.reduce((acc, curr) => acc + curr.preco, 0).toFixed(2)}</h3>
                    <button onClick={finalizarCompra} className="btn-finalizar">Finalizar Compra</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="login-prompt animacao-entrada">
              <h2>🔒 Acesso Restrito</h2>
              <p>Faça login para gerenciar seu carrinho e finalizar compras.</p>
              <Link to="/login" className="btn-buy-now" style={{textDecoration: 'none', display: 'inline-block', marginTop: '15px'}}>Ir para Login</Link>
            </div>
          )
        } />

        <Route path="/login" element={<Login login={login} />} />
        <Route path="/criar-conta" element={<CriarConta criarConta={criarConta} />} />
      </Routes>
    </div>
  );
}

// COMPONENTE DETALHE
function ProdutoDetalhe({ produtos, adicionarCarrinho }) {
  const { id } = useParams();
  const produto = produtos.find((p) => p.id === Number(id));
  if (!produto) return <h2 className="animacao-entrada">Não encontrado</h2>;

  return (
    <div className="product-page-wrapper animacao-entrada">
      <div className="product-main-grid">
        <div className="product-visual">
          <img src={produto.imagem} className="main-img" alt={produto.nome} />
        </div>
        
        <div className="product-purchase-box">
          <span className="stock-info">82 em estoque</span>
          <h1>{produto.nome}</h1>
          <div className="price-tag-section">
            <span className="old-price">R$ 300,00</span>
            <span className="discount-badge">95% OFF</span>
            <div className="main-price">R$ {produto.preco.toFixed(2)}</div>
            <small>À vista no Pix</small>
          </div>
          
          <div className="product-actions">
            <button className="btn-buy-now" onClick={() => window.location.href = produto.link}>
              <FaBasketShopping /> Comprar agora
            </button>
            <button className="btn-add-to-cart" onClick={() => adicionarCarrinho(produto)}>
              <FaPlus /> Adicionar ao carrinho
            </button>
          </div>
        </div>

        <div className="trust-column">
          <div className="trust-item">
            <FaRocket className="trust-icon" />
            <div><strong>Entrega imediata</strong><p>Receba agora após o pagamento.</p></div>
          </div>
          <div className="trust-item">
            <FaShieldAlt className="trust-icon" />
            <div><strong>Segurança total</strong><p>Dados criptografados.</p></div>
          </div>
          <div className="trust-item">
            <div className="pix-badge">PIX</div>
            <div><strong>Formas de pagamento</strong><p>Aceitamos os meios mais populares.</p></div>
          </div>
        </div>
      </div>

      {/* Seção de Descrição idêntica à imagem */}
      <div className="description-container">
        <h3>Descrição</h3>
        <div className="keys-box">
           <h4><FaKey color="#facc15" /> Sobre as Keys</h4>
           <p>{produto.texto}</p>
           
           <div className="desc-bullets">
              <p><FaCheckCircle color="#22c55e" /> <strong>Tudo seu:</strong> Salve conquistas e use a nuvem (Cloud) na sua própria conta.</p>
              <p><FaStar color="#facc15" /> Todas as Keys acompanham todas as DLCS do jogo.</p>
              <p><FaGlobe color="#3b82f6" /> <strong>Modo Online:</strong> Consulte nosso suporte para saber se o jogo possui essa função.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

// COMPONENTE LOGIN
function Login({ login }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  return (
    <div className="auth-container animacao-entrada">
      <div className="auth-card">
        <h2>Login</h2>
        <p>Acesse sua conta para continuar suas compras.</p>
        <form onSubmit={(e) => login(e, email, senha)}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} required />
          <button type="submit" className="btn-auth">Entrar</button>
        </form>
        <p className="auth-footer">Não tem uma conta? <Link to="/criar-conta">Crie uma aqui</Link></p>
      </div>
    </div>
  );
}

// COMPONENTE CRIAR CONTA
function CriarConta({ criarConta }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  return (
    <div className="auth-container animacao-entrada">
      <div className="auth-card">
        <h2>Criar Conta</h2>
        <p>Junte-se à TechyDalgo e comece a jogar.</p>
        <form onSubmit={(e) => criarConta(e, nome, email, senha)}>
          <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} required />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} required />
          <button type="submit" className="btn-auth">Cadastrar</button>
        </form>
        <p className="auth-footer">Já tem conta? <Link to="/login">Faça login</Link></p>
      </div>
    </div>
  );
}

export default App;