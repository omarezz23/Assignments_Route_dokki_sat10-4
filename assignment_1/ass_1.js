/*1.1
let str = "123";
let num = Number(str);

console.log(num + 7);*/
///////////////////////////////////////////////////
//1.2
// let value = 'omar';

// if (!value) {
//     console.log("Invalid");
// } else {
//     console.log("Valid");
// }

//////////////////////
//1.3
// for (let index = 0; index <= 10; index++) {

//     if (index % 2 === 0) {
//         continue;
//     }
//     console.log(index);
// }
//////////////////////////////////
//1.4
// let numbers = [1, 2, 3, 4, 5];

// function isEven(num) {
//     if (num % 2 === 0) {
//        return num;
//     }
// }
// let evenNumbers = numbers.filter(isEven);

// console.log(evenNumbers);
///////////////////////////////////
//1.5
// let arr1 = [1, 2, 3];
// let arr2 = [4, 5, 6];

// let mergedArray = [...arr1, ...arr2];

// console.log(mergedArray);
/////////////////////////////
//1.6
// let day = 2;

// switch (day) {
//   case 1:
//     console.log("Sunday");
//     break;

//   case 2:
//     console.log("Monday");
//     break;

//   case 3:
//     console.log("Tuesday");
//     break;

//   case 4:
//     console.log("Wednesday");
//     break;

//   case 5:
//     console.log("Thursday");
//     break;

//   case 6:
//     console.log("Friday");
//     break;

//   case 7:
//     console.log("Saturday");
//     break;

//   default:
//     console.log("Invalid Day");
// }
/////////////////////////////////////////////////
//1.7
// var arr = ["a", "ab", "abc"];
// var lengths = arr.map(function (item) {
//   return item.length;
// });

// console.log(lengths);
// //////////////////////////////////////////
//1.8
// function checkDivisible(num) {
//     if (num % 3 === 0 && num % 5 === 0) {
//         return "Divisible by both";
//     } else {
//         return "Not divisible by both";
//     }
// }
// console.log(checkDivisible(20));
// console.log(checkDivisible(45));

///////////////////////////////////////
//1.9

// const sq = n1 => Math.pow(n1, 2);
// console.log(sq(4))

////////////////////////////////
//1.10
// let user = { name: "John", age: 25, gender: "male" };

// const { name, age } = user;

// console.log(`${name} is ${age} years old`);
///////////////////////////////////////////////////
//1.11
// function sum(...num) {
//     var total = 0;

//     for (var i = 0; i < num.length; i++) {
//         total = total + num[i];
//     }

//     return total;
// }

// console.log(sum(1, 2, 3, 4, 5));
//////////////////////
//1.12

///////////////////////////
//1.13

//////////////////////////
//1.14
// function getKeys(obj) {
//     return Object.keys(obj);
// }

// var person = {
//     name: "John",
//     age: 30
// };

// console.log(getKeys(person));
////////////////////
//1.15
// function splitWords(str) {
//     return str.split(" ");
// }

// console.log(splitWords("The quick brown fox"));
////////////////////////////
//2.1
//for of to sync task 
//foreach for async task
////////////////////////////
//2.2
//ال هويستنج هتقدر توصل للمتغير قبل متعرفو بس هيديك undefined
//اما ال tdz مش هتخليك توصل للمتغير قبل متعرفو
/////////////////////////
//2.3
//== قيمه فقط اما ال === قيمه ونوع بيانات 
////////////////////////////////
//2.4
//try تتعامل مع الكود
//catch تاخد الخطا وتتعامل معاه
//اهميتهم بيكمل الكود عادي من غير ميف لانو خد الخطا ف حته لوحدو بقاش ضمن الكود
///////////////////////////////
//2.5
//conversion بنغير نوع البيانات ب ايدنا عن طريق خطوات ف الكود 
//coercion الجافا هي اللي بتغير نوع البيانات علي حسب اللي هي شايفاه صح
////////////////////////////////////