declare namespace is {
  export function renderer(): boolean;
  export function main(): boolean;
  export function osx(): boolean;
  export function macOS(): boolean;
  export function windows(): boolean;
  export function linux(): boolean;
  export function x86(): boolean;
  export function x64(): boolean;
  export function production(): boolean;
  export function dev(): boolean;
  export function sandbox(): boolean;
  export function mas(): boolean;
  export function windowsStore(): boolean;
  export function all(): boolean;
  export function none(): boolean;
  export function one(): boolean;
  export function release(requested: string): boolean;
  export function gtRelease(requested: string): boolean;
  export function ltRelease(requested: string): boolean;
}
declare function is (): any;
export = is;
