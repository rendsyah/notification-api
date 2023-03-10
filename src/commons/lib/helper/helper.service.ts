// Import Modules
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import * as dayjs from 'dayjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HelperService {
    private cryptoAlgorithm = this.configService.get('app.SERVICE_CRYPTO_ALGORITHM');
    private cryptoIv = randomBytes(16);
    private cryptoSecret = createHash('sha256')
        .update(this.configService.get('app.SERVICE_CRYPTO_SECRET_KEY'))
        .digest('base64')
        .substring(0, 32);

    constructor(private readonly configService: ConfigService) {}

    public validateString(request: string, type: TValidateString): string {
        if (!request) return '';

        switch (type) {
            case 'char':
                return request.replace(/[^a-z\d\s]+/gi, '');

            case 'numeric':
                return request.replace(/[^0-9]/g, '');

            case 'emoji':
                return request.replace(/\p{Extended_Pictographic}/gu, (m: any) => `[e-${m.codePointAt(0).toString(16)}]`);

            case 'encode':
                return Buffer.from(request).toString('base64');

            case 'decode':
                return Buffer.from(request, 'base64').toString('ascii');
        }
    }

    public validateTime(request: Date, type: TValidateTime): string {
        if (!dayjs(request).isValid()) return '';

        switch (type) {
            case 'date':
                return dayjs(request).format('YYYY-MM-DD');

            case 'datetime':
                return dayjs(request).format('YYYY-MM-DD HH:mm:ss');

            case 'dateformat':
                return dayjs(request).format('YYYYMMDDHHmmss');
        }
    }

    public validateReplaceMessage(request: string, variables: string[]): string {
        if (!request) return '';

        variables.forEach((v, i) => {
            request = request.replace(`{{${i + 1}}}`, v);
        });

        return request;
    }

    public validateRequestHp(request: string): string {
        if (!request) return '';

        const checkNumberHp = request.substring(0, 2);

        if (checkNumberHp === '62') {
            return request + '@c.us';
        }

        return request.replace(checkNumberHp, '628') + '@c.us';
    }

    public validateRandomChar(request: number, type: TValidateRandomChar): string {
        if (!request) return '';

        let characters = '';
        let charactersResult = '';

        switch (type) {
            case 'alpha':
                characters = 'qwertyuiopasdfghjklzxcvbnm';
                break;

            case 'numeric':
                characters = '1234567890';
                break;

            case 'alphanumeric':
                characters = '1234567890qwertyuiopasdfghjklzxcvbnm';
                break;
        }

        for (let index = 0; index < request; index++) {
            const random = Math.floor(Math.random() * characters.length);
            charactersResult += characters[random];
        }

        return charactersResult.toUpperCase();
    }

    public validateFilename(request: string): string {
        if (!request) return '';

        const fileSplit = request.split('.');
        const filename = fileSplit.find((v) => v.match(/\.(jpeg)/gi)) && fileSplit[fileSplit.length - 1];

        return filename;
    }

    public validateEncrypt(request: string) {
        const cipher = createCipheriv(this.cryptoAlgorithm, this.cryptoSecret, this.cryptoIv);
        const encrypted = cipher.update(request, 'utf8', 'hex');
        const result = encrypted + cipher.final('hex');

        return result;
    }

    public validateDecrypt(request: string) {
        const decipher = createDecipheriv(this.cryptoAlgorithm, this.cryptoSecret, this.cryptoIv);
        const decrypted = decipher.update(request, 'hex', 'utf8');
        const result = decrypted + decipher.final('utf8');

        return result;
    }

    public validateTextSpace(request: string): string {
        let result = ""
        for(let idf = 0; idf < request.length; idf++) {
            result += request[idf] + " "
        }

        return result;
    }

    public async validateHash(request: string): Promise<string> {
        return await bcrypt.hash(request, 10);
    }

    public async validateCompare(request: string, compare: string): Promise<Boolean> {
        return await bcrypt.compare(request, compare);
    }
}
