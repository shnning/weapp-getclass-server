const fs = require('fs');
const cheerio = require('cheerio');



//去除字符串中的空格
let trim = str=> {
      str = str.replace(/^\s+/, '');
      for (let i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1);
          break;
        }
      }
      return str;
    }

let weekday = str=>{
    if(str == '星期一'){
        return 1
    }
    if(str == '星期二'){
        return 2
    }
    if(str == '星期三'){
        return 3
    }
    if(str == '星期四'){
        return 4
    }
    if(str == '星期五'){
        return 5
    }
    if(str == '星期六'){
        return 6
    }
    if(str == '星期日'){
        return 7
    }
}

//去除空格元素
let getattr = obj =>{
    let list = [];
    for(let i = 0; i < obj.length; i++){
        if(obj[i] != '')
        list.push(obj[i])
    }
    return list;
}

let getclass = list=>{
    let $ = cheerio.load(list, {decodeEntities:false});
// console.log($('tr ').children('td').html())
// console.log($('tr').next().html())
    let classtable = [];

    for(let i = $('tr').first(); i!=false;){
        //console.log(i)
        i.children('td').each((index, elem)=>{
            if(index == 3)classname = $(elem).text();
            //console.log(index, $(elem).text())
            if(index == 7){
                let attr = $(elem).html().split('<br>')
                //console.log(attr)
                if(attr[0] != ''){
                    for(j = 0; j < attr.length; j++){
                        let mes = attr[j].split(' ');
                        mes = getattr(mes);
                        console.log(weekday(mes[1]))
                        if(weekday(mes[1])){
                            let week = mes[3].split(',')
                            //console.log(week)
                            if(week.length != 1){
                                for(let k=0; k<week.length; k++){
                                    let [startweek, endweek] = week[k].replace(/\[|]/g, '').split('-');
                                    let [startclass, endclass] = mes[2].split('-');
                                    if(endweek == null)endweek = startweek;
                                    let json = {
                                        type:Math.floor(Math.random() * 100 % 6),
                                        classday:weekday(mes[1]),
                                        startweek: parseInt(startweek),
                                        endweek: parseInt(endweek),
                                        startclass: parseInt(startclass),
                                        endclass: parseInt(endclass),
                                        course: classname+'('+mes[0]+')'+'@'+mes[4],
                                    }
                                    classtable.push(json)
                                }
                            }else{
                            let [startweek, endweek] = mes[3].replace(/\[|]/g, '').split('-');
                            let [startclass, endclass] = mes[2].split('-');
                            if(endweek == null)endweek = startweek;
                            let json = {
                                type:Math.floor(Math.random() * 100 % 6),
                                classday:weekday(mes[1]),
                                startweek: parseInt(startweek),
                                endweek: parseInt(endweek),
                                startclass: parseInt(startclass),
                                endclass: parseInt(endclass),
                                course: classname+'('+mes[0]+')'+'@'+mes[4],
                            }
                            classtable.push(json)
                            }
                        }else{
                            let week = mes[2].split(',')
                            //console.log(week)
                            if(week.length != 1){
                                for(let k=0; k<week.length; k++){
                                    let [startweek, endweek] = week[k].replace(/\[|]/g, '').split('-');
                                    let [startclass, endclass] = mes[1].split('-');
                                    if(endweek == null)endweek = startweek;
                                    let json = {
                                        type:Math.floor(Math.random() * 100 % 6),
                                        classday:weekday(mes[0]),
                                        startweek: parseInt(startweek),
                                        endweek: parseInt(endweek),
                                        startclass: parseInt(startclass),
                                        endclass: parseInt(endclass),
                                        course: classnam+'@'+mes[3],
                                    }
                                    classtable.push(json)
                                }
                            }else{
                            let [startweek, endweek] = mes[2].replace(/\[|]/g, '').split('-');
                            let [startclass, endclass] = mes[1].split('-');
                            if(endweek == null)endweek = startweek;
                            let json = {
                                type:Math.floor(Math.random() * 100 % 6),
                                classday:weekday(mes[0]),
                                startweek: parseInt(startweek),
                                endweek: parseInt(endweek),
                                startclass: parseInt(startclass),
                                endclass: parseInt(endclass),
                                course: classname+'@'+mes[3],
                            }
                            classtable.push(json)
                            }
                        }
                        //console.log(mes);


                    }
                }
            }
        });
    // console.log(i.next().html())
        i = i.next()
    }
    return classtable;
}



// let temp = fs.readFileSync('list.html').toString('utf8')
// temp = '<table>' + temp + '</table>'

// let $ = cheerio.load(temp, {decodeEntities:false});
// // console.log($('tr ').children('td').html())
// // console.log($('tr').next().html())
// let classtable = [];

// for(let i = $('tr').first(); i!=false;){
//     //console.log(i)
//     i.children('td').each((index, elem)=>{
//         if(index == 3)classname = $(elem).text();
//         //console.log(index, $(elem).text())
//         if(index == 7){
//             let attr = $(elem).html().split('<br>')
//             console.log(attr)
//             if(attr[0] != ''){
//                 for(j = 0; j < attr.length; j++){
//                     let mes = attr[j].split(' ');
//                     mes = getattr(mes);
//                     console.log(mes);
//                     let week = mes[3].split(',')
//                     console.log(week)
//                     if(week.length != 1){
//                         for(let k=0; k<week.length; k++){
//                             let [startweek, endweek] = week[k].replace(/\[|]/g, '').split('-');
//                             let [startclass, endclass] = mes[2].split('-');
//                             if(endweek == null)endweek = startweek;
//                             let json = {
//                                 classday:weekday(mes[1]),
//                                 startweek: startweek,
//                                 endweek: endweek,
//                                 startclass: startclass,
//                                 endclass: endclass,
//                                 class: classname+'('+mes[0]+')'+'@'+mes[4],
//                             }
//                             classtable.push(json)
//                         }
//                     }else{
//                     let [startweek, endweek] = mes[3].replace(/\[|]/g, '').split('-');
//                     let [startclass, endclass] = mes[2].split('-');
//                     if(endweek == null)endweek = startweek;
//                     let json = {
//                         classday:weekday(mes[1]),
//                         startweek: parseInt(startweek),
//                         endweek: parseInt(endweek),
//                         startclass: parseInt(startclass),
//                         endclass: parseInt(endclass),
//                         class: classname+'('+mes[0]+')'+'@'+mes[4],
//                     }
//                     classtable.push(json)
//                     }

//                 }
//             }
//         }
//     });
//    // console.log(i.next().html())
//     i = i.next()
// }

// console.log(classtable)
// fs.writeFileSync('form.txt', classtable.toString())
    
// console.log('12'-'2')
// let str = '\t\t\t8-15\n'
// //console.log(temp);
// str = trim(str)
// console.log(str.split('-'))

module.exports = getclass