import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

import './app.css'

function App() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost] = useState('')

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [user, setUser] = useState(false)
  const [userDetail, setUseDatail] = useState({})

  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = []

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(listaPost)
      })
    }

    loadPosts()
  }, [])

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if(user){
          setUser(true)
          setUseDatail({
            uid: user.uid,
            email: user.email,
          })
        }else {
          setUser(false)
          setUseDatail({})
        }
      })
    }
    checkLogin()
  }, [])

  async function handleAdd() {
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    }).then(() => {
      console.log("Dados registrados no db");
      setAutor('')
      setTitulo('')
    })
      .catch((error) => {
        console.log("Gerou erro: " + error);
      })

  }

  async function buscarPost() {
    const postRef = collection(db, "posts")

    await getDocs(postRef)
      .then((snapshot) => {

        let lista = []

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(lista)
      }).catch((erro) => {
        console.log("Deu erro ao buscar");
      })
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost)

    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    }).then(() => {
      console.log("POST ATUALIZADO");
      setIdPost('')
      setTitulo('')
      setAutor('')
    }).catch(() => {
      console.log("ERRO AO ATUALIZAR O POST");
    })
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id)

    await deleteDoc(docRef)
      .then(() => {
        alert("Post deletado com sucesso!")
      })
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log('deu tudo certo ao cadastrar');
        setEmail('')
        setSenha('')
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca :(")
        } else if (error.code === "auth/email-already-in-use") {
          alert("Email já em uso, tente com outro !")
        }
      })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("Deu tudo certo ao logar");
        console.log(value.user);

        setUseDatail({
          uid: value.user.uid,
          email: value.user.email,
        })

        setUser(true)

        setEmail('')
        setSenha('')
      }).catch((error) => {
        console.log(error);
      })
  }

  async function fazerLogout(){
    await signOut(auth)
    setUser(false)
    setUseDatail({})
  }

  return (
    <div>
      <h1>React JS + firebase</h1>

      {user && (
        <div>
          <strong>Você está logado ! Seja bem-vindo</strong><br></br>
          <span>ID: {userDetail.uid} - EMAIL: {userDetail.email}</span>
          <br></br>
          <button onClick={fazerLogout}>Sair da conta</button>
          <br></br>
        </div>
      )}

      <div className="container">
        <h2>Usuarios</h2>

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um email"
        /><br></br>
        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Informe sua senha"
        /><br />

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Login</button>

      </div><br></br>
      <hr /><br></br>
      <div className="container">

        <label>ID do post: </label>
        <input
          placeholder="Digite o id do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />

        <label>Título:</label>
        <textarea
          type="text"
          placeholder="Digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor:</label>

        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd} >Cadastrar</button>
        <button onClick={buscarPost} >Buscar post</button>
        <button onClick={editarPost} >Atualizar post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>Id: {post.id}</strong><br />
                <span>Titulo: {post.titulo} </span><br></br>
                <span>Autor: {post.autor}</span><br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button><br /><br />
              </li>
            )
          })}
        </ul>

      </div>

    </div>
  );
}


export default App;
