// const users = [
//     { id: 1, name: 'Alice', age: 25, city: 'New York', active: false },
//     { id: 2, name: 'Bob', age: 30, city: 'Los Angeles', active: false },
//     { id: 3, name: 'Charlie', age: 35, city: 'Chicago', active: false },
//     { id: 4, name: 'David', age: 28, city: 'New York', active: false },
//     { id: 5, name: 'Eve', age: 22, city: 'San Francisco', active: false },
//     { id: 6, name: 'Frank', age: 40, city: 'Chicago', active: false },
//     { id: 7, name: 'Grace', age: 27, city: 'Los Angeles', active: false },
//     { id: 8, name: 'Hank', age: 33, city: 'New York', active: false },
//     { id: 9, name: 'Ivy', age: 29, city: 'San Francisco', active: false },
//     { id: 10, name: 'Jack', age: 23, city: 'Chicago', active: false }
//   ];


// const findSelectedUser = (id, array) => {
//     const chagnedArrayById = array.map((element) => {
//         if (id === element.id) {
//             return {
//                 ...element,
//                 active: true,
//             }
//         }

//         return element
//     })

//     return chagnedArrayById
// }

// const test = findSelectedUser(6, users)

// const newArr = users.map((user) => {
//     if (user.age > 30) {
//         return {
//             ...user,
//             status: "Дед"
//         }
//     } 
    
//     return {
//         ...user,
//         status: "Очень молод"
//     }
// })

// console.log(newArr, 'arraaaaaaay')




//   const filteredArrayByAge = [];

//   for (let i = 0; i < users.length; i++) {
//     if (users[i].age > 30) {
//         filteredArrayByAge.push(users[i])
//     }
//   }

//   const filteredArrayByAge2 = users.filter((user) => user.age > 30)

//   console.log(filteredArrayByAge, '- first variant')
//   console.log(filteredArrayByAge2, '- second variant')

function test123 () {
    console.log(123)
}

() => '123'

const getName2 = () => {

   return '123'
}

console.log(getName2())