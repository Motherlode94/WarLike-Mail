import MailClient from '../mail-client';
import {demoState} from '@/lib/demo';
export default function Preview(){return <MailClient initial={demoState()} demo/>;}
