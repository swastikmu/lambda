const mysql = require('mysql')
const uuidv4 = require('uuid/v4')
const AWS = require('aws-sdk')
const base64 = require('base-64')
const s3 = new AWS.S3();
const uploadBucket = 'elasticbeanstalk-us-east-2-516471640075'
var profileImgData
var imgRef
var resumeRef

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    port: process.env.PORT,
    database: process.env.DB
});

var optionalsEdus;
var optionalsClgs;
var urgentProfileParams;

exports.handler = async (event, context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false;

    //added by swastik
    let candData = JSON.parse(event);

    let { Name, DateOfBirth,
        Address, PhoneNo, PastEducation,
        CollegeEducation, About, Skills,
        Certifications, Languages, Achievements,
        ExtraCurricular, WorkExperience } = candData;

    if (PastEducation != null && PastEducation.length > 0) {

        let PastEducation = JSON.stringify(decodedData(PastEducation));

    }

    if (CollegeEducation != null && CollegeEducation.length > 0) {

        let CollegeEducation = JSON.stringify(decodedData(CollegeEducation));

    }
    if (Achievements != null && Achievements.length > 0) {
        let Achievements = JSON.stringify(decodedData(Achievements));

    }
    if (WorkExperience != null && WorkExperience.length > 0) {
        let WorkExperience = JSON.stringify(decodedData(WorkExperience));

    }

    const exists = await profileExists(event.candidateId);
    if (exists.NUMBER === 0) {

        // urgentProfileParams = {
        //     candId: event.candidateId,
        //     dob: event.dateOfbirth,
        //     phone: event.phoneNumber,
        //     address: event.address
        // }

        // let { PastEducation , CollegeEducation , Achievements , WorkExperience} = event;

        // let PastEducation = JSON.stringify(decodedData(PastEducation));
        // let CollegeEducation = JSON.stringify(decodedData(CollegeEducation));
        // let Achievements = JSON.stringify(decodedData(Achievements));
        // let WorkExperience = JSON.stringify(decodedData(WorkExperience));



        saveProfile(Name, DateOfBirth,
            Address, PhoneNo, PastEducation,
            CollegeEducation, About, Skills,
            Certifications, Languages, Achievements,
            ExtraCurricular, WorkExperience)

    } else {
        //update
        let query = `UPDATE customers (Name, DateOfBirth,
            Address, PhoneNo, PastEducation,
            CollegeEducation, About, Skills,
            Certifications, Languages, Achievements,
            ExtraCurricular, WorkExperience) VALUES (${Name}, ${DateOfBirth},
            ${Address}, ${PhoneNo}, ${PastEducation},
            ${CollegeEducation}, ${About}, ${Skills},
            ${Certifications}, ${Languages}, ${Achievements},
            ${ExtraCurricular}, ${WorkExperience})`;
    }



    if (event.profileImageContent != null) {
        profileImgData = base64.decode(decodeURIComponent(event.profileImageContent))
        imgRef = await uploadFile('profile-images', profileImgData);
    }

    if (event.resumeFIleContent != null) {
        resumeData = base64.decode(decodeURIComponent(event.resumeFileContent))
        resumeRef = await uploadFile('resumes', resumeData);
    }

}

const decodedData = (data) => {
    let uriDecoded = decodeURIComponent(data);
    let buff = Buffer.from(uriDecoded, 'base64');
    let decode = buff.toString('utf-8');
    return decode;
}

const uploadFile = async function (folder, data) {
    let fileId = uuidv4();
    let extension = folder === 'resumes' ? 'jpg' : 'pdf'
    var s3params = {
        Bucket: uploadBucket,
        Key: `${folder}/${fileId}.${extension}`,
        Body: data
    };

    return new Promise((resolve, reject) => {
        s3.upload(s3params, (err, data) => {
            if (err) {
                console.log('file upload failed.')
                reject(err)
            }

            if (data) {
                console.log('file successfully uploaded.')
                resolve(fileId)
            }
        })
    });
}

const saveProfile = async (Name, DateOfBirth,
    Address, PhoneNo, PastEducation,
    CollegeEducation, About, Skills,
    Certifications, Languages, Achievements,
    ExtraCurricular, WorkExperience) => {


    let query = `INSERT INTO customers (Name, DateOfBirth,
            Address, PhoneNo, PastEducation,
            CollegeEducation, About, Skills,
            Certifications, Languages, Achievements,
            ExtraCurricular, WorkExperience) VALUES (${Name}, ${DateOfBirth},
            ${Address}, ${PhoneNo}, ${PastEducation},
            ${CollegeEducation}, ${About}, ${Skills},
            ${Certifications}, ${Languages}, ${Achievements},
            ${ExtraCurricular}, ${WorkExperience})`;

    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result)
            }
        });
    });

}

const profileExists = async (candId) => {
    var query = `SELECT COUNT(*) AS NUMBER FROM CANDIDATE_PROFILE_TABLE WHERE CANDIDATE_ID = ${candId}`

    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) {
                reject(err)
            }
            if (result) {
                resolve(result)
            }
        });
    });
}

const optionalsExists = async (table, candId, orgType) => {

    var tableName = table === 'clg' ? 'CAND_CLG_EDUCATION_TABLE' : 'CAND_PAST_EDUCATION_TABLE';
    var orgClmn = table === 'clg' ? 'COLLAGE_TYPE' : 'PAST_ORG_TYPE';

    var query = `SELECT COUNT(*) AS NUMBER FROM ${tableName} WHERE CANDIDATE_ID = ${candId} AND ${orgClmn} = ${orgType}`;

    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) {
                reject(err)
            }
            if (result) {
                resolve(result)
            }
        });
    });
}

const insertOptional = async (optional, table) => {
    var query = table === 'clg' ? 'INSERT INTO CAND_CLG_EDUCATION_TABLE (CANDIDATE_ID, COLLAGE_TYPE, COLLAGE_NAME, YEAR_START, YEAR_END, SESION_SCORES) VALUES ?' :
        'INSERT INTO CAND_PAST_EDUCATION_TABLE (CANDIDATE_ID, PAST_ORG_TYPE, PAST_ORG_NAME, YEAR_START, YEAR_END, SCORE) VALUES ?';
}