import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
const toCamelCase = require('camelcase');
const toSnakeCase = require('to-snake-case');
import { parsePhoneNumberFromString } from 'libphonenumber-js';
@Injectable()
export class StringUtil {
  /**
   * generates a random string
   * @function genRandomString
   * @param {number} length - Length of the random string.
   */
  public static toUrl(str: string, replaceSymbols?: boolean, symbolReplacing?: string): string {
    symbolReplacing = symbolReplacing || '-';
    if (!str) return '';
    str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
    str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
    str = str.replace(/[ìíịỉĩ]/g, 'i');
    str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
    str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
    str = str.replace(/[ỳýỵỷỹ]/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A');
    str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E');
    str = str.replace(/[ÌÍỊỈĨ]/g, 'I');
    str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O');
    str = str.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U');
    str = str.replace(/[ỲÝỴỶỸ]/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/"/g, '');
    if (replaceSymbols) {
      str = str.replace(/[!@$%^*()+=<>?\/,.:' &#\[]/g, symbolReplacing);
      str = str.replace(/-+-/g, symbolReplacing); // replaces double dash (--) by single (-)
      str = str.replace(/^-+|-+$/g, ''); // removes dash from both sides of string
    }
    return str;
  }

  // public static validationState(value: string): boolean {
  //   return !!stateJson.state.find((stateItem) => stateItem.abbreviation === value);
  // }

  public static isBase64(str: string) {
    if (str === '' || str.trim() === '') {
      return false;
    }
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }

  public static camelCase(value: string): string {
    return toCamelCase(value);
  }

  public static snakeCase(value: string): string {
    return toSnakeCase(value);
  }

  /**
   * @method validationSSN
   * @description validate ssn
   * @param {string} value
   * @return {boolean}
   */
  public static validationSSN(value: string) {
    const blacklist = ['078051120', '219099999', '457555462'];
    const expression = /^(?!666|000|9\d{2})\d{3}[- ]?(?!00)\d{2}[- ]?(?!0{4})\d{4}$/;
    if (!expression.test(value)) {
      return false;
    }
    return blacklist.indexOf(value.replace(/\D/g, '')) === -1;
  }

  /**
   * generates a random string
   * @function genRandomString
   * @param {number} length - Length of the random string.
   */
  public static genRandomString(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * @function genRandomNumber
   * @param length
   */
  // public static genRandomNumber(length = 3): string {
  //   let formater = '';
  //   for (let i = 0; i < length; i++) {
  //     formater += '0';
  //   }
  //   return numeral(Math.ceil(Math.random() * Math.pow(10, length) - 1)).format(formater);
  // }

  /**
   * @method genRandomNumberRanger
   * @description gen random number in ranger
   * @param {number} min ranger min value, default = 100000
   * @param {number} max ranger max value, default = 999999
   * @return {any}
   */
  public static genRandomNumberRanger(min = 100000, max = 999999): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * hashes a string with a specific algorithm.
   * @param {string} input Input string
   * @param {string} salt Salt
   * @param {string} algorithm algorithm uses to hashes(default sha512)
   * @returns {string} hashes string
   */
  public static hashString(input: string, salt: string, algorithm?: string): string {
    algorithm = algorithm || 'sha512';
    const hash = crypto.createHmac(algorithm, salt);
    hash.update(input);
    return hash.digest('hex');
  }

  /**
   * @method hashStringVOne
   * @description generate hash password from V1
   * @param password
   * @param salt
   */
  public static hashStringVOne(password: string, salt: string) {
    const byteArray = getBytes(salt + password);
    return crypto.createHash('sha256').update(byteArray).digest('base64');

    function getBytes(str: string) {
      const bytes = new Uint8Array(str.length * 2);
      blockCopy(toCharArray(str), 0, bytes, 0, bytes.length);
      return bytes;
    }

    function toCharArray(str: string): number[] {
      return str.split('').map((item) => item.charCodeAt(0));
    }

    function blockCopy(
      src: number[],
      srcOffset: number,
      dst: Uint8Array,
      dstOffset: number,
      count: number,
    ) {
      for (let i = 0; i < count; i++) {
        if (i % 2 === 0 || i === 0) {
          dst[dstOffset + i] = src[i / 2];
        }
      }
    }
  }

  public static ip2int(ip: string) {
    return (
      ip.split('.').reduce(function (ipInt, octet) {
        return (ipInt << 8) + parseInt(octet, 10);
      }, 0) >>> 0
    );
  }

  public static int2ip(ipInt: number) {
    return (
      (ipInt >>> 24) +
      '.' +
      ((ipInt >> 16) & 255) +
      '.' +
      ((ipInt >> 8) & 255) +
      '.' +
      (ipInt & 255)
    );
  }

  /**
   * @method convertErrorCodeToMessage
   * @param code
   */
  public static convertErrorCodeToMessage(code: string): string {
    const errorPattern = /([A-Z_0-9]+)/g;
    let output: string;
    if (!code || !code.match(errorPattern)) return undefined;
    // eslint-disable-next-line prefer-const
    output = code
      .split('_')
      .map((x) => x.toLowerCase())
      .join(' ');
    return output[0].toUpperCase() + output.substr(1);
  }

  /**
   * @method roundNumber
   * @param {number} num value param
   * @param {number} range number round after , => default = "2"
   */
  public static roundNumber(num: number, range = 2) {
    return +`${Math.round(`${num}e+${range}` as any)}e-${range}`;
  }

  /**
   * generates a random string
   * @function genRandomCodePrefix
   * @param {string} prefix - prefix of the random code.
   * * @param {string} length - Length number of the random code.
   */
  // public static genRandomCodePrefix(prefix: string, length: number): string {
  //   return `${prefix}` + this.genRandomNumber(length);
  // }

  /**
   * generates a random password
   * @function randPassword
   * @param {string} length - Length number of the random password.
   */

  public static randPassword(length: number) {
    if (length < 4) {
      return '';
    }
    const either = Math.floor(Math.random() * (length - 3)) + 1;
    const letters = Math.floor(Math.random() * (length - either - 2)) + 1;
    const numbers = Math.floor(Math.random() * (length - either - letters - 1)) + 1;
    const symbols = length - either - numbers - letters;
    const chars = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // letters
      '0123456789', // numbers
      '$@$!%*?&.', // symbols
      'abcdefghijklmnopqrstuvwxyz' // either
    ];

    return [letters, numbers, symbols, either].map((len, i) => {
      return Array(len).fill(chars[i]).map((x) => {
        return x[Math.floor(Math.random() * x.length)];
      }).join('');
    }).concat().join('').split('').sort(() => {
      return 0.5 - Math.random();
    }).join('');
  }

  public static randPasswordWithoutSymbols(length: number) {
    if (length < 4) {
      return '';
    }
    const either = Math.floor(Math.random() * (length - 3)) + 1;
    const letters = Math.floor(Math.random() * (length - either - 2)) + 1;
    const numbers = Math.floor(Math.random() * (length - either - letters - 1)) + 1;
    const symbols = length - either - numbers - letters;
    const chars = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // letters
      '0123456789', // numbers
      'abcdefghijklmnopqrstuvwxyz', // symbols
      'abcdefghijklmnopqrstuvwxyz' // either
    ];

    return [letters, numbers, symbols, either].map((len, i) => {
      return Array(len).fill(chars[i]).map((x) => {
        return x[Math.floor(Math.random() * x.length)];
      }).join('');
    }).concat().join('').split('').sort(() => {
      return 0.5 - Math.random();
    }).join('');
  }

  /**
   * generates a random referral code
   * @function genRefCode
   * @param {string} length - Length number of the random code.
   */
  public static genRefCode(length: number): string {
    let refCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      refCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return refCode;
  }

  public static convertPhoneNumber(phone: string): string {
    const parsedPhoneNumber = parsePhoneNumberFromString(phone, 'VN');

    if (parsedPhoneNumber) {
      const internationalPhoneNumber = parsedPhoneNumber.formatInternational();
      return internationalPhoneNumber;
    } else {
      return 'Số điện thoại không hợp lệ';
    }
  }
}
