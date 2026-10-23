import {createRootRoute,HeadContent,Scripts,Outlet} from '@tanstack/react-router';
import css from '../styles.css?url';
export const Route=createRootRoute({head:()=>({meta:[{charSet:'utf-8'},{name:'viewport',content:'width=device-width, initial-scale=1'},{title:'Interface Atlas — a field guide to the web'}],links:[{rel:'stylesheet',href:css}]}),component:()=> <html lang="en"><head><HeadContent/></head><body><Outlet/><Scripts/></body></html>});
