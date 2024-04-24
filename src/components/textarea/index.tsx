import { HTMLProps } from 'react';
import style from './style.module.css'


export function Textarea({...rest}: HTMLProps<HTMLTextAreaElement>){
    return <textarea className={style.textarea} {...rest}></textarea>;
} 