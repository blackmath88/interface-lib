import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
const base=process.env.VITE_BASE_PATH||'/';
export default defineConfig({base,plugins:[tanstackStart({prerender:{enabled:true,crawlLinks:false,failOnError:true}}),react()],server:{port:3000}});
