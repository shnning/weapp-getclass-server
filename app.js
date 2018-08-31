/*
 * @Author: sh.ning 
 * @Date: 2018-08-13 19:44:23 
 * @Last Modified by: sh.ning
 * @Last Modified time: 2018-08-15 21:15:00
 */

const phantom = require('phantom');
const cheerio = require('cheerio'); 
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const getclass = require('./split');

const app = express();


let url='http://us.nwpu.edu.cn/eams/login.action';
let url2='http://us.nwpu.edu.cn/eams/courseTableForStd!courseTable.action';
let semester_id = [15, 33, 16, 34, 17, 35, 18, 36, 19, 37]
let semester = ['大一上学期', '大一下学期', '大二上学期', '大二下学期' , '大三上学期' , '大三下学期', '大四上学期', '大四下学期',]



let listhtml =  async (id, passwd)=>{
//取得有几个学期的课程表要获取
    let date = new Date()
    let year = date.getFullYear()
    let gocollege_Year = parseInt(id.slice(0,4))
    let year_Length = year - gocollege_Year + 1 //需要获取几个学期的课程表
    let start_year = gocollege_Year - 2015 //从哪一年开始
    console.log('year_Length: '+year_Length)
    console.log('start_year: '+start_year)
//登陆翱翔门户，获取ids属性
    let usrform='username='+id+'&password='+passwd+'&encodedPassword=&session_locale=zh_CN';
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.open(url,'post', usrform).then((data)=>{
        console.log(data)

    });
    const content1 = await page.property('content')
    //console.log(content1)
    let $ = await cheerio.load(content1);
    let ids = await $('input[name="ids"]').attr('value')
    console.log(ids);
 
    let classtable = {}
    for(let i = 0; i < year_Length * 2; i++){
        let classform = await 'ignoreHead=1&setting.kind=std&startWeek=1&project.id=1&semester.id='+semester_id[i+start_year*2]+'&ids='+ids;
        console.log('semester_id:'+semester_id[i+start_year*2])

        await page.open(url2,'post',classform).then(data=>{
            console.log(data)
        })
        const content2 = await page.property('content')
        //fs.writeFileSync('test.html', content2);
        //console.log(content2);
        $ = await cheerio.load(content2,{decodeEntities: false});
        //let form = $('pre').next().html();
        let list = await  $('.grid table tbody').html();
        list = await '<table>' + list + '</table>'
        let classtable_semester = await getclass(list);
        //console.log(list)
        //form = '<table>' + form + '</table>'
        //fs.writeFileSync('form.html', form);
        //fs.writeFileSync('list.html', list);
        //console.log(form);
        classtable[semester[i]] = classtable_semester 
    }


    await instance.exit();



    return classtable;
    //return list;
}

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res)=>{
    res.sendfile('./smbit.html');
})

app.post('/', (req, res)=>{
    let id = req.body.id;
    let passwd = req.body.passwd;
    console.log(id, passwd)
    let classtable = listhtml(id, passwd).then(data=>{
        console.log(data)
        res.send(data);
    });

    //console.log(classtable);
})



app.listen(3000, ()=>{
    console.log('server start...')
})

