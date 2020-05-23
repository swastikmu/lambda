const express = require('C:\\Users\\swastik.mukherjee\\AppData\\Roaming\\npm\\node_modules\\express');

const app = express();
// const crypt = require('crypt');
const convert = require('xml-js');

app.use(express.json());


app.post('/post', (req, res) => {


    const { Name, DateOfBirth,
        Address, PhoneNo, PastEducation,
        CollageEducation, About, Skills,
        Certifications, Languages, Achievements,
        ExtraCurricular, WorkExperience } = req.body;

    // let pastEdu = decodeURIComponent(PastEducation);
    // let buff = Buffer.from(pastEdu, 'base64');
    // let pastEduText = buff.toString('utf-8');

    let pastEdu = JSON.stringify(decodedData(PastEducation));


    // var result1 = convert.xml2json(pastEduText, { compact: true, spaces: 4 });
    // var result2 = convert.xml2json(pastEduText, { compact: false, spaces: 4 });
    // console.log(result1, '\n', result2);


    let clgEdu = decodeURIComponent(CollageEducation);
    let buff1 = Buffer.from(clgEdu, 'base64');
    let clgEduText = buff1.toString('utf-8');

    let achieve = decodeURIComponent(Achievements);
    let buff2 = Buffer.from(achieve, 'base64');
    let achieveText = buff2.toString('utf-8');


    let extra = decodeURIComponent(ExtraCurricular);
    let buff3 = Buffer.from(extra, 'base64');
    let cextraText = buff3.toString('utf-8');

    let work = decodeURIComponent(WorkExperience);
    let buff4 = Buffer.from(work, 'base64');
    let workText = buff4.toString('utf-8');

    // let string = JSON.stringify(pastEduText);

    console.log('School Education :::', pastEdu);
    // console.log('college education:::', clgEduText);
    // console.log('Name:::', Name);
    // console.log('D.O.B:::', DateOfBirth);
    // console.log('college education:::', Address);
    // console.log('PhoneNo:::', PhoneNo);
    // console.log('About:::', About);
    // console.log('Skills:::', Skills);
    // console.log('Certifications:::', Certifications);
    // console.log('Languages:::', Languages);
    // console.log('Achievements:::', achieveText);
    // console.log('ExtraCurricular:::', cextraText);
    // console.log('WorkExperience:::', workText);


    res.send("done")

})

const decodedData = (data) => {
    let uriDecoded = decodeURIComponent(data);
    let buff = Buffer.from(uriDecoded, 'base64');
    let decode = buff.toString('utf-8');
    return decode;
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to port ${port}`));