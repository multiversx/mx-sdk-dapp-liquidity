import 'dotenv/config';
import { TextDecoder, TextEncoder } from 'util';

// Polyfill for TextDecoder and TextEncoder
Object.assign(global, { TextDecoder, TextEncoder });
