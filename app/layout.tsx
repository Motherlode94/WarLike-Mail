import type {Metadata} from 'next';
import './globals.css';import './warlike-update-status.css';
export const metadata:Metadata={title:'WarLike Mail — Un même univers, une même boîte.',description:'Messagerie interne et inscriptions communes à WarLike Studio et WarLike Engine.',manifest:'/manifest.webmanifest',icons:{icon:'/favicon.svg',apple:'/icon-192.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr" data-warlike-app="warlike-mail" data-warlike-mode="light"><body>{children}<details className="warlike-update-notice"><summary>Mises à jour en cours</summary><p>WarLike évolue : améliorations et nouvelles fonctionnalités. Vous pouvez continuer à utiliser cette application normalement.</p></details></body></html>}
