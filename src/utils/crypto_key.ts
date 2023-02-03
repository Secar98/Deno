export class Key {
  static key: CryptoKey | undefined;
 
  static async generateKey(): Promise<CryptoKey> {
    if(this.key == undefined) {
      this.key = await crypto.subtle.generateKey(
       { name: "HMAC", hash: "SHA-512" },
       true,
       ["sign", "verify"],
     );
    }
    return this.key;
  }

  static async getKey(): Promise<CryptoKey> {
    return await this.generateKey();
  }
}