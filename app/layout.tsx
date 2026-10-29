import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'WarLike Mail — Un même univers, une même boîte.',description:'Messagerie interne et inscriptions communes à WarLike Studio et WarLike Engine.',manifest:'/manifest.webmanifest',icons:{icon:'/favicon.svg',apple:'/icon-192.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
