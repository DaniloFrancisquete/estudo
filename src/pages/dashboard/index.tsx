import { GetServerSideProps } from 'next'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import style from './style.module.css'
import Head from 'next/head'

import { getSession } from "next-auth/react"
import {Textarea} from "../../components/textarea";
import {FiShare2} from 'react-icons/fi'
import {FaTrash} from 'react-icons/fa'

import{db} from '../../services/firebaseConnection'

import{addDoc,query, collection,orderBy,where,onSnapshot,doc,
    deleteDoc
} from 'firebase/firestore'

import Link from 'next/link'


interface HomeProps {
    user: {
        email:string;
    }
}

interface traskProps{
    id:string;
    created:Date;
    public:boolean;
    tarefa:string;
    user:string;
}

export default function Dashborad({user}: HomeProps) {

const [input, setInput] = useState("");
const [publicTask,setPublicTask] = useState(false);
const [tasks,setTasks] = useState<traskProps[]>([])

useEffect(() =>{
    async function loadTarefas(){
    
    const tarefasRef = collection (db, "tarefas")
    const q = query (
        tarefasRef,
        orderBy("created", "desc"),
        where("user","==",user?.email) 
    );
    onSnapshot(q, (snapshot) => {
        let lista = [] as traskProps[];
        
        snapshot.forEach((doc) =>{
            lista.push({
                id: doc.id,
                tarefa: doc.data().tarefa,
                created: doc.data().created,
                user: doc.data().user,
                public: doc.data().public
            })
        })

        setTasks(lista)
    });
}
    loadTarefas();
},[])

async function handleChangePublic(event: ChangeEvent<HTMLInputElement>){
setPublicTask(event.target.checked)
}

    async function handleRegisterTask(event: FormEvent){
event.preventDefault();

if(input === "") return;

try {
    await addDoc (collection(db,"tarefas"),{
    tarefa:input,
    created:new Date(),
    user:user?.email,
    public: publicTask
});

setInput("")
setPublicTask(false);

}catch(err){
 console.log(err)
}

}

async function handleShare(id: string){
 await navigator.clipboard.writeText(
    `${process.env.NEXT_PUBLIC_URL}/task/${id}`
 )
}

async function handleDeleteTack(id: string) {
const docRef = doc(db,"tarefas",id)
await deleteDoc(docRef)

}

    return (
        <div className={style.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

                <main className={style.main}>
                    <section className={style.content}>
                        <div className={style.contentForm}>
                            <h1 className={style.title}>
                                Qual sua tarefa?
                            </h1>

                            <form onSubmit={handleRegisterTask}>
                                <Textarea
                                placeholder="Digite qual sua Tarefa..."
                                value={input}
                                onChange={(event:ChangeEvent<HTMLTextAreaElement>) => 
                                    setInput(event.target.value)
                                }
                                />
                                <div className={style.checkboxArea}>
                                    <input 
                                    type="checkbox" 
                                    className={style.checkbox}
                                    checked={publicTask}
                                    onChange={handleChangePublic}
                                    />
                                    <label>Deixar tarefa publica?</label>
                                </div>

                                <button className={style.button} type="submit">Registrar</button>
                            </form>
                        </div>
                    </section>
                    
                    <section className={style.taskContainer}>
                        <h1>Minhas tarefas</h1>
                        
                      {tasks.map((item) => (
                          <article key={item.id} className={style.task}>
                          
                          {item.public && (
                          <div className={style.tagContainer}>
                              <label className={style.tag}>PUBLICO</label>
                              <button className={style.shareButton} onClick={() => handleShare(item.id)}>
                                <FiShare2 
                              size={22}
                              color="#3183ff"/>
                              </button>
                          </div>)}

                          <div className={style.taskContent}>
                            
                              {item.public ? (
                                <Link href={`/task/${item.id}`}>
                                <p>{item.tarefa}</p>
                                </Link>
                              ) : (
                                <p>{item.tarefa}</p>
                              )}

                              <button className={style.trashButton} onClick={() => handleDeleteTack(item.id)}>
                              <FaTrash size={24} color="#ea3140" />
                              </button>
                          </div>
                      </article>
                      ))}

                    </section>
                    </main>   
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async({req}) => {
    const session = await getSession({req});
    
    if(!session?.user) {
        return {
            redirect: {
                destination:"/",
                permanent:false,
            },
        };
    }
    return {
        props:{
            user:{
                email:session?.user?.email
            }
        },
    };  
};