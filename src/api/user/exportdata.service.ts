import { Injectable, StreamableFile } from '@nestjs/common';
import { json2csvAsync } from 'json-2-csv';
import { join } from 'path';
import { appendFile, createReadStream, readFile, ReadStream, writeFile } from 'fs';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { google } from 'googleapis';
import keys from '../../../keys.json';
import console from 'console';
import * as fs from 'fs';
import { convertCSVToArray } from 'convert-csv-to-array';

@Injectable()
export class ExportDataService {
    constructor(private readonly userRepository: UserRepository,
        private userService: UserService,
    ) { };


    async exportFile() {
        const data = this.userService.getAllUsers();
        const file = await json2csvAsync(await data);
        appendFile(join(__dirname, './dto/', 'data.csv'), file, (err) => {
            if (err) {
                console.error(err);
                throw new HttpException(
                    "Couldn't create the csv",
                    HttpStatus.NOT_FOUND,
                );
            }
        },)

        const sendFile = createReadStream(join(__dirname, './dto/', 'data.csv'));
        return new StreamableFile(sendFile);
        // return join(__dirname, './dto/', 'data.csv');
    }


    // async getGoogleSheet() {
    //     const doc = new GoogleSpreadsheet(keys.sheep_id);

    //     await doc.useServiceAccountAuth({
    //         client_email: keys.client_email,
    //         private_key: keys.private_key,
    //     });

    //     await doc.loadInfo();
    //     const sheet = doc.sheetsByIndex[0];
    //     const jsonArray = await csv().fromFile(join(__dirname, './dto/', 'data.csv'));
    //     await sheet.addRows(jsonArray);
    //     return { message: 'Writing data to Google Sheet succeeds!' };
    // }

    async exportGG() {


        const client = new google.auth.JWT(
            keys.client_email,
            null,
            keys.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize((err, tokens) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Connected');

        });

        return await this.gsun(client);

        // return { message: 'updated successfully', }


        //read
        // const getRow = await gsapi.spreadsheets.values.get({
        //     auth,
        //     spreadsheetId: keys.sheep_id,
        //     range: 'data',
        // })
        // return data.send(getRow.data);

    }

    async gsun(client) {
        const data1 = this.userService.getAllUsers();
        const file = await json2csvAsync(await data1);
        writeFile(join(__dirname, './dto/', 'data.csv'), file, (err) => {
            if (err) {
                console.error(err);
                throw new HttpException(
                    "Couldn't create the csv",
                    HttpStatus.NOT_FOUND,
                );
            }
        },)
        const gsapi = google.sheets({ version: 'v4', auth: client });
        const metaData = await gsapi.spreadsheets.get({
            auth: client,
            spreadsheetId: keys.sheep_id,
        });
        console.log(metaData.data.spreadsheetUrl);

        const dataa = fs.readFileSync(join(__dirname, './dto/', 'data.csv'), 'utf8');
        // console.log(dataa);
        let arrayData = convertCSVToArray(dataa, {

            type: 'array',
            separator: ',',

        });

        console.log(arrayData);

        // arrayData = await arrayData.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14]]);

        const updateOptions = {
            spreadsheetId: keys.sheep_id,
            range: 'data!A1',
            valueInputOption: 'USER_ENTERED',
            resource: { values: arrayData },
        };

        gsapi.spreadsheets.values.update(updateOptions, function (err, response) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(response);

        });


        return { url: metaData.data.spreadsheetUrl };
    }


}




