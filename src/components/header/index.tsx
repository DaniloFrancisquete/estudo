import{useSession, signIn, signOut} from 'next-auth/react'
import style from "./styles.module.css"
import Link from "next/link";

export function Header(){

    const { data:session,status} = useSession();

    return (
        <header className={style.head}>
            <section className={style.content}>
                <nav className={style.nav}>
                    <Link href="/">
                    <h1 className={style.logo}>Tarefas<span>+</span></h1>
                    </Link>
                    {session ?.user && (
                        <Link href="/dashboard" className={style.link}>Meu Painel</Link>
                    )}
                    
                </nav>


                {status === "loading" ? (
                    <></> 
                ) : session ? (
                    <button className={style.loginbutton} onClick={() => signOut()}>
                    Olá {session?.user?.name}
                 </button>
                ) : (
                    <button className={style.loginbutton} onClick={() => signIn("google")}>
                   Acessar
                 </button>
                )}
               
            </section> 
        </header>
    );
} 