import * as cheerio from 'cheerio';
import axios from 'axios';

class BNRS_System {
    async BNRS_scraper(keyword: string, sort_order: string = 'asc', sort_by: string = 'business_name', criteria: string = 'exact') {
        const url = "https://bnrs.dti.gov.ph/search";
        const params = { keyword, sort_order, sort_by, criteria }
        const res = await axios.get(url, { params });
        const $ = cheerio.load(res.data);
        const tbody_tr = $('tbody');
        const tr = tbody_tr.find('tr');
        const dataColumns = ["Business Name", "Business Territory", "Owner's Name", "Certificate No. / BNN", "Transcation/Registration Date", "Status", "Business Scope"]
        const dataArray: any = [];
        tr.each((i, el) => {
            const data = $(el).children().map((i, el: any) => {
                return el.children[0].data.trim();
            });
            const obj: any = {};
            data.each((i, el) => {
                obj[dataColumns[i]] = el;
            });
            dataArray.push(obj);
        });
        return { length: tr.length, data: dataArray };
    }
    async verifyBusiness(keyword: string) {
        const res = await this.BNRS_scraper(keyword);
        if (res.length > 0) {
            console.log(`Business Name: ${keyword} is registered in BNRS`);
        }
        else {
            console.log(`Business Name: ${keyword} is not registered in BNRS`);
        }
        return res;
    }
}

const BNRS = new BNRS_System();
BNRS.verifyBusiness("Jukcatts Boarding House");