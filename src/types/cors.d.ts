declare module "cors" {
  import { RequestHandler } from "express";
  interface CorsOptions {
    origin?: string | boolean | RegExp | (string | RegExp)[];
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
  }
  function cors(options?: CorsOptions): RequestHandler;
  export default cors;
}
